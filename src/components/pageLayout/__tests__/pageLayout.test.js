import React from 'react';
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
    const component = await shallowComponent(
      <PageLayout {...props}>
        <span className="test">lorem</span>
      </PageLayout>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should render a basic component branded', () => {
    const props = {
      useLocation: jest.fn(),
      useNavigate: jest.fn(),
      useSelector: () => ({
        authorized: true,
        username: 'lorem'
      }),
      isUiBrand: true
    };
    const component = renderComponent(
      <PageLayout {...props}>
        <span className="test">lorem</span>
      </PageLayout>
    );

    expect(component.querySelector('.pf-c-masthead__brand')).toMatchSnapshot('brand');
  });
});
