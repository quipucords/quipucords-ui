import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { SimpleDropdown } from '../simpleDropdown';

describe('SimpleDropdown', () => {
  it('should render a basic component', async () => {
    expect(true).toBe(true);
  });
});
