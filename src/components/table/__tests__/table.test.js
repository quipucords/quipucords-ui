import React from 'react';
import { TableComposable, TableVariant, Th } from '@patternfly/react-table';
import { Table } from '../table';

describe('Table Component', () => {
  it('should render a basic component', async () => {
    const props = {
      isHeader: true,
      columnHeaders: ['lorem', 'ipsum', 'dolor', 'sit']
    };

    const component = await shallowHookComponent(<Table {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow variations in table layout', async () => {
    const props = {
      isHeader: true,
      columnHeaders: ['lorem ipsum'],
      rows: [{ cells: ['dolor'] }, { cells: ['sit'] }]
    };

    const component = await mountHookComponent(<Table {...props} />);
    expect(component.find(TableComposable)).toMatchSnapshot('generated rows');

    component.setProps({
      isBorders: false,
      isHeader: false
    });
    expect(component.find(TableComposable)).toMatchSnapshot('borders and table header removed');

    component.setProps({
      ariaLabel: 'lorem ipsum aria-label',
      summary: 'lorem ipsum summary'
    });
    expect(component.find(TableComposable).props()).toMatchSnapshot('ariaLabel and summary');

    component.setProps({
      className: 'lorem-ipsum-class',
      variant: TableVariant.compact
    });
    expect(component.find(TableComposable).props()).toMatchSnapshot('className and variant');
  });

  it('should allow expandable row content', async () => {
    const mockOnExpand = jest.fn();
    const props = {
      onExpand: mockOnExpand,
      rows: [{ cells: ['dolor'], expandedContent: 'dolor sit expandable content' }, { cells: ['sit'] }]
    };

    const component = await mountHookComponent(<Table {...props} />);
    expect(component.find(TableComposable)).toMatchSnapshot('expandable row content');

    component.find('button').first().simulate('click');

    expect(mockOnExpand.mock.calls).toMatchSnapshot('expand row event');
    expect(component.find(TableComposable)).toMatchSnapshot('expanded row');
  });

  it('should allow expandable cell content', async () => {
    const mockOnExpand = jest.fn();
    const props = {
      onExpand: mockOnExpand,
      rows: [{ cells: [{ content: 'dolor', expandedContent: 'dolor expandable content' }] }, { cells: ['sit'] }]
    };

    const component = await mountHookComponent(<Table {...props} />);
    expect(component.find(TableComposable)).toMatchSnapshot('expandable cell content');

    component.find('button').first().simulate('click');

    expect(mockOnExpand.mock.calls).toMatchSnapshot('expand cell event');
    expect(component.find(TableComposable)).toMatchSnapshot('expanded cell');
  });

  it('should allow sortable content', async () => {
    const mockOnSort = jest.fn();
    const props = {
      isHeader: true,
      onSort: mockOnSort,
      columnHeaders: [{ content: 'lorem ipsum', isSort: true }],
      rows: [{ cells: ['dolor'] }, { cells: ['sit'] }]
    };

    const component = await mountHookComponent(<Table {...props} />);
    expect(component.find(Th).first()).toMatchSnapshot('sortable content');

    component.find('button').first().simulate('click');
    expect(component.find(Th).first()).toMatchSnapshot('sorted column, asc');

    component.find('button').first().simulate('click');
    expect(component.find(Th).first()).toMatchSnapshot('sorted column, desc');

    expect(mockOnSort.mock.calls).toMatchSnapshot('sort event');
  });

  it('should allow selectable row content', async () => {
    const mockOnSelect = jest.fn();
    const props = {
      isHeader: true,
      columnHeaders: ['lorem ipsum'],
      onSelect: mockOnSelect,
      rows: [{ cells: [{ content: 'dolor' }] }, { cells: ['sit'] }]
    };

    const component = await mountHookComponent(<Table {...props} />);
    expect(component.find('input')).toMatchSnapshot('select row content');

    component.find('input').first().simulate('change');

    expect(mockOnSelect.mock.calls).toMatchSnapshot('select row event');
    expect(component.find('input')).toMatchSnapshot('selected row');
  });

  it('should pass child components, nodes when there are no rows', async () => {
    const props = {
      isHeader: true,
      columnHeaders: ['lorem ipsum'],
      rows: []
    };

    const component = await shallowHookComponent(<Table {...props}>Loading...</Table>);
    expect(component).toMatchSnapshot('children');
  });
});
