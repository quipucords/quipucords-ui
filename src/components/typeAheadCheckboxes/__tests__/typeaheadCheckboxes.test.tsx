import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

  it('should filter options, select one, and close dropdown when maxSelections is 1', async () => {
    const onChange = jest.fn();

    render(
      <TypeaheadCheckboxes
        options={[
          { value: 'alpha', label: 'Alpha' },
          { value: 'beta', label: 'Beta' }
        ]}
        selectedOptions={[]}
        onChange={onChange}
        maxSelections={1}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'alp');

    const alphaOption = await screen.findByText('Alpha');
    await userEvent.click(alphaOption);

    expect(onChange).toHaveBeenCalledWith(['alpha']);

    // Wait for the menu to disappear
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('should filter options, select multiple, and call onChange twice (controlled)', async () => {
    const user = userEvent.setup();
    const options = [
      { value: 'alpha', label: 'Alpha' },
      { value: 'beta', label: 'Beta' },
      { value: 'gamma', label: 'Gamma' }
    ];

    /**
     *
     */
    const Wrapper = () => {
      const [selected, setSelected] = React.useState<string[]>([]);
      return (
        <TypeaheadCheckboxes options={options} selectedOptions={selected} onChange={setSelected} maxSelections={2} />
      );
    };

    render(<Wrapper />);

    const input = screen.getByRole('combobox');
    await user.type(input, 'a');

    const alphaOption = await screen.findByText('Alpha');
    await user.click(alphaOption);

    // Re-open the dropdown before selecting 'Beta'
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'bet');
    const betaOption = await screen.findByText('Beta');
    await user.click(betaOption);

    // Now both should be selected
    expect(screen.getByPlaceholderText('2 items selected')).toBeInTheDocument();

    // Ensure the dropdown closes when maxSelections is reached
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('shows "No results found" when filter yields no matches', async () => {
    render(
      <TypeaheadCheckboxes
        options={[
          { value: 'alpha', label: 'Alpha' },
          { value: 'beta', label: 'Beta' }
        ]}
        selectedOptions={[]}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'zzz');

    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  });
});
