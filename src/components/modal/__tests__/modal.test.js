import React from 'react';
import { Modal } from '../modal';

describe('Modal Component', () => {
  it('should render a basic component', () => {
    const props = {
      isOpen: true,
      disableFocusTrap: true
    };

    const component = renderComponent(<Modal {...props}>lorem ipsum</Modal>);
    expect(component.screen.render()).toMatchSnapshot('basic');
  });

  it('should pass specific and custom props', () => {
    const props = {
      backdrop: false
    };

    const component = renderComponent(<Modal {...props}>lorem ipsum</Modal>);
    expect(component.screen.render()).toMatchSnapshot('backdrop');

    const componentAriaLabel = component.setProps({ backdrop: true, 'aria-label': 'dolor sit' });
    expect(componentAriaLabel.props).toMatchSnapshot('aria-label');

    const componentContentOnly = component.setProps({ backdrop: true, isContentOnly: true });
    expect(componentContentOnly.props).toMatchSnapshot('isContentOnly');
  });

  it('should allow custom headers and footers', () => {
    // disableFocusTrap for testing only
    const props = {
      isOpen: true,
      disableFocusTrap: true
    };

    props.header = undefined;
    props.footer = undefined;
    const componentUndefined = renderComponent(<Modal {...props}>hello world</Modal>);
    expect(componentUndefined.screen.render()).toMatchSnapshot('undefined');
    componentUndefined.unmount();

    props.header = 'lorem ipsum';
    props.footer = 'dolor sit';
    const componentString = renderComponent(<Modal {...props}>hello world</Modal>);
    expect(componentString.screen.render()).toMatchSnapshot('string');
    componentString.unmount();

    props.header = () => 'lorem ipsum';
    props.footer = () => 'dolor sit';
    const componentFunction = renderComponent(<Modal {...props}>hello world</Modal>);
    expect(componentFunction.screen.render()).toMatchSnapshot('function');
    componentFunction.unmount();

    props.header = [<React.Fragment key="lorem">lorem ipsum</React.Fragment>];
    props.footer = [<React.Fragment key="dolor">dolor sit</React.Fragment>];
    const componentList = renderComponent(<Modal {...props}>hello world</Modal>);
    expect(componentList.screen.render()).toMatchSnapshot('list');
    componentList.unmount();

    props.header = <React.Fragment>lorem ipsum</React.Fragment>;
    props.footer = <React.Fragment key="dolor">dolor sit</React.Fragment>;
    const componentElement = renderComponent(<Modal {...props}>hello world</Modal>);
    expect(componentElement.screen.render()).toMatchSnapshot('element');
    componentElement.unmount();
  });
});
