import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup as PfFormGroup, ValidatedOptions } from '@patternfly/react-core';
import helpers from '../../common/helpers';

/**
 * A wrapper for Patternfly FormGroup.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string|boolean} props.error
 * @param {React.ReactNode|boolean} props.errorMessage
 * @param {React.ReactNode} props.helperText
 * @param {string} props.id
 * @param {object} props.props
 * @returns {React.ReactNode}
 */
const FormGroup = ({ children, error, errorMessage, helperText, id, ...props }) => {
  const setId = id || helpers.generateId();

  return (
    <PfFormGroup
      id={setId}
      validated={error ? ValidatedOptions.error : ValidatedOptions.default}
      // FixMe: Applies consistent behavior to helperText regardless of it being an element or string
      helperText={helperText && <div className="pf-c-form__helper-text">{helperText}</div>}
      helperTextInvalid={
        (error && typeof errorMessage === 'string' && errorMessage) ||
        (React.isValidElement(errorMessage) && errorMessage) ||
        (errorMessage && 'Error') ||
        ''
      }
      {...props}
    >
      {children}
    </PfFormGroup>
  );
};

/**
 * Prop types
 *
 * @type {{children: React.ReactNode, errorMessage: React.ReactNode|boolean, id: string, error: string|boolean,
 *     helperText: React.ReactNode}}
 */
FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  errorMessage: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  helperText: PropTypes.node,
  id: PropTypes.string
};

/**
 * Default props
 *
 * @type {{errorMessage: null, id: null, error: null, helperText: null}}
 */
FormGroup.defaultProps = {
  error: null,
  errorMessage: null,
  helperText: null,
  id: null
};

export { FormGroup as default, FormGroup };
