import React from 'react';
import { ViewToolbarSelectCategory, useOnSelect } from '../viewToolbarSelectCategory';
import { CONFIG as sourcesConfig } from '../../sources/sources';
import { store } from '../../../redux/store';

describe('ViewToolbarSelectCategory Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useView: () => ({ viewId: sourcesConfig.viewId, config: { toolbar: sourcesConfig.toolbar } })
    };
    const component = await shallowComponent(<ViewToolbarSelectCategory {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle updating the view query through redux state with a component', () => {
    const props = {
      useView: () => ({ viewId: sourcesConfig.viewId, config: { toolbar: sourcesConfig.toolbar } })
    };

    const component = renderComponent(<ViewToolbarSelectCategory {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('button.pf-c-select__menu-item');
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch type, component');
  });

  it('should handle updating the view query through redux state with a hook', async () => {
    const options = {};
    const { result: onSelect } = await renderHook(() => useOnSelect(options));

    onSelect({ value: 'dolor sit' });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch type, hook');
  });
});
