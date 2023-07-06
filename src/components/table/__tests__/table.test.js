import React from 'react';
import { TableVariant } from '@patternfly/react-table';
import { Table } from '../table';

describe('Table Component', () => {
  it('should render a basic component', async () => {
    const props = {
      isHeader: true,
      columnHeaders: ['lorem', 'ipsum', 'dolor', 'sit']
    };

    const component = await shallowComponent(<Table {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow variations in table layout', async () => {
    const props = {
      isHeader: true,
      columnHeaders: ['lorem ipsum'],
      rows: [{ cells: ['dolor'] }, { cells: ['sit'] }]
    };

    const component = await shallowComponent(<Table {...props} />);
    expect(component).toMatchSnapshot('generated rows');

    const componentNoBorders = await component.setProps({
      isBorders: false,
      isHeader: false
    });
    expect(componentNoBorders).toMatchSnapshot('borders and table header removed');

    const componentAriaLabel = await component.setProps({
      ariaLabel: 'lorem ipsum aria-label',
      summary: 'lorem ipsum summary'
    });
    expect(componentAriaLabel).toMatchSnapshot('ariaLabel and summary');

    const componentClassName = await component.setProps({
      className: 'lorem-ipsum-class',
      variant: TableVariant.compact
    });
    expect(componentClassName).toMatchSnapshot('className and variant');
  });

  it('should allow expandable row content', () => {
    const mockOnExpand = jest.fn();
    const props = {
      onExpand: mockOnExpand,
      rows: [
        { cells: ['dolor'], expandedContent: 'dolor sit expandable content', data: { hello: 'world' } },
        { cells: ['sit'] }
      ]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component.find('tr.quipucords-table__tr')).toMatchSnapshot('expandable row content');

    const input = component.find('button');
    component.fireEvent.click(input);

    expect(mockOnExpand.mock.calls).toMatchSnapshot('expand row event');
    expect(component.find('.quipucords-table__td-expand-expanded')).toMatchSnapshot('expanded row');
  });

  it('should allow expandable cell content', () => {
    const mockOnExpand = jest.fn();
    const props = {
      onExpand: mockOnExpand,
      rows: [
        { cells: [{ content: 'dolor', expandedContent: 'dolor sit expandable content' }], data: { hello: 'world' } },
        { cells: ['sit'] }
      ]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component.find('tr.quipucords-table__tr')).toMatchSnapshot('expandable cell content');

    const input = component.find('button');
    component.fireEvent.click(input);

    expect(mockOnExpand.mock.calls).toMatchSnapshot('expand cell event');
    expect(component.find('.quipucords-table__td-expand-expanded')).toMatchSnapshot('expanded cell');
  });

  it('should allow sortable content', () => {
    const mockOnSort = jest.fn();
    const props = {
      isHeader: true,
      onSort: mockOnSort,
      columnHeaders: [{ content: 'lorem ipsum', isSort: true }],
      rows: [{ cells: ['dolor'] }, { cells: ['sit'] }]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component.find('th')).toMatchSnapshot('sortable content');

    const input = component.find('button');
    component.fireEvent.click(input);
    expect(component.find('th')).toMatchSnapshot('sorted column, asc');

    component.fireEvent.click(input);
    expect(component.find('th')).toMatchSnapshot('sorted column, desc');

    expect(mockOnSort.mock.calls).toMatchSnapshot('sort event');
  });

  it('should allow selectable row content', () => {
    const mockOnSelect = jest.fn();
    const props = {
      isHeader: true,
      columnHeaders: ['lorem ipsum'],
      onSelect: mockOnSelect,
      rows: [{ cells: [{ content: 'dolor' }], dataLabel: 'testing' }, { cells: ['sit'] }]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component.find('tbody tr')).toMatchSnapshot('select row content');

    const input = component.find('input[name="checkrow0"]');
    component.fireEvent.click(input, { currentTarget: {}, target: { checked: true }, checked: true });

    expect(mockOnSelect.mock.calls).toMatchSnapshot('select row input');
  });

  it('should pass child components, nodes when there are no rows', async () => {
    const props = {
      isHeader: true,
      columnHeaders: ['lorem ipsum'],
      rows: []
    };

    const component = await shallowComponent(<Table {...props}>Loading...</Table>);
    expect(component).toMatchSnapshot('children');
  });
});
