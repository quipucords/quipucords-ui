import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@patternfly/react-core';
import { Radio } from '../form/radio';
import { connect, store, reduxSelectors, reduxTypes } from '../../redux';
import { FormGroup } from '../form/formGroup';
import { FormState } from '../formState/formState';
import apiTypes from '../../constants/apiConstants';

class AddSourceWizardStepOne extends React.Component {
  isStepValid = ({ values }) => {
    store.dispatch({
      type: reduxTypes.sources.VALID_SOURCE_WIZARD_STEPONE,
      source: {
        [apiTypes.API_SUBMIT_SOURCE_SOURCE_TYPE]: values.sourceType
      }
    });
  };

  render() {
    const { type } = this.props;

    return (
      <FormState validateOnMount setValues={{ sourceType: type }} validate={this.isStepValid}>
        {({ values, handleOnEvent, handleOnSubmit }) => (
          <Form isHorizontal onSubmit={handleOnSubmit}>
            <FormGroup role="radiogroup" isStack label="Select source type">
              <Radio
                name="sourceType"
                id="sourceType-network"
                value="network"
                checked={values.sourceType === 'network'}
                onChange={handleOnEvent}
                label="Network Range"
              />
              <Radio
                name="sourceType"
                id="sourceType-satellite"
                value="satellite"
                checked={values.sourceType === 'satellite'}
                onChange={handleOnEvent}
                label="Satellite"
              />
              <Radio
                name="sourceType"
                id="sourceType-vcenter"
                value="vcenter"
                checked={values.sourceType === 'vcenter'}
                onChange={handleOnEvent}
                label="vCenter Server"
              />
            </FormGroup>
          </Form>
        )}
      </FormState>
    );
  }
}

AddSourceWizardStepOne.propTypes = {
  type: PropTypes.string
};

AddSourceWizardStepOne.defaultProps = {
  type: 'network'
};

const makeMapStateToProps = () => {
  const mapSource = reduxSelectors.sources.makeSourceDetail();

  return (state, props) => ({
    ...mapSource(state, props)
  });
};

const ConnectedAddSourceWizardStepOne = connect(makeMapStateToProps)(AddSourceWizardStepOne);

export { ConnectedAddSourceWizardStepOne as default, ConnectedAddSourceWizardStepOne, AddSourceWizardStepOne };
