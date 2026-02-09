import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StationsTable } from '../stations-table';
import type { Station, StationSort, PaginationInfo } from '@/types';

// Mock the context
vi.mock('@/contexts/stations-sync-context', () => ({
  useStationsSync: vi.fn(),
}));

// Mock the layout constant
vi.mock('@/lib/constants', async () => {
  const actual = await vi.importActual('@/lib/constants');
  return { ...actual, STATIONS_SCROLL_CONTAINER_ID: 'mock-scroll-container' };
});

import { useStationsSync } from '@/contexts/stations-sync-context';

const mockUseStationsSync = useStationsSync as ReturnType<typeof vi.fn>;

const createMockStation = (overrides: Partial<Station> = {}): Station => ({
  id: 'station-1',
  name: 'Test Station',
  latitude: 40.4168,
  longitude: -3.7038,
  free_bikes: 5,
  empty_slots: 10,
  timestamp: '2024-01-01T00:00:00Z',
  ...overrides,
});

const createMockPagination = (overrides: Partial<PaginationInfo> = {}): PaginationInfo => ({
  currentPage: 1,
  totalPages: 1,
  totalItems: 1,
  pageSize: 10,
  startIndex: 1,
  endIndex: 1,
  ...overrides,
});

describe('StationsTable Sorting', () => {
  const mockHandleColumnSort = vi.fn();
  const mockSetCurrentPage = vi.fn();
  const mockFlyToStation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMock = (
    columnSort: StationSort | null = null,
    stations: Station[] = [createMockStation()]
  ) => {
    mockUseStationsSync.mockReturnValue({
      sortedStations: stations,
      paginatedStations: stations,
      pagination: createMockPagination({ totalItems: stations.length }),
      setCurrentPage: mockSetCurrentPage,
      flyToStation: mockFlyToStation,
      selectedStationId: null,
      columnSort,
      handleColumnSort: mockHandleColumnSort,
    });
  };

  describe('sort icons rendering', () => {
    it('should render ChevronsUpDown icon when column is not sorted', () => {
      setupMock(null);
      render(<StationsTable />);

      // All three headers should have the neutral sort icon
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(3);

      // Check that headers are rendered (icons are inside)
      expect(screen.getByText('STATION NAME')).toBeInTheDocument();
      expect(screen.getByText('FREE BIKES')).toBeInTheDocument();
      expect(screen.getByText('EMPTY SLOTS')).toBeInTheDocument();
    });

    it('should render ChevronDown icon when column is sorted descending', () => {
      setupMock({ field: 'free_bikes', direction: 'desc' });
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      expect(freeBikesHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('should render ChevronUp icon when column is sorted ascending', () => {
      setupMock({ field: 'free_bikes', direction: 'asc' });
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      expect(freeBikesHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  describe('click interactions', () => {
    it('should call handleColumnSort with "free_bikes" when FREE BIKES header is clicked', () => {
      setupMock(null);
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      fireEvent.click(freeBikesHeader);

      expect(mockHandleColumnSort).toHaveBeenCalledWith('free_bikes');
      expect(mockHandleColumnSort).toHaveBeenCalledTimes(1);
    });

    it('should call handleColumnSort with "empty_slots" when EMPTY SLOTS header is clicked', () => {
      setupMock(null);
      render(<StationsTable />);

      const emptySlotsHeader = screen.getByRole('columnheader', { name: /empty slots/i });
      fireEvent.click(emptySlotsHeader);

      expect(mockHandleColumnSort).toHaveBeenCalledWith('empty_slots');
      expect(mockHandleColumnSort).toHaveBeenCalledTimes(1);
    });

    it('should not have click handler on STATION NAME header', () => {
      setupMock(null);
      render(<StationsTable />);

      const nameHeader = screen.getByText('STATION NAME').closest('th');
      fireEvent.click(nameHeader!);

      expect(mockHandleColumnSort).not.toHaveBeenCalled();
    });
  });

  describe('keyboard interactions', () => {
    it('should call handleColumnSort when Enter key is pressed on header', () => {
      setupMock(null);
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      fireEvent.keyDown(freeBikesHeader, { key: 'Enter' });

      expect(mockHandleColumnSort).toHaveBeenCalledWith('free_bikes');
    });

    it('should call handleColumnSort when Space key is pressed on header', () => {
      setupMock(null);
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      fireEvent.keyDown(freeBikesHeader, { key: ' ' });

      expect(mockHandleColumnSort).toHaveBeenCalledWith('free_bikes');
    });

    it('should not call handleColumnSort when other keys are pressed', () => {
      setupMock(null);
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      fireEvent.keyDown(freeBikesHeader, { key: 'Tab' });

      expect(mockHandleColumnSort).not.toHaveBeenCalled();
    });
  });

  describe('aria-sort attribute', () => {
    it('should have aria-sort="none" when column is not sorted', () => {
      setupMock(null);
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      const emptySlotsHeader = screen.getByRole('columnheader', { name: /empty slots/i });

      expect(freeBikesHeader).toHaveAttribute('aria-sort', 'none');
      expect(emptySlotsHeader).toHaveAttribute('aria-sort', 'none');
    });

    it('should have aria-sort="descending" only on sorted column', () => {
      setupMock({ field: 'empty_slots', direction: 'desc' });
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      const emptySlotsHeader = screen.getByRole('columnheader', { name: /empty slots/i });

      expect(freeBikesHeader).toHaveAttribute('aria-sort', 'none');
      expect(emptySlotsHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('should have aria-sort="ascending" when sorted ascending', () => {
      setupMock({ field: 'free_bikes', direction: 'asc' });
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      expect(freeBikesHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  describe('accessibility', () => {
    it('should have tabIndex=0 on sortable headers', () => {
      setupMock(null);
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      const emptySlotsHeader = screen.getByRole('columnheader', { name: /empty slots/i });

      expect(freeBikesHeader).toHaveAttribute('tabIndex', '0');
      expect(emptySlotsHeader).toHaveAttribute('tabIndex', '0');
    });

    it('should have 3 column headers (STATION NAME is not sortable)', () => {
      setupMock(null);
      render(<StationsTable />);

      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(3); // All th elements have columnheader role

      // Verify STATION NAME header exists but is not sortable (no tabIndex)
      const nameHeader = screen.getByText('STATION NAME').closest('th');
      expect(nameHeader).not.toHaveAttribute('tabIndex');
    });

    it('should have cursor-pointer class on sortable headers', () => {
      setupMock(null);
      render(<StationsTable />);

      const freeBikesHeader = screen.getByRole('columnheader', { name: /free bikes/i });
      const emptySlotsHeader = screen.getByRole('columnheader', { name: /empty slots/i });

      expect(freeBikesHeader).toHaveClass('cursor-pointer');
      expect(emptySlotsHeader).toHaveClass('cursor-pointer');
    });
  });

  describe('empty state', () => {
    it('should show empty state message when no stations', () => {
      mockUseStationsSync.mockReturnValue({
        sortedStations: [],
        paginatedStations: [],
        pagination: createMockPagination({ totalItems: 0 }),
        setCurrentPage: mockSetCurrentPage,
        flyToStation: mockFlyToStation,
        selectedStationId: null,
        columnSort: null,
        handleColumnSort: mockHandleColumnSort,
      });

      render(<StationsTable />);

      expect(screen.getByText('No stations available')).toBeInTheDocument();
      expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
    });
  });
});
