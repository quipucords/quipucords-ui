import React from 'react';
import PropTypes from 'prop-types';
import { DropdownSelect, ButtonVariant, SelectPosition } from '../dropdownSelect/dropdownSelect';
import { reduxTypes, storeHooks } from '../../redux';
import { translate } from '../i18n/i18n';

/**
 * Select field options.
 *
 * @type {{title: Function|string, value: string}[]}
 */
const fieldOptions = [
  { title: () => translate('form-dialog.label', { context: ['option', 'network', 'credential'] }), value: 'network' },
  {
    title: () => translate('form-dialog.label', { context: ['option', 'satellite', 'credential'] }),
    value: 'satellite'
  },
  { title: () => translate('form-dialog.label', { context: ['option', 'vcenter', 'credential'] }), value: 'vcenter' }
];

/**
 * On select create credential
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useOnSelect = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return ({ value = null }) => {
    dispatch([
      {
        type: reduxTypes.credentials.CREATE_CREDENTIAL_SHOW,
        credentialType: value
      }
    ]);
  };
};

/**
 * Display available credential types.
 *
 * @param {object} props
 * @param {Array} props.options
 * @param {string} props.placeholder
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {object} props.props
 * @returns {React.ReactNode}
 */
const AddCredentialType = ({ options, placeholder, t, useOnSelect: useAliasOnSelect, ...props } = {}) => {
  const onSelect = useAliasOnSelect();

  return (
    <DropdownSelect
      {...props}
      onSelect={onSelect}
      options={options}
      isDropdownButton
      placeholder={placeholder || t('form-dialog.label', { context: ['placeholder', 'add-credential'] })}
    />
  );
};

/**
 * Prop types
 *
 * @type {{useOnSelect: Function, options: Array, placeholder: string}}
 */
AddCredentialType.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  placeholder: PropTypes.string,
  t: PropTypes.func,
  useOnSelect: PropTypes.func
};

/**
 * Default props
 *
 * @type {{useOnSelect: Function, t: translate, options: {title: (Function|string), value: string}[],
 *     placeholder: null}}
 */
AddCredentialType.defaultProps = {
  options: fieldOptions,
  placeholder: null,
  t: translate,
  useOnSelect
};

export { AddCredentialType as default, AddCredentialType, fieldOptions, useOnSelect, ButtonVariant, SelectPosition };
