import { useState } from 'react';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';

interface PurchasePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchasePhoneModal({ isOpen, onClose }: PurchasePhoneModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    
    // Simular compra
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      // Aqui você adicionaria a lógica para comprar o número
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Tutoriais
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          <Card className="mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-phone-line text-2xl text-teal-600 dark:text-teal-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Número de telefone para compra
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Você precisa ter informações de pagamento ativas para comprar um número de telefone.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <i className="ri-check-line text-teal-500 mr-2"></i>
                  Configure seu método de pagamento
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <i className="ri-check-line text-teal-500 mr-2"></i>
                  Escolha sua região preferida
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <i className="ri-check-line text-teal-500 mr-2"></i>
                  Selecione um número disponível
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              FECHAR
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handlePurchase}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  PROCESSANDO...
                </>
              ) : (
                'CONFIGURAR PAGAMENTO'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}