import '@testing-library/jest-dom';
import React, { act } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AppLayout as ViewLayout } from '../viewLayout';

describe('ViewLayout', () => {
  let axiosGetSpy: jest.SpyInstance;

  beforeEach(() => {
    axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));
  });

  afterEach(() => {
    axiosGetSpy.mockRestore();
  });

  it('should render a basic component', async () => {
    const props = {
      children: 'Lorem ipsum'
    };
    const component = await shallowComponent(<ViewLayout {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render a brand component', async () => {
    const props = {
      children: 'Lorem ipsum',
      titleImg: 'titleBrand.svg',
      uiName: 'Discovery'
    };
    const component = await shallowComponent(<ViewLayout {...props} />);
    expect(component.querySelectorAll('[alt*="Discovery"],source')).toMatchSnapshot('brand');
  });

  it('should toggle visibility of sidebar on a button click', async () => {
    const user = userEvent.setup();

    const props = {
      children: 'Lorem ipsum'
    };
    await act(async () => {
      render(<ViewLayout {...props} />);
    });
    expect(document.getElementById('page-sidebar')).toBeVisible();
    await user.click(document.querySelector('button[data-ouia-component-id="global-navigation"]')!);
    expect(document.getElementById('page-sidebar')).toBeNull();
    await user.click(document.querySelector('button[data-ouia-component-id="global-navigation"]')!);
    expect(document.getElementById('page-sidebar')).toBeVisible();
  });

  it('should skip to content', async () => {
    const user = userEvent.setup();

    const props = {
      children: 'Lorem ipsum'
    };
    await act(async () => {
      render(<ViewLayout {...props} />);
    });
    const oldFocused = document.activeElement;
    await user.tab();
    await user.keyboard('{enter}');
    expect(document.activeElement).not.toEqual(oldFocused);
  });
});
