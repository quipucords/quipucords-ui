import React from 'react';
import { Credentials } from '../credentials';
import { apiTypes } from '../../../constants/apiConstants';

describe('Credentials Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useGetCredentials: () => ({
        fulfilled: true
      })
    };

    const component = await shallowHookComponent(<Credentials {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle multiple display states, pending, error, fulfilled', async () => {
    const props = {
      useGetCredentials: () => ({
        pending: true
      })
    };

    const component = await shallowHookComponent(<Credentials {...props} />);
    expect(component).toMatchSnapshot('pending');

    component.setProps({
      useGetCredentials: () => ({
        pending: false,
        error: true
      })
    });

    expect(component).toMatchSnapshot('error');

    component.setProps({
      useGetCredentials: () => ({
        pending: false,
        error: false,
        fulfilled: true,
        data: [
          {
            [apiTypes.API_RESPONSE_CREDENTIAL_ID]: '1',
            [apiTypes.API_RESPONSE_CREDENTIAL_NAME]: 'lorem'
          }
        ]
      })
    });

    expect(component).toMatchSnapshot('fulfilled');
  });

  it('should return an empty state when there are no credentials', async () => {
    const props = {
      useGetCredentials: () => ({
        fulfilled: true,
        data: []
      })
    };

    const component = await shallowHookComponent(<Credentials {...props} />);
    expect(component.render()).toMatchSnapshot('empty state');
  });
});
