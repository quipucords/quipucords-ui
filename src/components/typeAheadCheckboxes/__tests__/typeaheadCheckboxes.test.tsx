import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { TypeaheadCheckboxes } from '../typeaheadCheckboxes';

describe('TypeaheadCheckboxes', () => {
  it('should render a basic component', async () => {
    const props = {
      options: [{ value: 'ipsum', label: 'Lorem' }]
    };
    const component = await shallowComponent(<TypeaheadCheckboxes {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should clear selections and call onChange with [] when clear button is clicked', async () => {
    const mockOnChange = jest.fn();

    render(
      <TypeaheadCheckboxes
        options={[
          { value: 'alpha', label: 'Alpha' },
          { value: 'beta', label: 'Beta' }
        ]}
        selectedOptions={['alpha', 'beta']}
        onChange={mockOnChange}
      />
    );

    const clearButton = await screen.findByRole('button', { name: /clear input value/i });
    await userEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
});
