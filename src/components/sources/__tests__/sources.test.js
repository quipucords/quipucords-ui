import React from 'react';
import { Sources } from '../sources';
import { apiTypes } from '../../../constants/apiConstants';

describe('Sources Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useGetSources: () => ({
        fulfilled: true
      })
    };

    const component = await shallowHookComponent(<Sources {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle multiple display states, pending, error, fulfilled', async () => {
    const props = {
      useGetSources: () => ({
        pending: true
      })
    };

    const component = await shallowHookComponent(<Sources {...props} />);
    expect(component).toMatchSnapshot('pending');

    component.setProps({
      useGetSources: () => ({
        pending: false,
        error: true
      })
    });

    expect(component).toMatchSnapshot('error');

    component.setProps({
      useGetSources: () => ({
        pending: false,
        error: false,
        fulfilled: true,
        data: [
          {
            [apiTypes.API_RESPONSE_SOURCE_ID]: '1',
            [apiTypes.API_RESPONSE_SOURCE_NAME]: 'lorem'
          }
        ]
      })
    });

    expect(component).toMatchSnapshot('fulfilled');
  });

  it('should return an empty state when there are no sources', async () => {
    const props = {
      useGetSources: () => ({
        fulfilled: true,
        data: []
      })
    };

    const component = await shallowHookComponent(<Sources {...props} />);
    expect(component.render()).toMatchSnapshot('empty state');
  });
});
