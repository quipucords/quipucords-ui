import React from 'react';
import { shallowComponent } from '../../../../config/jest.setupTests';
import * as useAuthApi from '../../../hooks/useAuthApi';
import { LightspeedAuth, LightspeedAuthProps } from '../lightspeedAuth';

jest.mock('../../../hooks/useAuthApi');

describe('LightspeedAuth', () => {
  let mockRequestLightspeedAuth;
  let mockCancelLightspeedAuth;

  const mockHookWithState = (lightspeedAuthFlowState: useAuthApi.LightspeedAuthFlowState) => {
    (useAuthApi.useLightspeedAuthApi as jest.Mock).mockReturnValue({
      requestLightspeedAuth: mockRequestLightspeedAuth,
      cancelLightspeedAuth: mockCancelLightspeedAuth,
      lightspeedAuthFlowState: lightspeedAuthFlowState
    });
  };

  beforeEach(() => {
    mockRequestLightspeedAuth = jest.fn();
    mockCancelLightspeedAuth = jest.fn();
    mockHookWithState({ state: 'Initiated' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props: LightspeedAuthProps = {
      lightspeedAuthFlowState: { state: 'Initiated' }
    };
    const component = await shallowComponent(<LightspeedAuth {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render component waiting for authorization', async () => {
    const props: LightspeedAuthProps = {
      lightspeedAuthFlowState: {
        state: 'AwaitingAuthorization',
        uri: 'https://sso.redhat.com/device?user_code=ABCD-EFGH'
      }
    };
    const component = await shallowComponent(<LightspeedAuth {...props} />);
    expect(component).toMatchSnapshot('waiting-for-user');
  });

  it('should render a component after authentication succeeded', async () => {
    const state: useAuthApi.LightspeedAuthFlowState = { state: 'Successful' };
    mockHookWithState(state);
    const props: LightspeedAuthProps = {
      lightspeedAuthFlowState: state
    };
    const component = await shallowComponent(<LightspeedAuth {...props} />);
    expect(component).toMatchSnapshot('success');
  });

  it('should render a component after authentication failed', async () => {
    const state: useAuthApi.LightspeedAuthFlowState = { state: 'Errored', errorMessage: 'Lorem ipsum dolor sit' };
    mockHookWithState(state);
    const props: LightspeedAuthProps = {
      lightspeedAuthFlowState: state
    };
    const component = await shallowComponent(<LightspeedAuth {...props} />);
    expect(component).toMatchSnapshot('errored');
  });
});
