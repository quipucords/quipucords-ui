import * as React from 'react';

const usePageTableResetter = tableState => {
  const lastFilterAndSort = React.useRef<{
    filterValues: typeof tableState.filter.filterValues;
    activeSort: typeof tableState.sort.activeSort;
  }>({
    filterValues: tableState.filter.filterValues,
    activeSort: tableState.sort.activeSort
  });

  React.useEffect(() => {
    const { filterValues } = tableState.filter;
    const { activeSort } = tableState.sort;
    const { pageNumber, setPageNumber } = tableState.pagination;
    const { filterValues: lastFilterValues, activeSort: lastActiveSort } = lastFilterAndSort.current;

    const filterChanged = JSON.stringify(lastFilterValues) !== JSON.stringify(filterValues);
    const sortChanged = JSON.stringify(lastActiveSort) !== JSON.stringify(activeSort);

    if (pageNumber > 1 && (filterChanged || sortChanged)) {
      setPageNumber(1);
    }

    lastFilterAndSort.current = { filterValues, activeSort };
  }, [
    tableState.filter.filterValues,
    tableState.sort.activeSort,
    tableState.pagination.pageNumber,
    tableState.pagination.setPageNumber
  ]);
};

export { usePageTableResetter as default, usePageTableResetter };
