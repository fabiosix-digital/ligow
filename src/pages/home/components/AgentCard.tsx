
import { useState } from 'react';
import Card from '../../../components/base/Card';
import Badge from '../../../components/base/Badge';

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

interface AgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
}

export function AgentCard({ agent, onEdit }: AgentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusVariant = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'training':
        return 'Treinando';
      default:
        return 'Inativo';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card hover className="relative">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-lg">
              {agent.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {agent.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {agent.description}
            </p>
            <div className="flex items-center justify-between">
              <Badge variant={getStatusVariant(agent.status)}>
                {getStatusLabel(agent.status)}
              </Badge>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(agent.created_at)}
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <i className="ri-more-2-line text-gray-500"></i>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
              <button
                onClick={() => {
                  onEdit(agent);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <i className="ri-edit-line mr-2"></i>
                Editar
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}