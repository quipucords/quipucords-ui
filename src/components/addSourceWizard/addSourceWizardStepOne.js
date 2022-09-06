import React from 'react';
import PropTypes from 'prop-types';
import { Form as Pf3Form, Radio } from 'patternfly-react';
import { Form } from '@patternfly/react-core';
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
            <FormGroup label="Select source type">
              <Pf3Form.FormGroup>
                <Radio
                  name="sourceType"
                  value="network"
                  checked={values.sourceType === 'network'}
                  onChange={handleOnEvent}
                >
                  Network Range
                </Radio>
                <Radio
                  name="sourceType"
                  value="satellite"
                  checked={values.sourceType === 'satellite'}
                  onChange={handleOnEvent}
                >
                  Satellite
                </Radio>
                <Radio
                  name="sourceType"
                  value="vcenter"
                  checked={values.sourceType === 'vcenter'}
                  onChange={handleOnEvent}
                >
                  vCenter Server
                </Radio>
              </Pf3Form.FormGroup>
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
