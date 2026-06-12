import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { renderWithProviders } from '../../test/test-utils';
import { server } from '../../test/mocks/server';
import ProfessionalsListPage from '../ProfessionalsListPage';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProfessionalsListPage', () => {
  it('shows loading skeleton initially', () => {
    renderWithProviders(<ProfessionalsListPage />);
    expect(screen.getByText('Buscando profesionales...')).toBeInTheDocument();
  });

  it('renders professional cards after loading', async () => {
    renderWithProviders(<ProfessionalsListPage />);

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    expect(screen.getByText('María García')).toBeInTheDocument();

    // "Plomería" and "Electricidad" appear both in filter buttons and cards
    const plomeriaElements = screen.getAllByText('Plomería');
    expect(plomeriaElements.length).toBeGreaterThanOrEqual(2);

    const electricidadElements = screen.getAllByText('Electricidad');
    expect(electricidadElements.length).toBeGreaterThanOrEqual(2);
  });

  it('shows empty state when no professionals match filter', async () => {
    server.use(
      http.get('*/api/professionals', () =>
        HttpResponse.json({
          data: [],
          meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
        })
      )
    );

    renderWithProviders(<ProfessionalsListPage />, {
      initialEntries: ['/profesionales?especialidad=herreria'],
    });

    await waitFor(() => {
      expect(
        screen.getByText('No hay profesionales en esta especialidad.')
      ).toBeInTheDocument();
    });
  });
});
