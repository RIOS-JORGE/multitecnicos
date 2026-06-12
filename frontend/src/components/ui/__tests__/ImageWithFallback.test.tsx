import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImageWithFallback from '../ImageWithFallback';

describe('ImageWithFallback', () => {
  it('renders img when src is provided', () => {
    render(<ImageWithFallback src="/photo.jpg" alt="Test Alt" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/photo.jpg');
    expect(img).toHaveAttribute('alt', 'Test Alt');
  });

  it('renders fallback div when src is null', () => {
    render(<ImageWithFallback src={null} alt="Test Alt" />);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders custom fallback text when provided', () => {
    render(<ImageWithFallback src={null} alt="Test Alt" fallback="FB" />);
    expect(screen.getByText('FB')).toBeInTheDocument();
    expect(screen.queryByText('T')).not.toBeInTheDocument();
  });
});
