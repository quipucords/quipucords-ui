import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { ExtendedButton } from '../ExtendedButton';

test('Renders without children', () => {
  render(
    <div data-testid="container">
      <ExtendedButton />
    </div>
  );

  expect(screen.getByTestId('container').firstChild).toBeVisible();
});

test('Renders children', () => {
  render(<ExtendedButton>Test</ExtendedButton>);

  expect(screen.getByRole('button', { name: 'Test' })).toBeVisible();
});

test('Passes inherited props to the returned component', () => {
  render(<ExtendedButton aria-label="Test label">Test</ExtendedButton>);

  expect(screen.getByRole('button')).toHaveAccessibleName('Test label');
});

test('Renders as a primary button initially', () => {
  render(<ExtendedButton>Test</ExtendedButton>);

  expect(screen.getByRole('button')).toHaveClass('pf-v6-c-button pf-m-primary', {
    exact: true
  });
});

test('Renders as a secondary button once it has been clicked once', async () => {
  render(<ExtendedButton>Test</ExtendedButton>);

  const button = screen.getByRole('button');
  userEvent.click(button);

  await waitFor(() => {
    expect(button).toHaveClass('pf-v6-c-button pf-m-secondary', {
      exact: true
    });
  });
});

test('Renders as a tertiary button once it has been clicked twice', async () => {
  render(<ExtendedButton>Test</ExtendedButton>);

  const button = screen.getByRole('button');
  userEvent.click(button);
  userEvent.click(button);

  await waitFor(() => {
    expect(button).toHaveClass('pf-v6-c-button pf-m-tertiary', {
      exact: true
    });
  });
});

test('Loops back to rendering a primary button again after being clicked three times', async () => {
  render(<ExtendedButton>Test</ExtendedButton>);

  const button = screen.getByRole('button');
  userEvent.click(button);
  userEvent.click(button);
  userEvent.click(button);

  await waitFor(() => {
    expect(button).toHaveClass('pf-v6-c-button pf-m-primary', {
      exact: true
    });
  });
});

test('Matches expected default snapshot', () => {
  const { asFragment } = render(<ExtendedButton ouiaId="ouiaId">Test</ExtendedButton>);

  expect(asFragment()).toMatchSnapshot();
});
