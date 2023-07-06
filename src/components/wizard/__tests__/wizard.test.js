import React from 'react';
import { Wizard } from '../wizard';

describe('Wizard Component', () => {
  it('should render a basic component', async () => {
    const props = {
      isOpen: true,
      steps: [
        {
          id: 1,
          name: 'Lorem',
          component: 'lorem'
        },
        {
          id: 2,
          name: 'Ipsum',
          component: 'ipsum'
        },
        {
          id: 3,
          name: 'Dolor',
          component: <React.Fragment>dolor</React.Fragment>
        }
      ]
    };

    const component = renderComponent(<Wizard {...props} />);
    expect(component.screen.render()).toMatchSnapshot('basic');
  });

  it('should allow modifying specific and custom props', () => {
    const props = {
      isOpen: true,
      isForm: true,
      steps: [
        {
          id: 1,
          name: 'Lorem',
          component: 'lorem'
        }
      ]
    };

    const formComponent = renderComponent(<Wizard {...props} />);
    expect(formComponent.screen.render().querySelector('.quipucords-wizard').classList).toMatchSnapshot('isForm');
    formComponent.unmount();

    props.isForm = false;
    props.isNavHidden = true;

    const navHiddenComponent = renderComponent(<Wizard {...props} />);
    expect(navHiddenComponent.screen.render().querySelector('.quipucords-wizard').classList).toMatchSnapshot(
      'isNavHidden'
    );
    navHiddenComponent.unmount();
  });
});
