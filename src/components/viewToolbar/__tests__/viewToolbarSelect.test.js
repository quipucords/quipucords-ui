import React from 'react';
import { ViewToolbarSelect, SelectFilterVariant, SelectFilterVariantOptions, useOnSelect } from '../viewToolbarSelect';
import { API_QUERY_TYPES } from '../../../constants/apiConstants';
import { store } from '../../../redux/store';

describe('ViewToolbarSelect Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      filter: SelectFilterVariant[API_QUERY_TYPES.CREDENTIAL_TYPE]
    };
    const component = await shallowComponent(<ViewToolbarSelect {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select variants and related options', () => {
    expect({
      SelectFilterVariant,
      SelectFilterVariantOptions
    }).toMatchSnapshot('field variants, options');
  });

  it('should handle updating the view query through redux state with a component', () => {
    const props = {
      filter: SelectFilterVariant[API_QUERY_TYPES.CREDENTIAL_TYPE]
    };

    const component = renderComponent(<ViewToolbarSelect {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('button.pf-v5-c-select__menu-item');
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch type, component');
  });

  it('should handle updating the view query through redux state with a hook', async () => {
    const options = {};
    const { result: onSelect } = await renderHook(() => useOnSelect('lorem filter', options));

    onSelect({ value: 'dolor sit' });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch type, hook');
  });
});
