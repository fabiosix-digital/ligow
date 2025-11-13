import { useState } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import ImportPhoneModal from './components/ImportPhoneModal';
import PurchasePhoneModal from './components/PurchasePhoneModal';

interface PhoneNumber {
  id: string;
  phone: string;
  agent: string;
  region: string;
  created: string;
  nextCycle: string;
}

export default function PhoneNumbersPage() {
  const [phoneNumbers] = useState<PhoneNumber[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Números de telefone
            </h1>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsImportModalOpen(true)}
                icon={<i className="ri-download-line"></i>}
              >
                Número de importação
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsPurchaseModalOpen(true)}
                icon={<i className="ri-add-line"></i>}
              >
                Número de compra
              </Button>
            </div>
          </div>

          {/* Table Header */}
          <Card className="mb-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              <div>Telefone</div>
              <div>Agente</div>
              <div>Região</div>
              <div>Criado</div>
              <div>Próximo ciclo</div>
            </div>
          </Card>

          {/* Empty State */}
          {phoneNumbers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-phone-line text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum número de telefone ativo encontrado.
              </h3>
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  onClick={() => setIsPurchaseModalOpen(true)}
                  icon={<i className="ri-add-line"></i>}
                >
                  Número de compra
                </Button>
              </div>
            </div>
          )}

          {/* Phone Numbers List */}
          {phoneNumbers.length > 0 && (
            <div className="space-y-2">
              {phoneNumbers.map((phone) => (
                <Card key={phone.id} className="hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {phone.phone}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {phone.agent}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {phone.region}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {phone.created}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {phone.nextCycle}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <ImportPhoneModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <PurchasePhoneModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}
