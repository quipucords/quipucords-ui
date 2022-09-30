import React from 'react';
import { ViewPaginationRow, useOnPerPageSelect, useOnSetPage } from '../viewPaginationRow';
import { API_QUERY_TYPES } from '../../../constants/apiConstants';
import { store } from '../../../redux';

describe('ViewPaginationRow Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      totalResults: 200,
      useQuery: () => ({ [API_QUERY_TYPES.PAGE]: 1, [API_QUERY_TYPES.PAGE_SIZE]: 10 })
    };

    const component = await shallowHookComponent(<ViewPaginationRow {...props} />);
    expect(component.render()).toMatchSnapshot('basic');
  });

  it('should handle updating the page query through redux state with a hook', async () => {
    const options = {
      useView: () => ({ viewId: 'lorem ipsum' })
    };
    const { result: onSetPage } = await shallowHook(() => useOnSetPage(options));

    onSetPage(3);
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch set page, hook');
  });

  it('should handle updating the per-page query through redux state with a hook', async () => {
    const options = {
      useView: () => ({ viewId: 'lorem ipsum' })
    };
    const { result: onPerPageSelect } = await shallowHook(() => useOnPerPageSelect(options));

    onPerPageSelect(25);
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch per-page, hook');
  });
});
