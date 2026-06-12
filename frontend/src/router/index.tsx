import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/layout/Layout';

const HomePage = lazy(() => import('../pages/HomePage'));
const ProfessionalsListPage = lazy(() => import('../pages/ProfessionalsListPage'));
const ProfessionalDetailPage = lazy(() => import('../pages/ProfessionalDetailPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));

const LazyLoad = ({ Component }: { Component: React.LazyExoticComponent<() => React.ReactElement> }) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Cargando...</p></div>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <LazyLoad Component={HomePage} /> },
      { path: 'profesionales', element: <LazyLoad Component={ProfessionalsListPage} /> },
      { path: 'profesionales/:slug', element: <LazyLoad Component={ProfessionalDetailPage} /> },
      { path: 'nosotros', element: <LazyLoad Component={AboutPage} /> },
    ],
  },
]);
