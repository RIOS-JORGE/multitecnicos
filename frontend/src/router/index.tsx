import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/layout/Layout';

const HomePage = lazy(() => import('../pages/HomePage'));
const ProfessionalsListPage = lazy(() => import('../pages/ProfessionalsListPage'));
const ProfessionalDetailPage = lazy(() => import('../pages/ProfessionalDetailPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const fallback = (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-gray-500">Cargando...</p>
  </div>
);

const SuspenseOutlet = () => (
  <Suspense fallback={fallback}>
    <Outlet />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <SuspenseOutlet />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'profesionales', element: <ProfessionalsListPage /> },
          { path: 'profesionales/:slug', element: <ProfessionalDetailPage /> },
          { path: 'nosotros', element: <AboutPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
