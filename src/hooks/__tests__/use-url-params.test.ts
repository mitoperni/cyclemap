import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUrlParams } from '../use-url-params';

const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe('useUrlParams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockSearchParams.delete('country');
    mockSearchParams.delete('search');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should return empty filters when no URL params exist', () => {
      const { result } = renderHook(() => useUrlParams());

      expect(result.current.filters).toEqual({
        country: undefined,
        search: undefined,
      });
      expect(result.current.searchValue).toBe('');
      expect(result.current.countryValue).toBe('');
    });

    it('should return filters from URL params', () => {
      mockSearchParams.set('country', 'ES');
      mockSearchParams.set('search', 'bici');

      const { result } = renderHook(() => useUrlParams());

      expect(result.current.filters).toEqual({
        country: 'ES',
        search: 'bici',
      });
      expect(result.current.searchValue).toBe('bici');
      expect(result.current.countryValue).toBe('ES');
    });
  });

  describe('setCountry', () => {
    it('should update URL immediately when country is set', () => {
      const { result } = renderHook(() => useUrlParams());

      act(() => {
        result.current.setCountry('ES');
      });

      expect(mockPush).toHaveBeenCalledWith('?country=ES', { scroll: false });
    });

    it('should remove country param when empty string is passed', () => {
      mockSearchParams.set('country', 'ES');

      const { result } = renderHook(() => useUrlParams());

      act(() => {
        result.current.setCountry('');
      });

      expect(mockPush).toHaveBeenCalledWith('/', { scroll: false });
    });

    it('should preserve search param when updating country', () => {
      mockSearchParams.set('search', 'bici');

      const { result } = renderHook(() => useUrlParams());

      act(() => {
        result.current.setCountry('ES');
      });

      expect(mockPush).toHaveBeenCalledWith('?search=bici&country=ES', { scroll: false });
    });
  });

  describe('setSearch', () => {
    it('should debounce search updates', () => {
      const { result } = renderHook(() => useUrlParams());

      act(() => {
        result.current.setSearch('b');
        result.current.setSearch('bi');
        result.current.setSearch('bic');
        result.current.setSearch('bici');
      });

      expect(mockPush).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('?search=bici', { scroll: false });
    });

    it('should remove search param when empty string is passed after debounce', () => {
      mockSearchParams.set('search', 'bici');

      const { result } = renderHook(() => useUrlParams());

      act(() => {
        result.current.setSearch('');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(mockPush).toHaveBeenCalledWith('/', { scroll: false });
    });

    it('should preserve country param when updating search', () => {
      mockSearchParams.set('country', 'ES');

      const { result } = renderHook(() => useUrlParams());

      act(() => {
        result.current.setSearch('bici');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(mockPush).toHaveBeenCalledWith('?country=ES&search=bici', { scroll: false });
    });
  });

  describe('clearFilters', () => {
    it('should clear all filters and navigate to root', () => {
      mockSearchParams.set('country', 'ES');
      mockSearchParams.set('search', 'bici');

      const { result } = renderHook(() => useUrlParams());

      act(() => {
        result.current.clearFilters();
      });

      expect(mockPush).toHaveBeenCalledWith('/', { scroll: false });
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in search', () => {
      const { result } = renderHook(() => useUrlParams());

      act(() => {
        result.current.setSearch('vélib');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('search='), { scroll: false });
    });

    it('should handle both params being set simultaneously', () => {
      const { result } = renderHook(() => useUrlParams());

      act(() => {
        result.current.setCountry('FR');
      });

      act(() => {
        result.current.setSearch('velib');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(mockPush).toHaveBeenCalledTimes(2);
    });
  });
});
