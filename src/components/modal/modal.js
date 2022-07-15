import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMount, useUnmount } from 'react-use';
import { Modal as PfModal, ModalProps, ModalVariant } from '@patternfly/react-core';
import classNames from 'classnames';
import { translate } from '../i18n/i18n';

/**
 * Wrapper for adjusting PF Modal styling.
 *
 * @param {object} props
 * @param {string} props.'aria-label'
 * @param {boolean} props.backdrop
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @param {React.ReactNode|Function} props.header
 * @param {React.ReactNode|Function} props.footer
 * @param {boolean} props.isContentOnly
 * @param {string} props.position
 * @param {string} props.positionOffset
 * @param {boolean} props.showClose
 * @param {Function} props.t
 * @param {string} props.variant
 * @param {ModalProps} props.props
 * @returns {React.ReactNode}
 */
const Modal = ({
  'aria-label': ariaLabel,
  backdrop,
  children,
  className,
  header,
  footer,
  isContentOnly,
  position,
  positionOffset,
  showClose,
  t,
  variant,
  ...props
}) => {
  const [element, setElement] = useState();
  const updatedProps = { ...props };
  const cssClassName = classNames(
    `quipucords-modal`,
    { 'quipucords-modal__hide-backdrop': backdrop === false },
    { 'quipucords-modal__rcue-width': !variant },
    className
  );

  useMount(() => {
    const domElement = document.createElement('div');
    document.body.appendChild(domElement);
    setElement(domElement);
  });

  useUnmount(() => {
    element?.remove();
  });

  if (!element) {
    return null;
  }

  element.className = cssClassName;

  if (header) {
    updatedProps.header = (typeof header === 'function' && header()) || header;
  }

  if (footer) {
    updatedProps.footer = (typeof footer === 'function' && footer()) || footer;
  }

  return (
    <PfModal
      appendTo={element}
      aria-label={ariaLabel || t('modal.aria-label-default')}
      hasNoBodyWrapper={isContentOnly}
      position={position}
      positionOffset={positionOffset}
      showClose={showClose}
      variant={variant}
      {...updatedProps}
    >
      {(React.isValidElement(children) && children) || <div>{children || ''}</div>}
    </PfModal>
  );
};

/**
 * Prop types
 *
 * @type {{backdrop: boolean, showClose: boolean, t: Function, children: React.ReactNode,
 *     footer: React.ReactNode|Function, variant: string, header: React.ReactNode|Function,
 *     className: string|object, isContentOnly: boolean, position: string, positionOffset: string,
 *     'aria-label': string}}
 */
Modal.propTypes = {
  'aria-label': PropTypes.string,
  backdrop: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  footer: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  header: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  isContentOnly: PropTypes.bool,
  position: PropTypes.oneOf(['top', null]),
  positionOffset: PropTypes.string,
  showClose: PropTypes.bool,
  t: PropTypes.func,
  variant: PropTypes.oneOf([...Object.values(ModalVariant)])
};

/**
 * Default props
 *
 * @type {{backdrop: boolean, showClose: boolean, t: translate, footer: null, variant: null, header: null,
 *     className: null, isContentOnly: boolean, position: string, positionOffset: string, 'aria-label': null}}
 */
Modal.defaultProps = {
  'aria-label': null,
  backdrop: true,
  className: null,
  footer: null,
  header: null,
  isContentOnly: false,
  position: 'top',
  positionOffset: '5%',
  showClose: false,
  t: translate,
  variant: null
};

export { Modal as default, Modal, ModalVariant };
