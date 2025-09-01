import { act, renderHook } from '@testing-library/react';
import { usePageTableResetter } from '../usePageTableResetter';

// Just enough table state interface to facilitate our testing
interface MockTableState {
  filter: {
    filterValues: Record<string, string[]>;
  };
  sort: {
    activeSort:
      | {
          columnKey: string;
          direction: 'asc' | 'desc';
        }
      | Record<string, never>;
  };
  pagination: {
    pageNumber: number;
    setPageNumber: jest.Mock;
  };
}

describe('usePageTableResetter', () => {
  let mockSetPageNumber: jest.Mock;
  let mockTableState: MockTableState;

  beforeEach(() => {
    mockSetPageNumber = jest.fn();
    mockTableState = {
      filter: {
        filterValues: {}
      },
      sort: {
        activeSort: {}
      },
      pagination: {
        pageNumber: 5,
        setPageNumber: mockSetPageNumber
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reset pagination when filter values change', () => {
    const { rerender } = renderHook(() => usePageTableResetter(mockTableState));

    act(() => {
      mockTableState.filter.filterValues = { name: ['test'] };
      rerender();
    });

    expect(mockSetPageNumber).toHaveBeenCalledWith(1);
  });

  it('should reset pagination when sort changes', () => {
    const { rerender } = renderHook(() => usePageTableResetter(mockTableState));

    act(() => {
      mockTableState.sort.activeSort = { columnKey: 'name', direction: 'asc' };
      rerender();
    });

    expect(mockSetPageNumber).toHaveBeenCalledWith(1);
  });

  it('should not reset pagination when on page 1', () => {
    mockTableState.pagination.pageNumber = 1;

    const { rerender } = renderHook(() => usePageTableResetter(mockTableState));

    act(() => {
      mockTableState.filter.filterValues = { name: ['test'] };
      rerender();
    });

    expect(mockSetPageNumber).not.toHaveBeenCalled();
  });

  it('should reset pagination on deep filter value changes', () => {
    mockTableState.filter.filterValues = {
      name: ['credential1'],
      type: ['network']
    };

    const { rerender } = renderHook(() => usePageTableResetter(mockTableState));

    act(() => {
      mockTableState.filter.filterValues = {
        name: ['credential1'],
        type: ['satellite']
      };
      rerender();
    });

    expect(mockSetPageNumber).toHaveBeenCalledWith(1);
  });

  it('should reset pagination when adding a new filter category', () => {
    mockTableState.filter.filterValues = { name: ['test'] };

    const { rerender } = renderHook(() => usePageTableResetter(mockTableState));

    act(() => {
      mockTableState.filter.filterValues = {
        name: ['test'],
        type: ['network']
      };
      rerender();
    });

    expect(mockSetPageNumber).toHaveBeenCalledWith(1);
  });

  it('should reset pagination when removing filter category', () => {
    mockTableState.filter.filterValues = {
      name: ['test'],
      type: ['network']
    };

    const { rerender } = renderHook(() => usePageTableResetter(mockTableState));

    act(() => {
      mockTableState.filter.filterValues = { name: ['test'] };
      rerender();
    });

    expect(mockSetPageNumber).toHaveBeenCalledWith(1);
  });

  it('should reset pagination on sort direction change', () => {
    mockTableState.sort.activeSort = { columnKey: 'name', direction: 'asc' };

    const { rerender } = renderHook(() => usePageTableResetter(mockTableState));

    act(() => {
      mockTableState.sort.activeSort = { columnKey: 'name', direction: 'desc' };
      rerender();
    });

    expect(mockSetPageNumber).toHaveBeenCalledWith(1);
  });

  it('should reset pagination on sort column change', () => {
    mockTableState.sort.activeSort = { columnKey: 'name', direction: 'asc' };

    const { rerender } = renderHook(() => usePageTableResetter(mockTableState));

    act(() => {
      mockTableState.sort.activeSort = { columnKey: 'type', direction: 'asc' };
      rerender();
    });

    expect(mockSetPageNumber).toHaveBeenCalledWith(1);
  });

  it('should reset pagination when clearing filters', () => {
    mockTableState.filter.filterValues = { name: ['test'] };

    const { rerender } = renderHook(() => usePageTableResetter(mockTableState));

    act(() => {
      mockTableState.filter.filterValues = {};
      rerender();
    });

    expect(mockSetPageNumber).toHaveBeenCalledWith(1);
  });
});
