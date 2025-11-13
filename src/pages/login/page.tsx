import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Se já estiver logado, redirecionar para home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Lado esquerdo - Informações */}
        <div className="hidden lg:flex flex-col space-y-6 flex-1">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              MillisAI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Plataforma de Agentes de Voz com IA
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-robot-2-line text-2xl text-white"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Agentes Inteligentes
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Crie e gerencie agentes de voz com inteligência artificial avançada
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-phone-line text-2xl text-white"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Chamadas Automatizadas
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Automatize suas campanhas de chamadas com eficiência
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-bar-chart-line text-2xl text-white"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Análises Detalhadas
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Acompanhe métricas e resultados em tempo real
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="flex-1 max-w-md w-full">
          {showRegister ? (
            <RegisterForm
              onSuccess={() => setShowRegister(false)}
              onSwitchToLogin={() => setShowRegister(false)}
            />
          ) : (
            <LoginForm
              onSwitchToRegister={() => setShowRegister(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
