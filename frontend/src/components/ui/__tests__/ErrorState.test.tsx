import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from '../ErrorState';

describe('ErrorState', () => {
  it('renders default error message', () => {
    render(<ErrorState />);
    expect(
      screen.getByText('Ocurrió un error al cargar los datos.')
    ).toBeInTheDocument();
  });

  it('renders retry button when onRetry provided', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    expect(
      screen.getByRole('button', { name: /intentar de nuevo/i })
    ).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is undefined', () => {
    render(<ErrorState />);
    expect(
      screen.queryByRole('button', { name: /intentar de nuevo/i })
    ).not.toBeInTheDocument();
  });

  it('calls onRetry when button is clicked', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ErrorState onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: /intentar de nuevo/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
