import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { Login } from '../login';

describe('Login', () => {
  it('should render a basic component', async () => {
    const props = {
      children: 'Lorem ipsum'
    };
    const component = await shallowComponent(<Login {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render authorized children', async () => {
    const props = {
      children: 'Lorem ipsum',
      useGetSetAuth: jest.fn().mockReturnValue({ isAuthorized: true })
    };
    const component = await shallowComponent(<Login {...props} />);
    expect(component).toMatchSnapshot('logged in');
  });

  it('should attempt to use the login service', async () => {
    const mockLogin = jest.fn().mockResolvedValue('success');
    const mockUseLoginApi = jest.fn().mockReturnValue({ login: mockLogin });
    const props = {
      children: 'Lorem ipsum',
      useLogin: mockUseLoginApi
    };

    render(<Login {...props} />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/username/i), 'lorem');
    await user.type(screen.getByLabelText(/password/i), 'ipsum');
    await user.click(screen.getByRole('button'));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin.mock.calls).toMatchSnapshot('submit');
  });
});
