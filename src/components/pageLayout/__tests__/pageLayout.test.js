import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { ConnectedPageLayout, PageLayout } from '../pageLayout';

describe('PageLayout Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({
      user: { session: { authorized: false, username: 'lorem' } }
    });
    const component = shallow(
      <BrowserRouter>
        <ConnectedPageLayout>
          <span className="test">lorem</span>
        </ConnectedPageLayout>
      </BrowserRouter>,
      { context: { store } }
    );

    expect(component.find(ConnectedPageLayout)).toMatchSnapshot('connected');
  });

  it('should render a non-connected component unauthorized', () => {
    const props = {
      session: {
        authorized: false,
        username: 'lorem'
      }
    };
    const component = mount(
      <PageLayout {...props}>
        <span className="test">lorem</span>
      </PageLayout>
    );

    expect(component).toMatchSnapshot('non-connected unauthorized');
  });

  it('should render a non-connected component authorized', () => {
    const props = {
      session: {
        authorized: true,
        username: 'lorem'
      }
    };
    const component = shallow(
      <PageLayout {...props}>
        <span className="test">lorem</span>
      </PageLayout>
    );

    expect(component).toMatchSnapshot('non-connected authorized');
  });

  it('should render a non-connected component branded', () => {
    const props = {
      session: {
        authorized: true,
        username: 'lorem'
      },
      uiBrand: true
    };
    const component = shallow(
      <PageLayout {...props}>
        <span className="test">lorem</span>
      </PageLayout>
    );

    expect(component).toMatchSnapshot('non-connected brand');
  });
});
