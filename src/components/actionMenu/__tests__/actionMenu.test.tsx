import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { ActionMenu } from '../actionMenu';

describe('ActionMenu', () => {
  it('should render a basic component', async () => {
    const props = {
      item: { foo: 'bar' },
      actions: [{ label: 'Lorem ipsum', onClick: item => jest.fn(item) }]
    };
    const component = await shallowComponent(<ActionMenu {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should display items and allow click after toggle is clicked', async () => {
    const user = userEvent.setup();
    const onMockClick = jest.fn();

    const props = {
      item: { foo: 'bar' },
      actions: [{ label: 'Lorem ipsum', onClick: onMockClick }]
    };

    const { asFragment } = render(<ActionMenu {...props} />);

    await user.click(screen.getByRole('button'));
    expect(asFragment()).toMatchSnapshot('expanded');

    await user.click(screen.getByText('Lorem ipsum'));
    expect(onMockClick.mock.calls).toMatchSnapshot('click');
  });
});
