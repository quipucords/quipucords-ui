import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import { AlertVariant } from '@patternfly/react-core';
import { ConnectedToastNotificationsList, ToastNotificationsList } from '../toastNotificationsList';

describe('ToastNotificationsList Component', () => {
  const generateEmptyStore = () => configureMockStore()({ toastNotifications: {} });

  it('should shallow render a basic component', () => {
    const store = generateEmptyStore();
    const props = {};
    const component = shallow(
      <Provider store={store}>
        <ConnectedToastNotificationsList {...props} />
      </Provider>
    );

    expect(component.find(ConnectedToastNotificationsList)).toMatchSnapshot('basic');
  });

  it('should handle toast variations', () => {
    const props = {
      toasts: [
        {
          alertType: undefined,
          header: undefined,
          message: 'Lorem ipsum',
          removed: undefined,
          paused: undefined
        },
        {
          alertType: AlertVariant.success,
          header: 'Dolor sit',
          message: undefined,
          removed: undefined,
          paused: undefined
        },
        {
          alertType: AlertVariant.danger,
          header: 'Dolor sit',
          message: 'Lorem ipsum',
          removed: undefined,
          paused: undefined
        },
        {
          alertType: AlertVariant.info,
          header: 'REMOVED, Dolor sit',
          message: undefined,
          removed: true,
          paused: undefined
        },
        {
          alertType: AlertVariant.info,
          header: 'PAUSED, Dolor sit',
          message: undefined,
          removed: undefined,
          paused: true
        }
      ]
    };
    const component = shallow(<ToastNotificationsList {...props} />);

    expect(component).toMatchSnapshot('variations');
  });
});
