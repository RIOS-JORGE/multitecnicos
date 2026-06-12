import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from '../AboutPage';

describe('AboutPage', () => {
  it('renders "Sobre el Directorio" heading', () => {
    render(<AboutPage />);
    expect(
      screen.getByRole('heading', { name: /sobre el directorio/i })
    ).toBeInTheDocument();
  });

  it('renders static content without API calls', () => {
    render(<AboutPage />);
    // Static text that should always be present
    expect(screen.getByText(/conectar a profesionales/i)).toBeInTheDocument();
    expect(screen.getByText(/cómo funciona/i)).toBeInTheDocument();
    expect(screen.getByText(/contacto/i)).toBeInTheDocument();
    expect(
      screen.getByText(/info@directorioprofesional.com/i)
    ).toBeInTheDocument();
  });
});
