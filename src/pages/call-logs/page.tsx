
import { useState } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Button from '../../components/base/Button';
import Input from '../../components/base/Input';
import Badge from '../../components/base/Badge';
import { callLogs } from '../../mocks/call-logs';

export default function CallLogsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completada':
        return <Badge variant="success">{status}</Badge>;
      case 'Falhou':
        return <Badge variant="error">{status}</Badge>;
      case 'Ocupado':
        return <Badge variant="warning">{status}</Badge>;
      case 'Sem resposta':
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredLogs = callLogs.filter(log => {
    const matchesSearch = log.euId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.phone.includes(searchTerm);
    const matchesAgent = !agentFilter || log.agent.toLowerCase().includes(agentFilter.toLowerCase());
    const matchesStatus = !statusFilter || log.status === statusFilter;
    const matchesPhone = !phoneFilter || log.phone.includes(phoneFilter);
    
    return matchesSearch && matchesAgent && matchesStatus && matchesPhone;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setAgentFilter('');
    setStatusFilter('');
    setPhoneFilter('');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = agentFilter || statusFilter || phoneFilter || startDate || endDate;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Registros de chamadas
            </h1>
          </div>

          {/* Filters Accordion */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            >
              <div className="flex items-center gap-2">
                <i className="ri-filter-line text-gray-500 dark:text-gray-400"></i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros</span>
                {hasActiveFilters && (
                  <Badge variant="primary" className="ml-2">
                    {[agentFilter, statusFilter, phoneFilter, startDate, endDate].filter(Boolean).length}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilters();
                    }}
                    className="text-teal-600 hover:text-teal-700"
                  >
                    <i className="ri-close-line mr-1"></i>
                    Limpar
                  </Button>
                )}
                <i className={`ri-arrow-${isFiltersExpanded ? 'up' : 'down'}-s-line text-gray-500 dark:text-gray-400 transition-transform`}></i>
              </div>
            </div>

            {isFiltersExpanded && (
              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Agente
                    </label>
                    <select
                      value={agentFilter}
                      onChange={(e) => setAgentFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8"
                    >
                      <option value="">Todos os agentes</option>
                      <option value="Carla Sanches">Carla Sanches</option>
                      <option value="Roberto Silva">Roberto Silva</option>
                      <option value="Ana Costa">Ana Costa</option>
                      <option value="Pedro Oliveira">Pedro Oliveira</option>
                      <option value="Maria Santos">Maria Santos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status da chamada
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8"
                    >
                      <option value="">Todos os status</option>
                      <option value="Completada">Completada</option>
                      <option value="Falhou">Falhou</option>
                      <option value="Ocupado">Ocupado</option>
                      <option value="Sem resposta">Sem resposta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Número de telefone
                    </label>
                    <Input
                      type="text"
                      placeholder="+123456789"
                      value={phoneFilter}
                      onChange={(e) => setPhoneFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hora de início
                    </label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hora final
                    </label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button variant="primary">
                    Aplicar filtros
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-phone-line text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum registro encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Não há registros de chamadas que correspondam aos filtros aplicados.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        EU ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Agente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Telefone #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Custo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Duração
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Carimbo de data/hora
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {log.euId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.agent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(log.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.cost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {log.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
