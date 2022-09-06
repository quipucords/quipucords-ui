import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup as PfFormGroup } from '@patternfly/react-core';
import helpers from '../../common/helpers';

const FormGroup = ({ children, error, errorMessage, helperText, id, label, ...props }) => {
  const setId = id || helpers.generateId();

  return (
    <PfFormGroup
      id={setId}
      validated={error ? 'error' : null}
      // FixMe: Applies consistent behavior to helperText regardless of it being an element or string
      helperText={helperText && <div className="pf-c-form__helper-text">{helperText}</div>}
      helperTextInvalid={
        (error && typeof errorMessage === 'string' && errorMessage) ||
        (React.isValidElement(errorMessage) && errorMessage) ||
        (errorMessage && 'Error') ||
        ''
      }
      label={label}
      {...props}
    >
      {children}
    </PfFormGroup>
  );
};

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  errorMessage: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  helperText: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.node
};

FormGroup.defaultProps = {
  error: null,
  errorMessage: null,
  helperText: null,
  id: null,
  label: null
};

export { FormGroup as default, FormGroup };
