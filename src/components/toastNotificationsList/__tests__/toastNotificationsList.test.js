import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import ToastNotificationsList from '../toastNotificationsList';

describe('ToastNotificationsList Component', () => {
  const generateEmptyStore = () => configureMockStore()({ toastNotifications: {} });

  it('should shallow render a basic component', () => {
    const store = generateEmptyStore();
    const props = { show: true };
    const wrapper = shallow(
      <Provider store={store}>
        <ToastNotificationsList {...props} />
      </Provider>
    );

    expect(wrapper.find(ToastNotificationsList)).toMatchSnapshot();
  });
});
