import React from 'react';
import { Authentication } from '../authentication';

describe('Authentication Component', () => {
  it('should render a basic component', () => {
    const props = {
      session: {
        authorized: true,
        error: false,
        errorMessage: '',
        pending: false
      }
    };
    const component = renderComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should render a component error', () => {
    const props = {
      session: {
        authorized: false,
        error: true,
        errorMessage: 'Authentication credentials were not provided.',
        pending: false
      }
    };
    const component = renderComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component.find('main')).toMatchSnapshot('error');
  });

  it('should render a non-connected component pending', () => {
    const props = {
      session: {
        authorized: false,
        error: false,
        errorMessage: '',
        pending: true
      }
    };
    const component = renderComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component.screen.render()).toMatchSnapshot('pending');
  });

  it('should render a non-connected component authorized', () => {
    const props = {
      session: {
        authorized: true,
        error: false,
        errorMessage: '',
        pending: false
      }
    };
    const component = renderComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component.find('.test')).toMatchSnapshot('authorized');
  });
});
