import React from 'react';
import { Modal as PfModal, ModalContent } from '@patternfly/react-core';
import { Modal } from '../modal';

describe('Modal Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await mountHookComponent(<Modal {...props}>lorem ipsum</Modal>);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow modifying specific and custom props', async () => {
    const props = {
      backdrop: false
    };

    const backdropComponent = await mountHookComponent(<Modal {...props}>lorem ipsum</Modal>);
    expect(backdropComponent.find(PfModal)).toMatchSnapshot('backdrop');

    props.backdrop = true;
    props['aria-label'] = 'dolor sit';

    const ariaLabelComponent = await mountHookComponent(<Modal {...props}>lorem ipsum</Modal>);
    expect(ariaLabelComponent.find(PfModal)).toMatchSnapshot('aria-label');
  });

  it('should allow custom headers and footers', async () => {
    // disableFocusTrap for testing only
    const props = {
      isOpen: true,
      disableFocusTrap: true
    };

    const component = await mountHookComponent(<Modal {...props}>hello world</Modal>);

    component.setProps({
      header: undefined,
      footer: undefined
    });

    expect(component.find(ModalContent).render()).toMatchSnapshot('undefined');

    component.setProps({
      header: 'lorem ipsum',
      footer: 'dolor sit'
    });

    expect(component.find(ModalContent).render()).toMatchSnapshot('string');

    component.setProps({
      header: () => 'lorem ipsum',
      footer: () => 'dolor sit'
    });

    expect(component.find(ModalContent).render()).toMatchSnapshot('function');

    component.setProps({
      header: [<React.Fragment key="lorem">lorem ipsum</React.Fragment>],
      footer: [<React.Fragment key="dolor">dolor sit</React.Fragment>]
    });

    expect(component.find(ModalContent).render()).toMatchSnapshot('list');

    component.setProps({
      header: <React.Fragment>lorem ipsum</React.Fragment>,
      footer: <React.Fragment key="dolor">dolor sit</React.Fragment>
    });

    expect(component.find(ModalContent).render()).toMatchSnapshot('element');
  });
});
