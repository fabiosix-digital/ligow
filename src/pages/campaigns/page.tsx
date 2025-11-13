
import { useState } from 'react';
import { Header } from '../../components/feature/Header';
import { Sidebar } from '../../components/feature/Sidebar';
import { Button } from '../../components/base/Button';
import { Badge } from '../../components/base/Badge';
import { CampaignModal } from './components/CampaignModal';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { useSupabaseData, useSupabaseUpdate, useMillisAI } from '../../hooks/useSupabase';

interface Campaign {
  id: string;
  name: string;
  description: string;
  agent_id: string;
  phone_number: string;
  target_audience: string;
  script: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  total_records: number;
  completed_calls: number;
  successful_calls: number;
  failed_calls: number;
  created_at: string;
  agents?: { name: string };
}

function CampaignsPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const { data: campaigns, loading, refetch } = useSupabaseData<Campaign>(
    'campaigns',
    `*, agents(name)`,
    [user?.id]
  );

  const { update } = useSupabaseUpdate<Campaign>('campaigns');
  const { callMillisAPI } = useMillisAI();

  const handleCreateCampaign = () => {
    setSelectedCampaign(null);
    setIsModalOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
    refetch();
  };

  const handleStartCampaign = async (campaignId: string) => {
    const result = await callMillisAPI('start-campaign', { campaign_id: campaignId });
    if (result.success) {
      refetch();
    }
  };

  const handlePauseCampaign = async (campaignId: string) => {
    await update(campaignId, { status: 'paused' });
    refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'paused': return 'yellow';
      case 'completed': return 'blue';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'paused': return 'Pausada';
      case 'completed': return 'Finalizada';
      case 'cancelled': return 'Cancelada';
      case 'draft': return 'Rascunho';
      default: return status;
    }
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
                  <h1 className="text-3xl font-bold text-gray-900">Campanhas</h1>
                  <p className="text-gray-600 mt-1">
                    Gerencie suas campanhas de chamadas automatizadas
                  </p>
                </div>
                <Button onClick={handleCreateCampaign} className="whitespace-nowrap">
                  <i className="ri-add-line mr-2"></i>
                  Nova Campanha
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-megaphone-line text-xl text-blue-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-play-circle-line text-xl text-green-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ativas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {campaigns.filter(c => c.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <i className="ri-pause-circle-line text-xl text-yellow-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pausadas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {campaigns.filter(c => c.status === 'paused').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ri-check-circle-line text-xl text-purple-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Finalizadas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {campaigns.filter(c => c.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaigns Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Suas Campanhas
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Carregando campanhas...</span>
                    </div>
                  ) : campaigns.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-megaphone-line text-2xl text-gray-400"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma campanha criada
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Crie sua primeira campanha para começar a automatizar suas chamadas
                      </p>
                      <Button onClick={handleCreateCampaign}>
                        <i className="ri-add-line mr-2"></i>
                        Criar Primeira Campanha
                      </Button>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Campanha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Agente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progresso
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Criada em
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {campaigns.map((campaign) => (
                          <tr key={campaign.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {campaign.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {campaign.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {campaign.agents?.name || 'Agente não encontrado'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge color={getStatusColor(campaign.status)}>
                                {getStatusText(campaign.status)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {campaign.completed_calls} / {campaign.total_records}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: campaign.total_records > 0 
                                      ? `${(campaign.completed_calls / campaign.total_records) * 100}%`
                                      : '0%'
                                  }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(campaign.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                {campaign.status === 'draft' || campaign.status === 'paused' ? (
                                  <button
                                    onClick={() => handleStartCampaign(campaign.id)}
                                    className="text-green-600 hover:text-green-900 p-1"
                                    title="Iniciar campanha"
                                  >
                                    <i className="ri-play-circle-line text-lg"></i>
                                  </button>
                                ) : campaign.status === 'active' ? (
                                  <button
                                    onClick={() => handlePauseCampaign(campaign.id)}
                                    className="text-yellow-600 hover:text-yellow-900 p-1"
                                    title="Pausar campanha"
                                  >
                                    <i className="ri-pause-circle-line text-lg"></i>
                                  </button>
                                ) : null}
                                
                                <button
                                  onClick={() => handleEditCampaign(campaign)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                  title="Editar campanha"
                                >
                                  <i className="ri-edit-line text-lg"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <CampaignModal
            campaign={selectedCampaign}
            onClose={handleModalClose}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default CampaignsPage;
