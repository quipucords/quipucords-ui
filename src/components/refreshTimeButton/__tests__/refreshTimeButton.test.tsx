import '@testing-library/jest-dom';
import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import moment from 'moment';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { RefreshTimeButton } from '../refreshTimeButton';

describe('RefreshTimeButton', () => {
  const MOCKED_CURRENT_TIME = '2025-01-10T12:00:00.000Z';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(MOCKED_CURRENT_TIME));
    jest.spyOn(moment.prototype, 'utcOffset').mockImplementation(function (this: moment.Moment, offset: unknown) {
      return offset !== undefined ? this : 0;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      lastRefresh: moment().subtract(1, 'week').valueOf(),
      onRefresh: () => {}
    };
    const component = await shallowComponent(<RefreshTimeButton {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render component without refresh time set', async () => {
    const props = {
      lastRefresh: 0,
      onRefresh: () => {}
    };
    const component = await shallowComponent(<RefreshTimeButton {...props} />);
    expect(component).toMatchSnapshot('no refresh set');
  });

  it('should change label as time advances', async () => {
    const props = {
      lastRefresh: moment().valueOf(),
      onRefresh: () => {}
    };
    await act(async () => {
      render(<RefreshTimeButton {...props} />);
    });
    expect(screen.getByText(/a few seconds ago/)).toBeInTheDocument();
    await act(async () => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });
    expect(screen.getByText(/5 minutes ago/)).toBeInTheDocument();
  });
});
