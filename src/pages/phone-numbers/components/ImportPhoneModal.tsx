
import { useState } from 'react';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';

interface ImportPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const providers = [
  { id: 'twilio', name: 'TWILIO', active: true },
  { id: 'vonage', name: 'VONAGE', active: false },
  { id: 'plivo', name: 'PLIVO', active: false },
  { id: 'exotel', name: 'EXOTEL', active: false },
  { id: 'telnyx', name: 'TELNYX', active: false }
];

export default function ImportPhoneModal({ isOpen, onClose }: ImportPhoneModalProps) {
  const [activeProvider, setActiveProvider] = useState('twilio');
  const [formData, setFormData] = useState({
    region: 'us-west',
    country: 'US',
    phoneNumber: '+12345678990',
    apiKey: '',
    apiSecret: '',
    accountId: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular importação
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Importar número de telefone
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Provider Tabs */}
        <div className="px-6 pt-4">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setActiveProvider(provider.id)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap
                  ${activeProvider === provider.id
                    ? 'bg-teal-500 text-white'
                    : provider.active
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }
                `}
                disabled={!provider.active}
              >
                {provider.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Region and Country Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Região
                </label>
                <div className="relative">
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="pr-8 w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:border-gray-600"
                  >
                    <option value="us-west">oeste dos EUA</option>
                    <option value="us-east">leste dos EUA</option>
                    <option value="eu-west">oeste da UE</option>
                    <option value="ap-south">sul da AP</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Selecione a região que corresponde à região da sua conta de provedor. Em caso de dúvida, escolha com base no destino da chamada.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  País
                </label>
                <div className="relative">
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="pr-8 w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:border-gray-600"
                  >
                    <option value="US">Estados Unidos ( +1 )</option>
                    <option value="BR">Brasil ( +55 )</option>
                    <option value="CA">Canadá ( +1 )</option>
                    <option value="UK">Reino Unido ( +44 )</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de telefone
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+12345678990"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:border-gray-600"
                required
              />
            </div>

            {/* API Credentials Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chave de API
                </label>
                <input
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  placeholder="Chave da API do provedor"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Segredo da API
                </label>
                <input
                  type="password"
                  value={formData.apiSecret}
                  onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                  placeholder="Segredo da API"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:border-gray-600"
                  required
                />
              </div>
            </div>

            {/* Account ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID da conta
              </label>
              <input
                type="text"
                value={formData.accountId}
                onChange={(e) => handleInputChange('accountId', e.target.value)}
                placeholder="ID da conta"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:border-gray-600"
                required
              />
            </div>

            {/* Tutorial Link */}
            <div className="flex items-center">
              <a
                href="#"
                className="text-teal-500 hover:text-teal-600 text-sm font-medium flex items-center"
              >
                Tutoriais
                <i className="ri-external-link-line ml-1 text-xs"></i>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Importando...
                  </>
                ) : (
                  'Importar'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
