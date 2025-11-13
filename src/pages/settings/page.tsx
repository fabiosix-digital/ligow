import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../components/feature/Header';
import { Sidebar } from '../../components/feature/Sidebar';
import { Card } from '../../components/base/Card';
import { Input } from '../../components/base/Input';
import { Button } from '../../components/base/Button';
import { Badge } from '../../components/base/Badge';

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('api-keys');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    millis: '',
    public: ''
  });
  const [credentials, setCredentials] = useState({
    elevenLabs: '',
    cartesia: '',
    deepgram: ''
  });
  const [billing, setBilling] = useState({
    autoRecharge: false,
    limit: '',
    rechargeAmount: '',
    enterprisePlan: false
  });

  // Detectar a aba ativa baseada na URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/settings/api-keys') {
      setActiveTab('api-keys');
    } else if (path === '/settings/credentials') {
      setActiveTab('credentials');
    } else if (path === '/settings/billing') {
      setActiveTab('billing');
    } else if (path === '/settings/transactions') {
      setActiveTab('transactions');
    } else {
      setActiveTab('api-keys'); // Default para /settings
    }
  }, [location.pathname]);

  const tabs = [
    { id: 'api-keys', label: 'Chaves de API', icon: 'ri-key-line', path: '/settings/api-keys' },
    { id: 'credentials', label: 'Credenciais', icon: 'ri-shield-keyhole-line', path: '/settings/credentials' },
    { id: 'billing', label: 'Cobrança', icon: 'ri-bill-line', path: '/settings/billing' },
    { id: 'transactions', label: 'Transações', icon: 'ri-exchange-line', path: '/settings/transactions' }
  ];

  const transactions = [
    {
      id: '-OdkhptFt0k5mc7FGbCB',
      transaction: 'Crédito grátis',
      category: 'recarga',
      amount: '+ $ 5.0000',
      type: 'crédito',
      timestamp: '10/11/2025, 23:20:56'
    },
    {
      id: '-PdkhptFt0k5mc7FGbCD',
      transaction: 'Chamada de voz',
      category: 'uso',
      amount: '- $ 0.0250',
      type: 'débito',
      timestamp: '09/11/2025, 14:35:22'
    },
    {
      id: '-QdkhptFt0k5mc7FGbDE',
      transaction: 'Recarga automática',
      category: 'recarga',
      amount: '+ $ 10.0000',
      type: 'crédito',
      timestamp: '08/11/2025, 09:15:10'
    }
  ];

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  const handleSaveApiKeys = () => {
    console.log('Salvando chaves de API:', apiKeys);
  };

  const handleSaveCredentials = () => {
    console.log('Salvando credenciais:', credentials);
  };

  const handleSaveBilling = () => {
    console.log('Salvando configurações de cobrança:', billing);
  };

  const renderApiKeysTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Chaves de API
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chave de API
            </label>
            <div className="relative">
              <Input
                type="password"
                value={apiKeys.millis}
                onChange={(e) => setApiKeys({ ...apiKeys, millis: e.target.value })}
                placeholder="••••••••••••••••••••••••"
                className="pr-10"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i className="ri-eye-line"></i>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use esta chave de API no cabeçalho para chamar as APIs da Millis.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chave pública
            </label>
            <div className="relative">
              <Input
                type="password"
                value={apiKeys.public}
                onChange={(e) => setApiKeys({ ...apiKeys, public: e.target.value })}
                placeholder="••••••••••••••••••••••••"
                className="pr-10"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i className="ri-eye-line"></i>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Passe essa chave para os SDKs do cliente Millis para autenticar as solicitações.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveApiKeys} className="whitespace-nowrap">
            Salvar alterações
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCredentialsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Credenciais de Terceiros
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Onze Laboratórios
            </label>
            <Input
              type="password"
              value={credentials.elevenLabs}
              onChange={(e) => setCredentials({ ...credentials, elevenLabs: e.target.value })}
              placeholder="Chave de API"
            />
            <p className="text-xs text-gray-500 mt-1">
              Certifique-se de que sua conta tenha uma assinatura paga.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cartesia
            </label>
            <Input
              type="password"
              value={credentials.cartesia}
              onChange={(e) => setCredentials({ ...credentials, cartesia: e.target.value })}
              placeholder="Chave de API"
            />
            <p className="text-xs text-gray-500 mt-1">
              Certifique-se de que sua conta tenha uma assinatura paga.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deepgram
            </label>
            <Input
              type="password"
              value={credentials.deepgram}
              onChange={(e) => setCredentials({ ...credentials, deepgram: e.target.value })}
              placeholder="Chave de API"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use sua chave de API Deepgram para STT e TTS.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveCredentials} className="whitespace-nowrap">
            Salvar alterações
          </Button>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Utilização de Crédito
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Certifique-se de ter créditos suficientes para manter o serviço ininterrupto.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            $ 0,0000 / $ 5,0000
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoRecharge"
              checked={billing.autoRecharge}
              onChange={(e) => setBilling({ ...billing, autoRecharge: e.target.checked })}
              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="autoRecharge" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recarregue seus créditos automaticamente
            </label>
          </div>
          <p className="text-xs text-gray-500 ml-7">
            Mantenha seus serviços funcionando sem interrupções. Recarregue automaticamente seu saldo quando ele ficar abaixo do limite escolhido.
          </p>
          
          <div className="grid grid-cols-2 gap-4 ml-7">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Limite
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  value={billing.limit}
                  onChange={(e) => setBilling({ ...billing, limit: e.target.value })}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantidade de recarga
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  value={billing.rechargeAmount}
                  onChange={(e) => setBilling({ ...billing, rechargeAmount: e.target.value })}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          <div className="ml-7">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
              <Badge variant="secondary">Inativo</Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          Detalhes do pagamento
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Ainda não existe um método de pagamento.
        </p>
        <Button variant="outline" className="whitespace-nowrap">
          Adicionar método de pagamento
        </Button>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
          Plano Empresarial
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          $500/mês — receba $500 de crédito mensal. O consumo excedente volta ao valor normal de recarga.
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
          <Badge variant="secondary">inativo</Badge>
        </div>
        
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Benefícios</h5>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>- Limite de chamadas simultâneas mais alto: até 200</li>
            <li>- Chamadas de saída prioritárias (entrega mais rápida)</li>
            <li>- Suporte ao vivo premium e resolução de problemas</li>
          </ul>
        </div>
        
        <Button className="whitespace-nowrap">
          Ativar Plano Empresarial
        </Button>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveBilling} className="whitespace-nowrap">
          Salvar alterações
        </Button>
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Transações
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">EU IA</th>
                <th className="px-6 py-3">Transação</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Quantia</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Carimbo de data/hora</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {transaction.transaction}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={transaction.category === 'recarga' ? 'success' : 'secondary'}>
                      {transaction.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      transaction.amount.startsWith('+') 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={transaction.type === 'crédito' ? 'success' : 'destructive'}>
                      {transaction.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {transaction.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-exchange-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-500 dark:text-gray-400">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-8 py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Configurações
              </h1>
            </div>

            <Card className="p-0">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <i className={`${tab.icon} mr-2`}></i>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'api-keys' && renderApiKeysTab()}
                {activeTab === 'credentials' && renderCredentialsTab()}
                {activeTab === 'billing' && renderBillingTab()}
                {activeTab === 'transactions' && renderTransactionsTab()}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;