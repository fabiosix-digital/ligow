import { useState, useEffect } from 'react';
import { Header } from '../../components/feature/Header';
import { Sidebar } from '../../components/feature/Sidebar';
import { Button } from '../../components/base/Button';
import { Badge } from '../../components/base/Badge';
import { Card } from '../../components/base/Card';
import { Input } from '../../components/base/Input';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface AdminStats {
  total_users: number;
  active_users: number;
  total_campaigns: number;
  active_campaigns: number;
  total_calls: number;
  successful_calls: number;
  total_agents: number;
  active_agents: number;
  total_revenue: number;
  avg_call_duration: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  created_at: string;
  last_sign_in_at: string;
}

interface SystemLog {
  id: string;
  phone_number: string;
  status: string;
  duration: number;
  cost: number;
  created_at: string;
  campaigns: { name: string };
  agents: { name: string };
  users: { full_name: string; email: string };
}

function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [millisApiKey, setMillisApiKey] = useState('');
  const [apiKeyLoading, setApiKeyLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAdminData();
      loadMillisApiKey();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-panel-api', {
        body: { action: 'get-dashboard-stats' }
      });

      if (error) throw error;
      setStats(data.stats);
    } catch (error) {
      console.error('Erro ao carregar dados do admin:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-panel-api', {
        body: { action: 'get-all-users' }
      });

      if (error) throw error;
      setUsers(data.users);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const loadSystemLogs = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-panel-api', {
        body: { action: 'get-system-logs' }
      });

      if (error) throw error;
      setLogs(data.logs);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  };

  const loadMillisApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'millis_api_key')
        .single();

      if (data) {
        setMillisApiKey(data.value);
      }
    } catch (error) {
      console.error('Erro ao carregar chave API:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMillisApiKey = async () => {
    setApiKeyLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'millis_api_key',
          value: millisApiKey,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Também salvar nos secrets do Supabase Edge Functions
      const { error: secretError } = await supabase.functions.invoke('admin-panel-api', {
        body: { 
          action: 'update-millis-api-key',
          api_key: millisApiKey
        }
      });

      if (secretError) throw secretError;

      alert('Chave API da MillisAI salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar chave API:', error);
      alert('Erro ao salvar chave API');
    } finally {
      setApiKeyLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-panel-api', {
        body: { 
          action: 'update-user-status',
          user_id: userId,
          status
        }
      });

      if (error) throw error;
      loadUsers();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-panel-api', {
        body: { 
          action: 'update-user-role',
          user_id: userId,
          role
        }
      });

      if (error) throw error;
      loadUsers();
    } catch (error) {
      console.error('Erro ao atualizar função:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto px-8 py-6">
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Carregando painel administrativo...</span>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="manager">
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Painel Administrativo 🛠️
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Gerencie usuários, métricas e configurações do sistema
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Logado como: <span className="font-medium text-gray-900">{user?.full_name || user?.name}</span> 
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === 'dashboard'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('users');
                      loadUsers();
                    }}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === 'users'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Usuários
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('logs');
                      loadSystemLogs();
                    }}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === 'logs'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Logs do Sistema
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === 'settings'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Configurações
                  </button>
                </nav>
              </div>

              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && stats && (
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="ri-user-line text-xl text-blue-600"></i>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <i className="ri-user-check-line text-xl text-green-600"></i>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.active_users}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <i className="ri-phone-line text-xl text-purple-600"></i>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total de Chamadas</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.total_calls}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <i className="ri-money-dollar-circle-line text-xl text-yellow-600"></i>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Receita Total</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Campanhas</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold">{stats.total_campaigns}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ativas:</span>
                          <span className="font-semibold text-green-600">{stats.active_campaigns}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Agentes IA</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold">{stats.total_agents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ativos:</span>
                          <span className="font-semibold text-green-600">{stats.active_agents}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taxa de Sucesso:</span>
                          <span className="font-semibold text-green-600">
                            {stats.total_calls > 0 ? Math.round((stats.successful_calls / stats.total_calls) * 100) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duração Média:</span>
                          <span className="font-semibold">{formatDuration(stats.avg_call_duration)}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Gerenciar Usuários
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Usuário
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Função
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Criado em
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.full_name || 'Sem nome'}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={user.role || 'user'}
                                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="user">Usuário</option>
                                  <option value="admin">Admin</option>
                                  <option value="manager">Gerente</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  variant={user.status === 'active' ? 'success' : 'secondary'}
                                >
                                  {user.status === 'active' ? 'Ativo' : 'Inativo'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(user.created_at)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => updateUserStatus(
                                    user.id, 
                                    user.status === 'active' ? 'inactive' : 'active'
                                  )}
                                  className={`mr-3 ${
                                    user.status === 'active' 
                                      ? 'text-red-600 hover:text-red-900' 
                                      : 'text-green-600 hover:text-green-900'
                                  }`}
                                >
                                  {user.status === 'active' ? 'Desativar' : 'Ativar'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* Logs Tab */}
              {activeTab === 'logs' && (
                <div className="space-y-6">
                  <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Logs do Sistema (Últimas 50 chamadas)
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Telefone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Usuário
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Campanha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Duração
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Custo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {logs.map((log) => (
                            <tr key={log.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.phone_number}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {log.users?.full_name || 'N/A'}
                                  </div>
                                  <div className="text-sm text-gray-500">{log.users?.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.campaigns?.name || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  variant={
                                    log.status === 'completed' ? 'success' :
                                    log.status === 'failed' ? 'destructive' : 'secondary'
                                  }
                                >
                                  {log.status === 'completed' ? 'Concluída' :
                                   log.status === 'failed' ? 'Falhou' :
                                   log.status === 'busy' ? 'Ocupado' : 'Sem resposta'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDuration(log.duration)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(log.cost)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(log.created_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      Configurações da API MillisAI
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chave API da MillisAI
                        </label>
                        <Input
                          type="password"
                          value={millisApiKey}
                          onChange={(e) => setMillisApiKey(e.target.value)}
                          placeholder="Insira sua chave API da MillisAI"
                          className="w-full"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Esta chave será usada para conectar com a API da MillisAI e realizar chamadas reais.
                        </p>
                      </div>
                      <Button
                        onClick={saveMillisApiKey}
                        disabled={!millisApiKey || apiKeyLoading}
                        className="whitespace-nowrap"
                      >
                        {apiKeyLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <i className="ri-save-line mr-2"></i>
                            Salvar Chave API
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Informações do Sistema
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Versão do Sistema:</p>
                        <p className="font-semibold">v1.0.0</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Última Atualização:</p>
                        <p className="font-semibold">{new Date().toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status da API:</p>
                        <Badge variant={millisApiKey ? 'success' : 'destructive'}>
                          {millisApiKey ? 'Configurada' : 'Não Configurada'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ambiente:</p>
                        <p className="font-semibold">Produção</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AdminPage;
