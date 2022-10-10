import React from 'react';
import { AlertVariant } from '@patternfly/react-core';
import { ToastNotificationsList, useOnDismiss, useOnHover, useOnLeave } from '../toastNotificationsList';
import { store } from '../../../redux';

describe('ToastNotificationsList Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowHookComponent(<ToastNotificationsList {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle toast variations', async () => {
    const toasts = [
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
    ];
    const props = {
      useSelector: () => toasts
    };

    const component = await shallowHookComponent(<ToastNotificationsList {...props} />);
    expect(component).toMatchSnapshot('variations');
  });

  it('should handle removing toasts through redux state with a hook', async () => {
    const options = {};
    const { result: onDismiss } = await shallowHook(() => useOnDismiss(options));

    onDismiss({ mockToast: 'lorem ipsum' });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch removing a toast, hook');
  });

  it('should handle pausing toasts through redux state with a hook', async () => {
    const options = {};
    const { result: onHover } = await shallowHook(() => useOnHover(options));

    onHover({ mockToast: 'lorem ipsum' });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch pausing a toast, hook');
  });

  it('should handle resuming toasts through redux state with a hook', async () => {
    const options = {};
    const { result: onLeave } = await shallowHook(() => useOnLeave(options));

    onLeave({ mockToast: 'lorem ipsum' });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch resuming a toast, hook');
  });
});
