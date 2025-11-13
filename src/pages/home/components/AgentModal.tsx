
import { useState, useEffect } from 'react';
import { Button } from '../../../components/base/Button';
import { Input } from '../../../components/base/Input';
import { useSupabaseInsert, useSupabaseUpdate, useMillisAI } from '../../../hooks/useSupabase';

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

interface AgentModalProps {
  agent?: Agent | null;
  onClose: () => void;
}

export function AgentModal({ agent, onClose }: AgentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    voice_id: 'voice_001',
    language: 'pt-BR',
    personality: '',
    instructions: ''
  });

  const { insert, loading: insertLoading } = useSupabaseInsert<Agent>('agents');
  const { update, loading: updateLoading } = useSupabaseUpdate<Agent>('agents');
  const { callMillisAPI, loading: millisLoading } = useMillisAI();

  const loading = insertLoading || updateLoading || millisLoading;

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || '',
        description: agent.description || '',
        voice_id: agent.voice_id || 'voice_001',
        language: agent.language || 'pt-BR',
        personality: agent.personality || '',
        instructions: agent.instructions || ''
      });
    }
  }, [agent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (agent) {
        // Atualizar agente existente
        const result = await update(agent.id, formData);
        if (result.success) {
          onClose();
        }
      } else {
        // Criar novo agente
        const millisResult = await callMillisAPI('create-agent', formData);
        if (millisResult.success) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Erro ao salvar agente:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const voiceOptions = [
    { value: 'voice_001', label: 'Voz Feminina Profissional' },
    { value: 'voice_002', label: 'Voz Masculina Amigável' },
    { value: 'voice_003', label: 'Voz Feminina Jovem' },
    { value: 'voice_004', label: 'Voz Masculina Autoritária' },
    { value: 'voice_005', label: 'Voz Feminina Calorosa' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {agent ? 'Editar Agente' : 'Novo Agente de IA'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Agente *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Carla Vendas"
                required
              />
            </div>

            <div>
              <label htmlFor="voice_id" className="block text-sm font-medium text-gray-700 mb-2">
                Voz do Agente
              </label>
              <select
                id="voice_id"
                name="voice_id"
                value={formData.voice_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
              >
                {voiceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Breve descrição do agente e sua função"
            />
          </div>

          <div>
            <label htmlFor="personality" className="block text-sm font-medium text-gray-700 mb-2">
              Personalidade
            </label>
            <Input
              id="personality"
              name="personality"
              value={formData.personality}
              onChange={handleChange}
              placeholder="Ex: Profissional, empática e persuasiva"
            />
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Instruções para o Agente *
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Descreva como o agente deve se comportar, que tipo de chamadas deve fazer, como deve responder, etc."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Seja específico sobre o comportamento, tom de voz e objetivos do agente
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <i className="ri-information-line text-blue-600 mt-0.5 mr-3"></i>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Dicas para criar um bom agente:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Seja específico sobre o objetivo das chamadas</li>
                  <li>• Defina o tom de voz apropriado para seu público</li>
                  <li>• Inclua informações sobre produtos/serviços</li>
                  <li>• Estabeleça como lidar com objeções</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {agent ? 'Salvando...' : 'Criando...'}
                </>
              ) : (
                <>
                  <i className={`${agent ? 'ri-save-line' : 'ri-add-line'} mr-2`}></i>
                  {agent ? 'Salvar Alterações' : 'Criar Agente'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
