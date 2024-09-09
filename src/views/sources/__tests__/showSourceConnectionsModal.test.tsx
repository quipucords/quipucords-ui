import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { ShowConnectionsModal } from '../showSourceConnectionsModal';

describe('ShowConnectionsModal', () => {
  let mockOnClose;

  beforeEach(() => {
    mockOnClose = jest.fn();
    render(
      <ShowConnectionsModal
        connections={{
          successful: [],
          failed: [{ name: 'Amet' }],
          unreachable: []
        }}
        source={{ name: 'Lorem ipsum' }}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      isOpen: true,
      source: { name: 'Lorem ipsum' },
      connections: {
        successful: [{ name: 'Dolor sit' }],
        failed: [{ name: 'Amet' }],
        unreachable: [{ name: 'Ipsum' }]
      }
    };
    const component = await shallowComponent(<ShowConnectionsModal {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have the correct title', () => {
    const title = screen.getByText(new RegExp('Lorem ipsum'));
    expect(title).toMatchSnapshot('title');
  });

  it('should toggle a row', async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByLabelText('Details')[0]);

    const rows = screen.getAllByRole('rowgroup').filter(element => element.classList.contains('pf-m-expanded'));
    expect(rows).toHaveLength(1);
  });

  it('should call onClose', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Close'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
