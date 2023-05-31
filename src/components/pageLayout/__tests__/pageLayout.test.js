import React from 'react';
import { Page } from '@patternfly/react-core';
import { PageLayout } from '../pageLayout';

describe('PageLayout Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useLocation: jest.fn(),
      useNavigate: jest.fn(),
      useSelector: () => ({
        authorized: true,
        username: 'lorem'
      })
    };
    const component = await shallowHookComponent(
      <PageLayout {...props}>
        <span className="test">lorem</span>
      </PageLayout>
    );

    expect(component.find(Page)).toMatchSnapshot('basic');
  });

  it('should render a basic component branded', async () => {
    const props = {
      useLocation: jest.fn(),
      useNavigate: jest.fn(),
      useSelector: () => ({
        authorized: true,
        username: 'lorem'
      }),
      isUiBrand: true
    };
    const component = await shallowHookComponent(
      <PageLayout {...props}>
        <span className="test">lorem</span>
      </PageLayout>
    );

    expect(component.find(Page).prop('header')).toMatchSnapshot('brand');
  });
});
