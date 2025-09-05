import '@testing-library/jest-dom';
import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { ShowConnectionsModal } from '../showSourceConnectionsModal';

describe('ShowConnectionsModal', () => {
  let mockOnClose;
  const maxHostsPerCategory = 3;

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
        maxHostsPerCategory={maxHostsPerCategory}
        onClose={mockOnClose}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const MultipleConnectionsProps = (numSuccessful: number = 1, numFailed: number = 1, numUnreachable: number = 1) => {
    return {
      isOpen: true,
      maxHostsPerCategory: maxHostsPerCategory,
      source: { name: 'Lorem ipsum' },
      connections: {
        successful: Array.from({ length: numSuccessful }, (_, index) => {
          return {
            name: `Dolor sit ${index + 1}`
          };
        }),
        failed: Array.from({ length: numFailed }, (_, index) => {
          return {
            name: `Amet ${index + 1}`
          };
        }),
        unreachable: Array.from({ length: numUnreachable }, (_, index) => {
          return {
            name: `Lorem ipsum sit ${index + 1}`
          };
        })
      }
    };
  };

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

  it('should show all hosts if less than the limit are specified', async () => {
    render(<ShowConnectionsModal {...MultipleConnectionsProps(maxHostsPerCategory - 1)} />);

    const user = userEvent.setup();
    await user.click(document.querySelector('button[id^=succeeded]')!);
    expect(screen.queryByText(`Dolor sit ${maxHostsPerCategory - 1}`)).toBeDefined();
    expect(screen.queryByText(`...`)).toBeNull();
    expect(screen.queryByText(`Dolor sit ${maxHostsPerCategory}`)).toBeNull();
  });

  it('should show all hosts if exactly the limit is specified and no more', async () => {
    render(<ShowConnectionsModal {...MultipleConnectionsProps(maxHostsPerCategory)} />);

    const user = userEvent.setup();
    await user.click(document.querySelector('button[id^=succeeded]')!);
    expect(screen.queryByText(`Dolor sit ${maxHostsPerCategory}`)).toBeDefined();
    expect(screen.queryByText(`...`)).toBeNull();
    expect(screen.queryByText(`Dolor sit ${maxHostsPerCategory + 1}`)).toBeNull();
  });

  it('should limit the number of hosts in connections if more than the limit is specified', async () => {
    render(<ShowConnectionsModal {...MultipleConnectionsProps(maxHostsPerCategory + 4)} />);

    const user = userEvent.setup();
    await user.click(document.querySelector('button[id^=succeeded]')!);
    expect(screen.queryByText(`Dolor sit ${maxHostsPerCategory}`)).toBeDefined();
    expect(screen.queryByText(`...`)).toBeDefined();
    expect(screen.queryByText(`Dolor sit ${maxHostsPerCategory + 1}`)).toBeNull();
  });

  it('should limit the number of hosts for failed connections', async () => {
    render(<ShowConnectionsModal {...MultipleConnectionsProps(1, maxHostsPerCategory + 4)} />);

    const user = userEvent.setup();
    await user.click(document.querySelector('button[id^=failed]')!);
    expect(screen.queryByText(`Amet ${maxHostsPerCategory}`)).toBeDefined();
    expect(screen.queryByText(`...`)).toBeDefined();
    expect(screen.queryByText(`Amet ${maxHostsPerCategory + 1}`)).toBeNull();
  });

  it('should limit the number of hosts for unreachable connections', async () => {
    render(<ShowConnectionsModal {...MultipleConnectionsProps(1, 1, maxHostsPerCategory + 4)} />);

    const user = userEvent.setup();
    await user.click(document.querySelector('button[id^=unreachable]')!);
    expect(screen.queryByText(`Lorem ipsum sit ${maxHostsPerCategory}`)).toBeDefined();
    expect(screen.queryByText(`...`)).toBeDefined();
    expect(screen.queryByText(`Lorem ipsum sit ${maxHostsPerCategory + 1}`)).toBeNull();
  });

  it('should provide a tooltip if there are more connections than the number shown.', async () => {
    const additionalHosts = 4;
    render(<ShowConnectionsModal {...MultipleConnectionsProps(maxHostsPerCategory + additionalHosts)} />);

    const user = userEvent.setup();
    await user.click(document.querySelector('button[id^=succeeded]')!);
    const moreItems = screen.getByText('...');
    expect(moreItems).toBeDefined();

    fireEvent.mouseEnter(moreItems);
    await waitFor(() => {
      expect(screen.getByText(`There are ${additionalHosts} additional hosts not shown.`)).toBeInTheDocument();
    });
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

  it('should reset expanded state on close', async () => {
    const user = userEvent.setup();
    const failedName = 'Amet';

    await user.click(document.querySelector('button[id^=failed]')!);
    expect(screen.getByText(failedName)).toBeVisible();
    await user.click(screen.getByLabelText('Close'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText(failedName)).not.toBeVisible();
  });
});
