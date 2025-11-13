
import { useState, useEffect } from 'react';
import { Header } from '../../components/feature/Header';
import { Sidebar } from '../../components/feature/Sidebar';
import { AgentCard } from './components/AgentCard';
import { AgentModal } from './components/AgentModal';
import { Button } from '../../components/base/Button';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { useSupabaseData, useMillisAI } from '../../hooks/useSupabase';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'training';
  created_at: string;
  voice_id?: string;
  language?: string;
  personality?: string;
  instructions?: string;
}

interface DashboardStats {
  total_campaigns: number;
  active_campaigns: number;
  total_calls: number;
  successful_calls: number;
  total_agents: number;
  active_agents: number;
  total_cost: number;
  avg_duration: number;
}

function HomePage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  const { data: agents, loading: agentsLoading, refetch: refetchAgents } = useSupabaseData<Agent>(
    'agents',
    '*',
    [user?.id]
  );

  const { callMillisAPI } = useMillisAI();

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    const result = await callMillisAPI('get-analytics');
    if (result.success) {
      setStats(result.data.analytics);
    }
  };

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setIsModalOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
    refetchAgents();
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

  return (
    <ProtectedRoute>
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
                    Olá, {user?.full_name || 'Usuário'}! 👋
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Bem-vindo ao seu painel de controle MillisAI
                  </p>
                </div>
                <Button onClick={handleCreateAgent} className="whitespace-nowrap">
                  <i className="ri-add-line mr-2"></i>
                  Novo Agente
                </Button>
              </div>

              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="ri-phone-line text-xl text-blue-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total de Chamadas</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total_calls}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="ri-check-line text-xl text-green-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Chamadas Bem-sucedidas</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.successful_calls}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <i className="ri-robot-line text-xl text-purple-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Agentes Ativos</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.active_agents}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <i className="ri-money-dollar-circle-line text-xl text-yellow-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Custo Total</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_cost)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Agents Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Seus Agentes de IA
                    </h2>
                    <span className="text-sm text-gray-500">
                      {agents.length} agente{agents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {agentsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Carregando agentes...</span>
                    </div>
                  ) : agents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-robot-line text-2xl text-gray-400"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum agente criado
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Crie seu primeiro agente de IA para começar a automatizar suas chamadas
                      </p>
                      <Button onClick={handleCreateAgent}>
                        <i className="ri-add-line mr-2"></i>
                        Criar Primeiro Agente
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {agents.map((agent) => (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          onEdit={() => handleEditAgent(agent)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              {stats && stats.total_calls > 0 && (
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Estatísticas Rápidas
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">
                          {stats.active_campaigns}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Campanhas Ativas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                          {Math.round((stats.successful_calls / stats.total_calls) * 100)}%
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Taxa de Sucesso</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">
                          {formatDuration(stats.avg_duration)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Duração Média</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <AgentModal
            agent={selectedAgent}
            onClose={handleModalClose}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default HomePage;
