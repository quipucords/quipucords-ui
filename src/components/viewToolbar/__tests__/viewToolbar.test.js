import React from 'react';
import { ToolbarFilter } from '@patternfly/react-core';
import { ViewToolbar } from '../viewToolbar';
import { ViewToolbarTextInput } from '../viewToolbarTextInput';
import { API_QUERY_TYPES } from '../../../constants/apiConstants';
import { CONFIG as sourcesConfig } from '../../sources/sources';

describe('ViewToolbar Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useView: () => ({ viewId: sourcesConfig.viewId, config: { toolbar: sourcesConfig.toolbar } })
    };
    const component = await shallowHookComponent(<ViewToolbar {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should hide categories when a single filter is available', async () => {
    const props = {
      useView: () => ({
        viewId: sourcesConfig.viewId,
        config: {
          toolbar: { filterFields: [sourcesConfig.toolbar.filterFields[0]] }
        }
      })
    };
    const component = await mountHookComponent(<ViewToolbar {...props} />);

    expect(component.find(ViewToolbarTextInput).first()).toMatchSnapshot('single filter');
  });

  it('should handle updating toolbar chips', async () => {
    const props = {
      useView: () => ({
        viewId: sourcesConfig.viewId,
        query: { [API_QUERY_TYPES.SEARCH_NAME]: 'lorem ipsum' },
        config: {
          toolbar: { filterFields: [sourcesConfig.toolbar.filterFields[0]] }
        }
      })
    };
    const component = await shallowHookComponent(<ViewToolbar {...props} />);

    expect(component.find(ToolbarFilter).props()).toMatchSnapshot('chips');
  });

  it('should handle displaying secondary components, fields', async () => {
    const props = {
      useView: () => ({
        viewId: sourcesConfig.viewId,
        config: {
          toolbar: { filterFields: [sourcesConfig.toolbar.filterFields[0]] }
        }
      }),
      secondaryFields: <React.Fragment>dolor sit</React.Fragment>
    };
    const component = await shallowHookComponent(<ViewToolbar {...props} />);

    expect(component).toMatchSnapshot('secondary');
  });
});
