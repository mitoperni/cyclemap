import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapError } from '../map-error';

describe('MapError', () => {
  describe('rendering', () => {
    it('should render with default title', () => {
      render(<MapError message="Something went wrong" />);

      expect(screen.getByText('Map Error')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<MapError title="Configuration Error" message="Token is missing" />);

      expect(screen.getByText('Configuration Error')).toBeInTheDocument();
      expect(screen.getByText('Token is missing')).toBeInTheDocument();
    });

    it('should render alert icon', () => {
      render(<MapError message="Error message" />);

      // The AlertTriangle icon should be present in the document
      const iconContainer = document.querySelector('.bg-red-100');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('retry button', () => {
    it('should not render retry button when onRetry is not provided', () => {
      render(<MapError message="Error message" />);

      expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    });

    it('should render retry button when onRetry is provided', () => {
      const onRetry = vi.fn();
      render(<MapError message="Error message" onRetry={onRetry} />);

      expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
      const onRetry = vi.fn();
      render(<MapError message="Error message" onRetry={onRetry} />);

      fireEvent.click(screen.getByText('Try again'));

      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<MapError title="Error Title" message="Error message" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Error Title');
    });

    it('should have accessible button', () => {
      const onRetry = vi.fn();
      render(<MapError message="Error message" onRetry={onRetry} />);

      const button = screen.getByRole('button', { name: /try again/i });
      expect(button).toBeInTheDocument();
    });
  });
});
