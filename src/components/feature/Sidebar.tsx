
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  submenu?: MenuItem[];
  adminOnly?: boolean;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems: MenuItem[] = [
  {
    id: 'agents',
    label: 'Agentes de voz',
    icon: 'ri-mic-line',
    path: '/'
  },
  {
    id: 'phone',
    label: 'Número de telefone',
    icon: 'ri-phone-line',
    path: '/phone-numbers'
  },
  {
    id: 'campaigns',
    label: 'Campanhas',
    icon: 'ri-megaphone-line',
    path: '/campaigns'
  },
  {
    id: 'knowledge',
    label: 'Conhecimento do agente',
    icon: 'ri-brain-line',
    path: '/knowledge'
  },
  {
    id: 'calls',
    label: 'Registros de chamadas',
    icon: 'ri-history-line',
    path: '/call-logs'
  },
  {
    id: 'admin',
    label: 'Painel Admin',
    icon: 'ri-admin-line',
    path: '/admin',
    adminOnly: true
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: 'ri-settings-3-line',
    path: '/settings',
    submenu: [
      {
        id: 'api-keys',
        label: 'Chaves de API',
        icon: 'ri-key-line',
        path: '/settings/api-keys'
      },
      {
        id: 'credentials',
        label: 'Credenciais',
        icon: 'ri-shield-keyhole-line',
        path: '/settings/credentials'
      },
      {
        id: 'billing',
        label: 'Cobrança',
        icon: 'ri-bill-line',
        path: '/settings/billing'
      },
      {
        id: 'transactions',
        label: 'Transações',
        icon: 'ri-exchange-line',
        path: '/settings/transactions'
      }
    ]
  },
  {
    id: 'docs',
    label: 'Documentação',
    icon: 'ri-book-line',
    path: '/docs'
  },
  {
    id: 'whats-new',
    label: 'O que há de novo',
    icon: 'ri-notification-badge-line',
    path: '/whats-new'
  }
];

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['settings']);

  const handleMenuClick = (path: string, hasSubmenu: boolean = false) => {
    // Se o menu está recolhido e o item tem submenu, não expandir automaticamente
    if (isCollapsed && hasSubmenu) {
      // Apenas navegar se não tem submenu ou se é um item específico
      return;
    }
    
    if (path) {
      navigate(path);
    }
  };

  const toggleExpanded = (itemId: string) => {
    if (isCollapsed) return;
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  // Verificar se usuário é admin ou manager
  const isAdmin = user && ['admin', 'manager'].includes(user.role);

  // Filtrar itens do menu baseado nas permissões
  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && !isAdmin) {
      return false;
    }
    return true;
  });

  const renderMenuItem = (item: MenuItem, isSubmenu = false) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasSubmenu && !isCollapsed) {
              toggleExpanded(item.id);
            } else {
              navigate(item.path);
            }
          }}
          className={`
            w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors duration-200
            ${active
              ? 'bg-teal-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
            ${isSubmenu ? 'ml-6 pl-6' : ''}
            ${isCollapsed && !isSubmenu ? 'justify-center px-3' : ''}
          `}
          title={isCollapsed ? item.label : ''}
        >
          <div className={`flex items-center ${isCollapsed && !isSubmenu ? 'justify-center' : ''}`}>
            <i className={`${item.icon} text-lg ${isCollapsed && !isSubmenu ? '' : 'mr-3'}`}></i>
            {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </div>
          {hasSubmenu && !isCollapsed && (
            <i className={`ri-arrow-down-s-line transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} flex-shrink-0`}></i>
          )}
        </button>

        {hasSubmenu && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.submenu!.map(subItem => renderMenuItem(subItem, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className={`${isCollapsed ? 'w-20' : 'w-96'} h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0">
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className={`w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center ${isCollapsed ? '' : 'mr-3'}`}>
              <span className="text-white font-bold text-sm">ms</span>
            </div>
            {!isCollapsed && <span className="text-xl font-bold text-gray-900 dark:text-white">millis</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 min-h-0">
          <div className="space-y-1">
            {filteredMenuItems.map(item => renderMenuItem(item))}
          </div>
        </nav>

        {/* Credit Usage */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          {!isCollapsed ? (
            <>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Utilização de Crédito
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                $ 0,000 / $ 5,000
              </div>
              <button className="w-full px-3 py-2 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200 whitespace-nowrap">
                Comprar Créditos
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mb-2" title="Utilização de Crédito: $ 0,000 / $ 5,000">
                <i className="ri-wallet-line text-white text-sm"></i>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">
                $0K/$5K
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle button - positioned outside the sidebar */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-4 top-6 w-8 h-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
        title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        <i className={`${isCollapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'} text-sm`}></i>
      </button>
    </div>
  );
}

// Export the component both as default and as a named export without redeclaring it.
export { Sidebar };
