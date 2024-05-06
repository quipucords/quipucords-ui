import React from 'react';
import { ViewToolbar } from '../viewToolbar';
import { API_QUERY_TYPES } from '../../../constants/apiConstants';
import { CONFIG as sourcesConfig } from '../../sources/sources';

describe('ViewToolbar Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useView: () => ({ viewId: sourcesConfig.viewId, config: { toolbar: sourcesConfig.toolbar } })
    };
    const component = await shallowComponent(<ViewToolbar {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should hide categories when a single filter is available', () => {
    const props = {
      useView: () => ({
        viewId: sourcesConfig.viewId,
        config: {
          toolbar: { filterFields: [sourcesConfig.toolbar.filterFields[0]] }
        }
      })
    };
    const component = renderComponent(<ViewToolbar {...props} />);

    expect(component.querySelectorAll('input[type="text"]')).toMatchSnapshot('single filter');
  });

  it('should handle updating toolbar chips', () => {
    const props = {
      useView: () => ({
        viewId: sourcesConfig.viewId,
        query: { [API_QUERY_TYPES.SEARCH_NAME]: 'lorem ipsum' },
        config: {
          toolbar: { filterFields: [sourcesConfig.toolbar.filterFields[0]] }
        }
      })
    };
    const component = renderComponent(<ViewToolbar {...props} />);

    expect(component.querySelectorAll('.pf-c-chip')).toMatchSnapshot('chips');
  });

  it('should handle displaying secondary components, fields', async () => {
    const props = {
      useView: () => ({
        viewId: sourcesConfig.viewId,
        config: {
          toolbar: { filterFields: [sourcesConfig.toolbar.filterFields[0]] }
        }
      }),
      secondaryFields: [<React.Fragment>dolor sit</React.Fragment>]
    };
    const component = await shallowComponent(<ViewToolbar {...props} />);

    expect(component).toMatchSnapshot('secondary');
  });
});
