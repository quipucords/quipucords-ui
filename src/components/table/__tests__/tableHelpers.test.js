import React from 'react';
import { tableHelpers, tableHeader, tableRows } from '../tableHelpers';

describe('TableHelpers', () => {
  it('should have specific functions', () => {
    expect(tableHelpers).toMatchSnapshot('tableHelpers');
  });

  it('tableHeader should return parsed table header settings, props', () => {
    expect({
      basic: tableHeader(),
      allRowsSelected: tableHeader({ allRowsSelected: true }),
      columnHeaders: tableHeader({
        columnHeaders: [
          'lorem',
          { content: 'dolor' },
          () => 'hello world',
          <React.Fragment>hello world</React.Fragment>
        ]
      }),
      onSelect: tableHeader({
        onSelect: () => {},
        columnHeaders: ['lorem', { content: 'dolor' }, () => 'hello world']
      }),
      onSort: tableHeader({
        onSort: () => {},
        columnHeaders: ['lorem', { content: 'dolor', isSort: true }, () => 'hello world']
      }),
      isRowExpand: tableHeader({
        onSort: () => {},
        isRowExpand: true,
        columnHeaders: ['lorem', { content: 'dolor', isSort: true }, () => 'hello world']
      })
    }).toMatchSnapshot('tableHeader');
  });

  it('tableRows should return parsed table body settings, props', () => {
    expect({
      basic: tableRows(),
      rows: tableRows({
        rows: [
          { cells: ['lorem'] },
          { cells: [{ content: 'dolor' }] },
          { cells: [() => 'hello world'] },
          { cells: [<React.Fragment>hello world</React.Fragment>] }
        ]
      }),
      onExpandCells: tableRows({
        onExpand: () => {},
        rows: [
          { cells: ['lorem'] },
          { cells: [{ content: 'dolor', expandedContent: 'sit', isExpanded: true }] },
          { cells: [() => 'hello world'] },
          { cells: [<React.Fragment>hello world</React.Fragment>] }
        ]
      }),
      onExpandRows: tableRows({
        onExpand: () => {},
        rows: [
          { cells: ['lorem'], expandedContent: 'ipsum', isExpanded: true },
          { cells: [{ content: 'dolor' }] },
          { cells: [() => 'hello world'] },
          { cells: [<React.Fragment>hello world</React.Fragment>] }
        ]
      }),
      onSelect: tableRows({
        onSelect: () => {},
        rows: [
          { cells: ['lorem'], isSelected: true },
          { cells: [{ content: 'dolor' }], isDisabled: true },
          { cells: [() => 'hello world'] },
          { cells: [<React.Fragment>hello world</React.Fragment>] }
        ]
      })
    }).toMatchSnapshot('tableRows');
  });
});
