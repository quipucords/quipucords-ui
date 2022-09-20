import React from 'react';
import { ViewToolbarFieldSortButton, useOnClick } from '../viewToolbarFieldSortButton';
import { API_QUERY_TYPES } from '../../../constants/apiConstants';
import { store } from '../../../redux/store';

describe('ViewToolbarFieldSortButton Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowHookComponent(<ViewToolbarFieldSortButton {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle updating the view query through redux state with a component', async () => {
    const props = {
      useQuery: () => ({ [API_QUERY_TYPES.ORDERING]: '-hello world' })
    };
    const component = await mountHookComponent(<ViewToolbarFieldSortButton {...props} />);
    component.find('button').simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch type, component');
  });

  it('should handle updating the view query through redux state with a hook', async () => {
    const options = {};
    const { result: onClick } = await shallowHook(() => useOnClick(options));

    onClick({ value: 'dolor sit' });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch type, hook');
  });
});
