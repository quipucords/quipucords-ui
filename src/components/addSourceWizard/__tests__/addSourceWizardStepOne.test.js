import React from 'react';
import { AddSourceWizardStepOne } from '../addSourceWizardStepOne';

describe('AddSourceWizardStepOne Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = renderComponent(<AddSourceWizardStepOne {...props} />);
    expect(component).toMatchSnapshot('basic');
  });
});
