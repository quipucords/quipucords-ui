import React from 'react';
import { TextInput } from '../../form/textInput';
import { ViewToolbarTextInput, TextInputFilterVariants, useOnClear, useOnSubmit } from '../viewToolbarTextInput';
import { API_QUERY_TYPES } from '../../../constants/apiConstants';
import { store } from '../../../redux/store';

describe('ViewToolbarTextInput Component', () => {
  let mockDispatch;

  beforeEach(() => {
    jest.useFakeTimers();
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      filter: TextInputFilterVariants[API_QUERY_TYPES.SEARCH_CREDENTIALS_NAME]
    };
    const component = await shallowHookComponent(<ViewToolbarTextInput {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export variants', () => {
    expect({
      TextInputFilterVariants
    }).toMatchSnapshot('field variants');
  });

  it('should handle updating the view query through redux state with a component', async () => {
    const props = {
      filter: TextInputFilterVariants[API_QUERY_TYPES.SEARCH_CREDENTIALS_NAME]
    };

    const component = await shallowHookComponent(<ViewToolbarTextInput {...props} />);
    component.find(TextInput).simulate('change', { value: '' });
    component.find(TextInput).simulate('keyUp', { value: 'dolor sit' });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch type, component');
  });

  it('should handle updating the view query through redux state with a hook', async () => {
    const options = {};
    const { result: onSelect } = await shallowHook(() => useOnSubmit('lorem filter', options));

    onSelect({ value: 'dolor sit' });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch type, hook');
  });

  it('should handle clearing the view query through redux state with a hook', async () => {
    const options = {
      useSelector: () => 'dolor sit'
    };
    const { result: onClear } = await shallowHook(() => useOnClear('lorem filter', options));

    onClear();
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch onClear, hook');
  });
});
