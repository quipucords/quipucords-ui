import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup as PfFormGroup, ValidatedOptions } from '@patternfly/react-core';
import helpers from '../../common/helpers';

// FixMe: PF FormGroup fails to apply a label tag when role="radiogroup" is used
/**
 * FixMe: PF FormGroup requires hard coding a field ID even when single children are wrapped.
 * This is potentially a breaking change that requires more than a few updates to prior
 * implementations.
 */
/**
 * A wrapper for Patternfly FormGroup.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string|boolean} props.error
 * @param {React.ReactNode|boolean} props.errorMessage
 * @param {React.ReactNode} props.helperText
 * @param {string} props.id Field ID reference
 * @param {string} props.fieldId Field ID reference
 * @param {object} props.props
 * @returns {React.ReactNode}
 */
const FormGroup = ({ children, error, errorMessage, helperText, id, fieldId, ...props }) => {
  // Dynamically apply field id for single and multiple children when specific components are used
  let firstChildId;

  if (
    React.Children.count(children) === 1 &&
    (/(textArea|input|radio|checkbox|select)$/i.test(children?.type) ||
      /(textArea|input|radio|checkbox|select)$/i.test(children?.type?.name))
  ) {
    firstChildId = children?.props?.id || children?.props?.name;
  } else if (
    React.Children.count(children) > 1 &&
    (/(radio|checkbox)$/i.test(children?.[0]?.type) || /(radio|checkbox)$/i.test(children?.[0]?.type?.name))
  ) {
    firstChildId = children?.[0]?.props?.id || children?.[0]?.props?.name;
  }

  const setId = id || fieldId || firstChildId || helpers.generateId();

  return (
    <PfFormGroup
      fieldId={setId}
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
 *     helperText: React.ReactNode, fieldId: string}}
 */
FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  errorMessage: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  helperText: PropTypes.node,
  id: PropTypes.string,
  fieldId: PropTypes.string
};

/**
 * Default props
 *
 * @type {{errorMessage: null, id: null, error: null, helperText: null, fieldId: null}}
 */
FormGroup.defaultProps = {
  error: null,
  errorMessage: null,
  helperText: null,
  id: null,
  fieldId: null
};

export { FormGroup as default, FormGroup };
