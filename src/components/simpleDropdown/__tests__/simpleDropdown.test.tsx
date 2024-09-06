import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { SimpleDropdown } from '../simpleDropdown';

describe('SimpleDropdown', () => {
  it('should render a basic component', async () => {
    const props = {
      label: 'lorem ipsum'
    };
    const component = await shallowComponent(<SimpleDropdown {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have a dropdown label', async () => {
    const props = {
      label: 'lorem ipsum'
    };
    const component = await shallowComponent(<SimpleDropdown {...props} />);
    expect(component.querySelector('button > span')).toMatchSnapshot('label');
  });

  it('should display items and allow selecting after toggle is clicked', async () => {
    const user = userEvent.setup();
    const onMockSelect = jest.fn();

    const props = {
      label: 'Lorem ipsum',
      onSelect: onMockSelect,
      dropdownItems: ['dolor', 'sit']
    };

    const { asFragment } = render(<SimpleDropdown {...props} />);

    await user.click(screen.getByText(props.label));
    expect(asFragment()).toMatchSnapshot('expanded');

    await user.click(screen.getByText('dolor'));
    expect(onMockSelect.mock.calls).toMatchSnapshot('select');
  });
});
