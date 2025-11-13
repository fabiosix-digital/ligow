import { useState } from 'react';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import { agents } from '../../../mocks/agents';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: any) => void;
}

export function CampaignModal({
  isOpen,
  onClose,
  onSave,
}: CampaignModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    agent: '',
    description: '',
    targetAudience: '',
    script: '',
    additionalMetadata: [{ key: '', value: '' }],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetadataChange = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const newMetadata = [...formData.additionalMetadata];
    newMetadata[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      additionalMetadata: newMetadata,
    }));
  };

  const addMetadataField = () => {
    setFormData((prev) => ({
      ...prev,
      additionalMetadata: [...prev.additionalMetadata, { key: '', value: '' }],
    }));
  };

  const removeMetadataField = (index: number) => {
    if (formData.additionalMetadata.length > 1) {
      const newMetadata = formData.additionalMetadata.filter(
        (_, i) => i !== index,
      );
      setFormData((prev) => ({
        ...prev,
        additionalMetadata: newMetadata,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newCampaign = {
      id: Date.now().toString(),
      name: formData.name,
      status: 'Ativa',
      agent: formData.agent,
      phoneNumber: formData.phoneNumber,
      created: new Date().toLocaleDateString('pt-BR'),
      calls: 0,
      conversions: 0,
      conversionRate: '0%',
      cost: 'R$ 0,00',
      revenue: 'R$ 0,00',
    };

    try {
      onSave(newCampaign);
    } catch (err) {
      console.error('Error saving campaign:', err);
    } finally {
      setIsLoading(false);
      onClose();

      // Reset form
      setFormData({
        name: '',
        phoneNumber: '',
        agent: '',
        description: '',
        targetAudience: '',
        script: '',
        additionalMetadata: [{ key: '', value: '' }],
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Criar registro de campanha
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Por favor, insira o número de telefone e os metadados para o
            registro da campanha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome da campanha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome da campanha *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite o nome da campanha"
                required
              />
            </div>

            {/* Número de telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de telefone *
              </label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange('phoneNumber', e.target.value)
                }
                placeholder='ou seja, "+5511999999999"'
                required
              />
            </div>

            {/* Agente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agente *
              </label>
              <select
                value={formData.agent}
                onChange={(e) => handleInputChange('agent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8"
                required
              >
                <option value="">Selecione um agente</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.name}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Público-alvo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Público-alvo
              </label>
              <Input
                type="text"
                value={formData.targetAudience}
                onChange={(e) =>
                  handleInputChange('targetAudience', e.target.value)
                }
                placeholder="Descreva o público-alvo"
              />
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição da campanha
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder="Descreva os objetivos e detalhes da campanha"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Script */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Script da campanha
              </label>
              <textarea
                value={formData.script}
                onChange={(e) => handleInputChange('script', e.target.value)}
                placeholder="Digite o script que será usado na campanha"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Metadados adicionais */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Metadados adicionais
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMetadataField}
                className="text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 whitespace-nowrap"
              >
                <i className="ri-add-line mr-1"></i>
                Adicionar campo
              </Button>
            </div>

            <div className="space-y-3">
              {formData.additionalMetadata.map((metadata, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    type="text"
                    value={metadata.key}
                    onChange={(e) =>
                      handleMetadataChange(index, 'key', e.target.value)
                    }
                    placeholder='ou seja, "nome", "e-mail"'
                  />
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={metadata.value}
                      onChange={(e) =>
                        handleMetadataChange(index, 'value', e.target.value)
                      }
                      placeholder='ou seja, "John Doe", "john@example.com"'
                      className="flex-1"
                    />
                    {formData.additionalMetadata.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMetadataField(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors cursor-pointer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-700 text-white whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Criando...
                </>
              ) : (
                'Criar'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CampaignModal;
