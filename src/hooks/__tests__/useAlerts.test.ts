import { type AlertProps } from '@patternfly/react-core';
import { act, renderHook } from '@testing-library/react';
import { useAlerts } from '../useAlerts';

describe('useAlerts', () => {
  it('should add an alert and verify it is in the alerts list', () => {
    const { result } = renderHook(() => useAlerts());

    act(() => {
      result.current.addAlert({ title: 'Test Alert', variant: 'success', id: 'alert-1' });
    });

    expect(result.current.alerts).toMatchSnapshot('single alert list');
  });

  it('should add multiple alerts and verify all are present in the alerts list', () => {
    const { result } = renderHook(() => useAlerts());
    const alerts: AlertProps[] = [
      { id: 'lorem', title: 'ipsum', variant: 'success' },
      { id: 'hello', title: 'world', variant: 'danger' },
      { id: 'dolor', title: 'sit', variant: 'success' }
    ];

    act(() => {
      result.current.addAlert(alerts);
    });

    expect(result.current.alerts).toEqual(alerts);
  });

  it('should allow removing alerts by any property', () => {
    const { result } = renderHook(() => useAlerts());

    const alerts: AlertProps[] = [
      { id: 'lorem', title: 'ipsum', variant: 'success' },
      { id: 'hello', title: 'world', variant: 'danger' },
      { id: 'dolor', title: 'sit', variant: 'success' },
      { id: 'amet', title: 'consectetur', variant: 'danger' },
      { id: 'adipiscing', title: 'elit', variant: 'danger' }
    ];

    act(() => {
      result.current.addAlert(alerts);
    });

    act(() => {
      result.current.removeAlert(alerts[0].title);
      result.current.removeAlert(alerts[1].id);
      result.current.removeAlert('nonExistentValue');
      result.current.removeAlert('danger');
    });

    expect(result.current.alerts).toMatchSnapshot('removed alerts list');
    expect(result.current.alerts).toHaveLength(1);
  });
});
