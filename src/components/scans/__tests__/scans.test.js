import React from 'react';
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

    const component = await shallowComponent(<Scans {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle multiple display states, pending, error, fulfilled', async () => {
    const props = {
      useGetScans: () => ({
        pending: true
      })
    };

    const component = await shallowComponent(<Scans {...props} />);
    expect(component).toMatchSnapshot('pending');

    const componentError = await component.setProps({
      useGetScans: () => ({
        pending: false,
        error: true
      })
    });

    expect(componentError).toMatchSnapshot('error');

    const componentFulfilled = await component.setProps({
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

    expect(componentFulfilled).toMatchSnapshot('fulfilled');
  });

  it('should return an empty state when there are no scans', async () => {
    const props = {
      useGetScans: () => ({
        fulfilled: true,
        data: []
      })
    };

    const component = await shallowComponent(<Scans {...props} />);
    expect(component).toMatchSnapshot('empty state, no data');

    const componentEmptyState = await component.setProps({
      useView: () => ({
        isFilteringActive: true
      })
    });

    expect(componentEmptyState).toMatchSnapshot('empty state, filtering active');
  });
});
