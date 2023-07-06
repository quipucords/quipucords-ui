import React from 'react';
import { AboutModal } from '../aboutModal';
import { helpers } from '../../../common';

describe('AboutModal Component', () => {
  it('should render a basic component with default props', () => {
    const props = {
      show: true,
      serverVersion: '0.0.0.0000000',
      username: 'lorem'
    };

    const component = renderComponent(<AboutModal {...props} />);
    expect(component.screen.render()).toMatchSnapshot('basic');
  });

  it('should hide the component', () => {
    const props = {
      show: true,
      serverVersion: '0.0.0.0000000',
      username: 'admin'
    };

    const component = renderComponent(<AboutModal {...props} />);
    const componentHidden = component.setProps({ show: false });
    expect(componentHidden.screen.render()).toMatchSnapshot('hidden modal');
  });

  it('should contain brand', () => {
    const props = {
      show: true,
      uiBrand: false,
      uiName: 'Lorem ipsum',
      uiShortName: 'Ipsum'
    };

    const component = renderComponent(<AboutModal {...props} />);
    expect(component.screen.render().querySelectorAll('img')).toMatchSnapshot('no brand');

    const componentBrand = component.setProps({ uiBrand: true });
    expect(componentBrand.screen.render().querySelectorAll('img')).toMatchSnapshot('brand');
  });

  it('should have a copy event that updates state', () => {
    const props = {
      show: true,
      serverVersion: '0.0.0.0000000',
      uiBrand: true,
      reset: 100
    };

    const mockCopyClipboard = jest.fn();
    const spy = jest.spyOn(helpers, 'copyClipboard').mockImplementation(mockCopyClipboard);
    const component = renderComponent(<AboutModal {...props} />);

    const input = component.screen.getByTitle('t(about-modal.copy-button)');
    component.fireEvent.click(input);

    expect(mockCopyClipboard).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });
});
