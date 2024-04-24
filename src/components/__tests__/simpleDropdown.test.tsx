import React from 'react';
import { DropdownItem } from '@patternfly/react-core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { SimpleDropdown } from '../simpleDropdown';

const exampleItems = ['SSLv23', 'TLSv1', 'TLSv1.1', 'TLSv1.2', 'Disable SSL'];

test('renders proper dom snapshot', () => {
  const setSslProtocol = jest.fn();
  const { asFragment } = render(
    <SimpleDropdown
      isFullWidth
      label="dropdown label"
      variant={'default'}
      dropdownItems={exampleItems.map(s => (
        <DropdownItem key={s} onClick={() => setSslProtocol(s)}>
          {s}
        </DropdownItem>
      ))}
    />
  );
  expect(asFragment()).toMatchSnapshot();
});

test('dropdown label is visible', () => {
  const setSslProtocol = jest.fn();
  render(
    <SimpleDropdown
      isFullWidth
      label="dropdown label"
      variant={'default'}
      dropdownItems={exampleItems.map(s => (
        <DropdownItem key={s} onClick={() => setSslProtocol(s)}>
          {s}
        </DropdownItem>
      ))}
    />
  );
  expect(screen.getByText('dropdown label')).toBeVisible();
});

test('options will not show before toggle is clicked', async () => {
  const setSslProtocol = jest.fn();
  render(
    <SimpleDropdown
      isFullWidth
      label="dropdown label"
      variant={'default'}
      dropdownItems={exampleItems.map(s => (
        <DropdownItem key={s} onClick={() => setSslProtocol(s)}>
          {s}
        </DropdownItem>
      ))}
    />
  );
  exampleItems.forEach(i => {
    expect(screen.queryByText(i)).toBeNull();
  });
});

test('snapshot after toggle is clicked', async () => {
  const user = userEvent.setup();
  const setSslProtocol = jest.fn();
  const { asFragment } = render(
    <SimpleDropdown
      isFullWidth
      label="dropdown label"
      variant={'default'}
      dropdownItems={exampleItems.map(s => (
        <DropdownItem key={s} onClick={() => setSslProtocol(s)}>
          {s}
        </DropdownItem>
      ))}
    />
  );
  const toggleButton = screen.getByText('dropdown label');
  await act(() => user.click(toggleButton));
  expect(asFragment()).toMatchSnapshot();
});

test('options will show after toggle is clicked', async () => {
  const user = userEvent.setup();
  const setSslProtocol = jest.fn();
  render(
    <SimpleDropdown
      isFullWidth
      label="dropdown label"
      variant={'default'}
      dropdownItems={exampleItems.map(s => (
        <DropdownItem key={s} onClick={() => setSslProtocol(s)}>
          {s}
        </DropdownItem>
      ))}
    />
  );
  const toggleButton = screen.getByText('dropdown label');
  await act(() => user.click(toggleButton));
  exampleItems.forEach(i => {
    expect(screen.getByText(i)).toBeVisible();
  });
});

test('menu will go away after toggle is clicked twice', async () => {
  const user = userEvent.setup();
  const setSslProtocol = jest.fn();
  render(
    <SimpleDropdown
      isFullWidth
      label="dropdown label"
      variant={'default'}
      dropdownItems={exampleItems.map(s => (
        <DropdownItem key={s} onClick={() => setSslProtocol(s)}>
          {s}
        </DropdownItem>
      ))}
    />
  );

  const toggleButton = await screen.getByText('dropdown label');

  await act(async () => {
    user.click(toggleButton);
    await new Promise(r => setTimeout(r, 300)); // simulate delay
    user.click(toggleButton);
  });
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

test('menu will go away after option selected', async () => {
  const user = userEvent.setup();
  const setSslProtocol = jest.fn();
  render(
    <SimpleDropdown
      isFullWidth
      label="dropdown label"
      variant={'default'}
      dropdownItems={exampleItems.map(s => (
        <DropdownItem key={s} onClick={() => setSslProtocol(s)}>
          {s}
        </DropdownItem>
      ))}
    />
  );
  const toggleButton = await screen.getByText('dropdown label');
  await act(() => user.click(toggleButton));

  const option = await screen.getByText(exampleItems[2]);
  await act(() => user.click(option));

  await waitFor(
    () => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    },
    { timeout: 1000 }
  );
});

test('onclick callback should get called when clicked', async () => {
  const user = userEvent.setup();
  const setSslProtocol = jest.fn();
  render(
    <SimpleDropdown
      isFullWidth
      label="dropdown label"
      variant={'default'}
      dropdownItems={exampleItems.map(s => (
        <DropdownItem key={s} onClick={() => setSslProtocol(s)}>
          {s}
        </DropdownItem>
      ))}
    />
  );
  expect(setSslProtocol).toHaveBeenCalledTimes(0);
  const toggleButton = await screen.getByText('dropdown label');
  await act(() => user.click(toggleButton));

  const option = await screen.getByText(exampleItems[2]);
  await act(() => user.click(option));
  expect(setSslProtocol).toHaveBeenCalledTimes(1);
  expect(setSslProtocol).toHaveBeenCalledWith(exampleItems[2]);
});
