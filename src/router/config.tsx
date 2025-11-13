
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

// Lazy loading dos componentes
const HomePage = lazy(() => import('../pages/home/page'));
const PhoneNumbersPage = lazy(() => import('../pages/phone-numbers/page'));
const CampaignsPage = lazy(() => import('../pages/campaigns/page'));
const KnowledgePage = lazy(() => import('../pages/knowledge/page'));
const CallLogsPage = lazy(() => import('../pages/call-logs/page'));
const SettingsPage = lazy(() => import('../pages/settings/page'));
const AdminPage = lazy(() => import('../pages/admin/page'));
const LoginPage = lazy(() => import('../pages/login/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/phone-numbers',
    element: <PhoneNumbersPage />
  },
  {
    path: '/campaigns',
    element: <CampaignsPage />
  },
  {
    path: '/knowledge',
    element: <KnowledgePage />
  },
  {
    path: '/call-logs',
    element: <CallLogsPage />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  },
  {
    path: '/admin',
    element: <AdminPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;
