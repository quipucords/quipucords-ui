import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionMenu from '../ActionMenu';
import '@testing-library/jest-dom';

test('renders proper dom including ellipsis icon', () => {
  const item = { foo: 'bar' };
  const actionClicked = jest.fn();
  const { asFragment } = render(
    <ActionMenu<{ foo: string }>
      item={item}
      actions={[{ label: 'Delete', onClick: actionClicked }]}
    />
  );
  expect(asFragment()).toMatchSnapshot();
});

test('actions will not show before button is clicked', () => {
  const item = { foo: 'bar' };
  const actionClicked = jest.fn();
  const { queryByText } = render(
    <ActionMenu<{ foo: string }>
      item={item}
      actions={[{ label: 'Delete', onClick: actionClicked }]}
    />
  );
  expect(queryByText('Delete')).toBeNull();
});

test('actions will show after button is clicked', async () => {
  const user = userEvent.setup();

  const item = { foo: 'bar' };
  const actionClicked = jest.fn();
  render(
    <ActionMenu<{ foo: string }>
      item={item}
      actions={[{ label: 'Delete', onClick: actionClicked }]}
    />
  );
  const toggleButton = await screen.findByLabelText('Action Menu Toggle');
  await user.click(toggleButton);
  expect(screen.getByText('Delete')).toBeVisible();
});

test('snapshot matches after opening the action menu', async () => {
  const user = userEvent.setup();

  const item = { foo: 'bar' };
  const actionClicked = jest.fn();
  const { asFragment } = render(
    <ActionMenu<{ foo: string }>
      item={item}
      actions={[{ label: 'Delete', onClick: actionClicked }]}
    />
  );
  const toggleButton = await screen.findByLabelText('Action Menu Toggle');
  await user.click(toggleButton);
  expect(asFragment()).toMatchSnapshot();
});

test('action callback should get called when clicked', async () => {
  const user = userEvent.setup();

  const item = { foo: 'bar' };
  const actionClicked = jest.fn();
  render(
    <ActionMenu<{ foo: string }>
      item={item}
      actions={[{ label: 'Delete', onClick: actionClicked }]}
    />
  );
  expect(actionClicked).toHaveBeenCalledTimes(0);
  const toggleButton = await screen.findByLabelText('Action Menu Toggle');
  await user.click(toggleButton);
  const deleteButton = await screen.findByText('Delete');
  await user.click(deleteButton);
  expect(actionClicked).toHaveBeenCalledTimes(1);
});

test('action menu closes after selection', async () => {
  const user = userEvent.setup();

  const item = { foo: 'bar' };
  const actionClicked = jest.fn();
  render(
    <ActionMenu<{ foo: string }>
      item={item}
      actions={[{ label: 'Delete', onClick: actionClicked }]}
    />
  );
  const toggleButton = await screen.findByLabelText('Action Menu Toggle');
  await user.click(toggleButton);
  const deleteButton = await screen.findByText('Delete');
  expect(deleteButton).toBeVisible();
  await user.click(deleteButton);
  expect(deleteButton).not.toBeVisible();
});

test('action menu closes if toggle is clicked again', async () => {
  const user = userEvent.setup();

  const item = { foo: 'bar' };
  const actionClicked = jest.fn();
  render(
    <ActionMenu<{ foo: string }>
      item={item}
      actions={[{ label: 'Delete', onClick: actionClicked }]}
    />
  );
  const toggleButton = await screen.findByLabelText('Action Menu Toggle');
  await user.click(toggleButton);
  const deleteButton = await screen.findByText('Delete');
  expect(deleteButton).toBeVisible();
  await user.click(toggleButton);
  expect(deleteButton).not.toBeVisible();
});
