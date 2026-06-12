import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WhatsAppButton from '../WhatsAppButton';

const baseProps = {
  phone: '5491123456789',
  specialty: 'plomeria' as const,
  name: 'Juan Pérez',
};

describe('WhatsAppButton', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('does not render when phone is empty string', () => {
    const { container } = render(
      <WhatsAppButton {...baseProps} phone="" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render when phone is null string representation', () => {
    const { container } = render(
      <WhatsAppButton {...baseProps} phone="" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders button when phone is provided', () => {
    render(<WhatsAppButton {...baseProps} />);
    expect(
      screen.getByRole('button', { name: /contactar por whatsapp/i })
    ).toBeInTheDocument();
  });

  it('opens modal on click', async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton {...baseProps} />);
    await user.click(
      screen.getByRole('button', { name: /contactar por whatsapp/i })
    );
    expect(screen.getByText(/contactar a juan pérez/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/describí brevemente/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /enviar/i })
    ).toBeInTheDocument();
  });

  it('cancel button closes modal', async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton {...baseProps} />);

    // Open modal
    await user.click(
      screen.getByRole('button', { name: /contactar por whatsapp/i })
    );
    expect(screen.getByText(/contactar a juan pérez/i)).toBeInTheDocument();

    // Close modal
    await user.click(
      screen.getByRole('button', { name: /cancelar/i })
    );
    expect(
      screen.queryByText(/contactar a juan pérez/i)
    ).not.toBeInTheDocument();
  });

  it('sending opens wa.me with correct URL format', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const user = userEvent.setup();

    render(<WhatsAppButton {...baseProps} />);

    // Open modal
    await user.click(
      screen.getByRole('button', { name: /contactar por whatsapp/i })
    );

    // Click send
    await user.click(
      screen.getByRole('button', { name: /enviar/i })
    );

    expect(openSpy).toHaveBeenCalledTimes(1);
    const url = openSpy.mock.calls[0][0];
    expect(url).toContain('https://wa.me/5491123456789');
    expect(url).toContain('text=');
    expect(url).toContain(encodeURIComponent('Plomería'));
    expect(openSpy.mock.calls[0][2]).toBe('noopener,noreferrer');
  });
});
