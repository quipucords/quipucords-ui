import React from 'react';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AppToolbar as ViewToolbar } from '../viewLayoutToolbar';

describe('ViewToolbar', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowComponent(<ViewToolbar {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should attempt to load and display a username', async () => {
    const mockGetUser = jest.fn().mockResolvedValue('Dolor sit');
    const props = {
      useUser: jest.fn().mockReturnValue({ getUser: mockGetUser })
    };

    const component = await shallowComponent(<ViewToolbar {...props} />);
    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(component.querySelector('.quipucords-toolbar__user-dropdown')).toMatchSnapshot('user');
  });
});
