import React from 'react';
import { EmptyState } from '@patternfly/react-core';
import { Scans, CONFIG } from '../scans';
import { apiTypes } from '../../../constants/apiConstants';

describe('Scans Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useGetScans: () => ({
        fulfilled: true
      }),
      useView: () => ({ viewId: CONFIG.viewId })
    };

    const component = await shallowHookComponent(<Scans {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle multiple display states, pending, error, fulfilled', async () => {
    const props = {
      useGetScans: () => ({
        pending: true
      })
    };

    const component = await shallowHookComponent(<Scans {...props} />);
    expect(component).toMatchSnapshot('pending');

    component.setProps({
      useGetScans: () => ({
        pending: false,
        error: true
      })
    });

    expect(component).toMatchSnapshot('error');

    component.setProps({
      useGetScans: () => ({
        pending: false,
        error: false,
        fulfilled: true,
        data: [
          {
            [apiTypes.API_RESPONSE_SCAN_ID]: '1',
            [apiTypes.API_RESPONSE_SCAN_NAME]: 'lorem'
          }
        ]
      })
    });

    expect(component).toMatchSnapshot('fulfilled');
  });

  it('should return an empty state when there are no scans', async () => {
    const props = {
      useGetScans: () => ({
        fulfilled: true,
        data: []
      })
    };

    const component = await shallowHookComponent(<Scans {...props} />);
    expect(component).toMatchSnapshot('empty state, no data');

    component.setProps({
      useView: () => ({
        isFilteringActive: true
      })
    });

    expect(component.find(EmptyState)).toMatchSnapshot('empty state, filtering active');
  });
});
