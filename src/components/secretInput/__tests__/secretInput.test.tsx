import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { SecretInput } from '../secretInput';

describe('SecretInput', () => {
  let mockOnChange;
  let mockOnEditBegin;
  let mockOnUndo;
  const defaultParams = {
    value: undefined,
    id: 'id',
    name: 'name',
    placeholder: 'placeholder',
    ouiaId: 'ouia-id'
  };

  beforeEach(async () => {
    mockOnChange = jest.fn();
    mockOnEditBegin = jest.fn();
    mockOnUndo = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render a basic component without secret', async () => {
    const component = await shallowComponent(
      <SecretInput
        {...defaultParams}
        validated="default"
        onChange={mockOnChange}
        onEditBegin={mockOnEditBegin}
        onUndo={mockOnUndo}
        hasSecret={false}
      />
    );
    expect(component).toMatchSnapshot('basic without secret');
  });

  it('should render a basic component with secret', async () => {
    const component = await shallowComponent(
      <SecretInput
        {...defaultParams}
        validated="default"
        onChange={mockOnChange}
        onEditBegin={mockOnEditBegin}
        onUndo={mockOnUndo}
        hasSecret={true}
      />
    );
    expect(component).toMatchSnapshot('basic with secret');
  });

  it('should support editing secret', async () => {
    const user = userEvent.setup();

    const { asFragment } = render(
      <SecretInput
        {...defaultParams}
        validated="default"
        onChange={mockOnChange}
        onEditBegin={mockOnEditBegin}
        onUndo={mockOnUndo}
        hasSecret={true}
      />
    );

    await user.click(document.querySelector('button[data-ouia-component-id="secret-edit"]')!);
    expect(asFragment()).toMatchSnapshot('with secret - edited');
  });

  it('should support secret editing undo', async () => {
    const user = userEvent.setup();

    const { asFragment } = render(
      <SecretInput
        {...defaultParams}
        validated="default"
        onChange={mockOnChange}
        onEditBegin={mockOnEditBegin}
        onUndo={mockOnUndo}
        hasSecret={true}
      />
    );

    const preEdit = asFragment();

    await user.click(document.querySelector('button[data-ouia-component-id="secret-edit"]')!);
    await user.click(document.querySelector('button[data-ouia-component-id="secret-undo"]')!);
    expect(asFragment()).toEqual(preEdit);
  });

  it('should render a basic component with error', async () => {
    const component = await shallowComponent(
      <SecretInput
        {...defaultParams}
        validated="error"
        onChange={mockOnChange}
        onEditBegin={mockOnEditBegin}
        onUndo={mockOnUndo}
        hasSecret={false}
      />
    );
    expect(component).toMatchSnapshot('basic with error');
  });
});
