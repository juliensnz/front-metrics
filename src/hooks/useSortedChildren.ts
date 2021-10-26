import {useMemo} from 'react';
import {Report, ReportMetric} from '../model/Report';
import {useStorageState} from './useStorageState';

type SortDirection = 'none' | 'ascending' | 'descending';

const useSortedChildren = (children: Report[]) => {
  const [sortedColumn, setSortedColumn] = useStorageState<{
    columnName: keyof ReportMetric | 'name' | null;
    sortDirection: SortDirection;
  }>(
    {
      columnName: null,
      sortDirection: 'none',
    },
    'sort_state'
  );

  const computeDirection = (columnName: string) => {
    if (columnName !== sortedColumn.columnName) {
      return 'none';
    }

    return sortedColumn.sortDirection;
  };

  const handleDirectionChange = (columnName: keyof ReportMetric | 'name') => (sortDirection: SortDirection) => {
    setSortedColumn({
      columnName: columnName,
      sortDirection: sortDirection,
    });
  };

  const sortChildren = (
    children: Report[],
    columnName: keyof ReportMetric | 'name' | null,
    direction: SortDirection
  ) => {
    if (columnName === null) {
      return children;
    }

    if (columnName === 'name') {
      return [...children].sort((a, b) => {
        return direction === 'ascending' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      });
    }

    return [...children].sort((a, b) => {
      return direction === 'ascending'
        ? a.metrics[columnName] - b.metrics[columnName]
        : b.metrics[columnName] - a.metrics[columnName];
    });
  };

  const sortedChildren = useMemo(
    () => sortChildren(children, sortedColumn.columnName, sortedColumn.sortDirection),
    [sortedColumn, children]
  );

  return [sortedChildren, computeDirection, handleDirectionChange] as const;
};

export {useSortedChildren};
