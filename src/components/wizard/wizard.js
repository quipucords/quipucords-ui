import React from 'react';
import PropTypes from 'prop-types';
import { ModalVariant } from '@patternfly/react-core';
import { Wizard as PfWizard } from '@patternfly/react-core/deprecated';
import classNames from 'classnames';
import { Modal } from '../modal/modal';

/**
 * FixMe: PF Wizard no longer allows "appendTo"
 * activated here, https://github.com/patternfly/patternfly-react/pull/3102
 * and then removed with PF-React PR#4255
 */
/**
 * A PF Wizard wrapper
 *
 * @param {object} props
 * @param {string|object} props.className
 * @param {boolean} props.isForm
 * @param {boolean} props.isNavHidden
 * @param {boolean} props.isOpen
 * @param {Array} props.steps
 * @param {string} props.variant
 * @param {object} props.props
 * @returns {React.ReactNode}
 */
const Wizard = ({ className, isForm, isNavHidden, isOpen, steps, variant, ...props }) => {
  const cssClassName = classNames(
    'quipucords-wizard',
    { 'quipucords-wizard__hide-nav': isNavHidden === true },
    { 'quipucords-wizard__hide-nav-last': isForm === true },
    className
  );

  return (
    <Modal className="quipucords-modal__wizard" variant={variant} isOpen={isOpen} isContentOnly>
      <PfWizard className={cssClassName} steps={steps} {...props} />
    </Modal>
  );
};

/**
 * Prop types
 *
 * @type {{isOpen: boolean, variant: string, className: string|object, isNavHidden: boolean, isForm: boolean,
 *     steps: Array}}
 */
Wizard.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isForm: PropTypes.bool,
  isNavHidden: PropTypes.bool,
  isOpen: PropTypes.bool,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      component: PropTypes.node.isRequired,
      canJumpTo: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
      enableNext: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
      hideBackButton: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
      hideCancelButton: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
      name: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      nextButtonText: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
    })
  ),
  variant: PropTypes.oneOf([...Object.values(ModalVariant)])
};

/**
 * Default props
 *
 * @type {{isOpen: boolean, variant: null, className: null, isNavHidden: boolean, isForm: boolean, steps: *[]}}
 */
Wizard.defaultProps = {
  className: null,
  isForm: false,
  isNavHidden: false,
  isOpen: false,
  steps: [],
  variant: null
};

export { Wizard as default, Wizard };
