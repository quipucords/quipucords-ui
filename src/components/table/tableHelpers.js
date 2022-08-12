import React from 'react';
import { SortByDirection } from '@patternfly/react-table';
import { helpers } from '../../common';

// ToDo: evaluate potential storage issues.
/**
 * Store generated keys, check for repeats.
 *
 * @type {{}}
 */
const tableKeyCache = {};

/**
 * Generate table keys, avoid potential repeats.
 *
 * @param {*} value
 * @param {string} prefix
 * @returns {string}
 */
const generateTableKey = (value, prefix = 'table') => {
  let updatedValue = helpers.generateId();

  if (value === undefined || value === null || Number.isNaN(value)) {
    return `${prefix}-${updatedValue}`;
  }

  switch (typeof value) {
    case 'string':
      updatedValue = value;
      break;
    case 'object':
      try {
        updatedValue = JSON.stringify(value);
      } catch (e) {
        //
      }
      break;
    default:
      updatedValue = value.toString();
  }

  let key = `${prefix}-${updatedValue}`;

  if (tableKeyCache[key]) {
    key = helpers.generateId();
  }

  tableKeyCache[key] = true;

  return key;
};

/**
 * Parse table header settings, props.
 *
 * @param {object} params
 * @param {boolean} params.allRowsSelected
 * @param {Array} params.columnHeaders
 * @param {boolean} params.isRowExpand
 * @param {Function} params.onSelect
 * @param {Function} params.onSort
 * @returns {{columnHeaders: *[], isSortTable: boolean, headerSelectProps: {}}}
 */
const tableHeader = ({ allRowsSelected = false, columnHeaders = [], isRowExpand, onSelect, onSort } = {}) => {
  const updatedColumnHeaders = [];
  const updatedHeaderSelectProps = {};
  const isSelectTable = typeof onSelect === 'function';
  let isSortTable = false;

  if (isSelectTable) {
    updatedHeaderSelectProps.select = {
      onSelect: () => onSelect({ rowIndex: -1, type: 'all' }),
      isSelected: allRowsSelected
    };
  }

  columnHeaders.forEach((columnHeader, index) => {
    if (columnHeader?.content !== undefined) {
      const { isSort, isSortActive, sortDirection = SortByDirection.asc, content, ...props } = columnHeader;
      const tempColumnHeader = {
        content,
        props
      };

      if (typeof onSort === 'function' && (isSort === true || isSortActive === true)) {
        isSortTable = true;
        let updatedColumnIndex = index;

        if (isRowExpand) {
          updatedColumnIndex += 1;
        }

        if (isSelectTable) {
          updatedColumnIndex += 1;
        }

        tempColumnHeader.props.sort = {
          columnIndex: updatedColumnIndex,
          sortBy: {},
          onSort: (_event, _colIndex, direction) =>
            onSort({ cellIndex: updatedColumnIndex, direction, originalIndex: index })
        };

        if (isSortActive) {
          tempColumnHeader.props.sort.sortBy.index = updatedColumnIndex;
        }

        tempColumnHeader.props.sort.sortBy.direction = sortDirection;
      }

      updatedColumnHeaders.push(tempColumnHeader);
    } else {
      updatedColumnHeaders.push({
        content:
          (React.isValidElement(columnHeader) && columnHeader) ||
          (typeof columnHeader === 'function' && columnHeader()) ||
          (typeof columnHeader === 'object' && `${columnHeader}`) ||
          columnHeader
      });
    }
  });

  return {
    columnHeaders: updatedColumnHeaders,
    headerSelectProps: updatedHeaderSelectProps,
    isSortTable
  };
};

/**
 * Parse table body settings, props.
 *
 * @param {object} params
 * @param {Function} params.onExpand
 * @param {Function} params.onSelect
 * @param {Array} params.rows
 * @returns {{isExpandableCell: boolean, isSelectTable: boolean, isExpandableRow: boolean, allRowsSelected: boolean, rows: *[]}}
 */
const tableRows = ({ onExpand, onSelect, rows = [] } = {}) => {
  const updatedRows = [];
  let isExpandableRow = false;
  let isExpandableCell = false;
  let isSelectTable = false;
  let selectedRows = 0;

  rows.forEach(({ cells, isDisabled = false, isExpanded = false, isSelected = false, expandedContent }) => {
    const rowObj = {
      cells: [],
      select: undefined,
      expand: undefined,
      expandedContent
    };
    updatedRows.push(rowObj);
    rowObj.rowIndex = updatedRows.length - 1;

    if (typeof onSelect === 'function') {
      const updatedIsSelected = isSelected ?? false;

      if (updatedIsSelected === true) {
        selectedRows += 1;
      }

      isSelectTable = true;
      rowObj.select = {
        cells,
        rowIndex: rowObj.rowIndex,
        onSelect: () => onSelect({ rowIndex: rowObj.rowIndex, type: 'row' }),
        isSelected: updatedIsSelected,
        disable: isDisabled || false
      };
    }

    if (expandedContent && typeof onExpand === 'function') {
      isExpandableRow = true;

      rowObj.expand = {
        rowIndex: rowObj.rowIndex,
        isExpanded,
        onToggle: () =>
          onExpand({
            rowIndex: rowObj.rowIndex,
            type: 'row'
          })
      };
    }

    cells.forEach((cell, cellIndex) => {
      if (cell?.content !== undefined) {
        const { dataLabel, isActionCell, noPadding, width, ...remainingProps } = cell;
        const cellProps = { dataLabel, isActionCell, noPadding, width };

        if (!isExpandableRow && cell?.expandedContent && typeof onExpand === 'function') {
          isExpandableCell = true;
          const updateIsExpanded = cell?.isExpanded ?? false;

          cellProps.compoundExpand = {
            isExpanded: updateIsExpanded,
            onToggle: () =>
              onExpand({
                rowIndex: rowObj.rowIndex,
                cellIndex,
                type: 'compound'
              })
          };
        }

        rowObj.cells.push({ ...remainingProps, props: cellProps });
      } else {
        rowObj.cells.push({
          content:
            (React.isValidElement(cell) && cell) ||
            (typeof cell === 'function' && cell()) ||
            (typeof cell === 'object' && `${cell}`) ||
            cell
        });
      }
    });
  });

  return {
    allRowsSelected: selectedRows === rows.length,
    isExpandableRow,
    isExpandableCell,
    isSelectTable,
    rows: updatedRows
  };
};

const tableHelpers = {
  generateTableKey,
  tableHeader,
  tableRows
};

export { tableHelpers as default, tableHelpers, generateTableKey, tableHeader, tableRows };
