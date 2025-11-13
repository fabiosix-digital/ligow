
export interface Campaign {
  id: string;
  name: string;
  agent: string;
  records: number;
  status: 'Ativa' | 'Pausada' | 'Finalizada';
  createdAt: string;
  phone?: string;
  description?: string;
  targetAudience?: string;
  script?: string;
}

export const campaignsData: Campaign[] = [
  {
    id: '1',
    name: 'teste',
    agent: 'Agente Principal',
    records: 0,
    status: 'Pausada',
    createdAt: '11/11/2025, 10:41:52',
    phone: '+55 11 99999-9999',
    description: 'Campanha de teste para validação do sistema',
    targetAudience: 'Clientes potenciais',
    script: 'Olá, estou ligando para apresentar nossos serviços...'
  },
  {
    id: '2',
    name: 'Prospecção Q4',
    agent: 'Agente Vendas',
    records: 150,
    status: 'Ativa',
    createdAt: '10/11/2025, 14:30:22',
    phone: '+55 11 88888-8888',
    description: 'Campanha de prospecção para o quarto trimestre',
    targetAudience: 'Empresas médias',
    script: 'Bom dia, gostaria de apresentar uma solução que pode aumentar sua produtividade...'
  },
  {
    id: '3',
    name: 'Follow-up Clientes',
    agent: 'Agente Suporte',
    records: 75,
    status: 'Ativa',
    createdAt: '09/11/2025, 09:15:10',
    phone: '+55 11 77777-7777',
    description: 'Acompanhamento de clientes existentes',
    targetAudience: 'Clientes ativos',
    script: 'Olá, estou ligando para saber como está sua experiência com nosso produto...'
  },
  {
    id: '4',
    name: 'Black Friday 2025',
    agent: 'Agente Marketing',
    records: 300,
    status: 'Finalizada',
    createdAt: '01/11/2025, 08:00:00',
    phone: '+55 11 66666-6666',
    description: 'Campanha promocional da Black Friday',
    targetAudience: 'Base completa de clientes',
    script: 'Não perca as ofertas especiais da Black Friday! Temos descontos de até 50%...'
  },
  {
    id: '5',
    name: 'Pesquisa Satisfação',
    agent: 'Agente Pesquisa',
    records: 200,
    status: 'Ativa',
    createdAt: '05/11/2025, 16:45:30',
    phone: '+55 11 55555-5555',
    description: 'Pesquisa de satisfação com clientes',
    targetAudience: 'Clientes dos últimos 6 meses',
    script: 'Olá, gostaria de fazer uma breve pesquisa sobre sua satisfação com nossos serviços...'
  }
];

export const campaigns = campaignsData;
