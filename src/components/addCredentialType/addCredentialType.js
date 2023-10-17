import React from 'react';
import PropTypes from 'prop-types';
import { DropdownSelect, ButtonVariant, SelectPosition } from '../dropdownSelect/dropdownSelect';
import { useOnUpdateCredential } from '../createCredentialDialog/createCredentialDialogContext';
import { translate } from '../i18n/i18n';

/**
 * Select field options.
 *
 * @type {{title: Function|string, value: string}[]}
 */
const fieldOptions = [
  { title: () => translate('form-dialog.label', { context: ['option', 'network', 'credential'] }), value: 'network' },
  {
    title: () => translate('form-dialog.label', { context: ['option', 'openshift', 'credential'] }),
    value: 'openshift'
  },
  { title: () => translate('form-dialog.label', { context: ['option', 'acs', 'credential'] }), value: 'acs' },
  {
    title: () => translate('form-dialog.label', { context: ['option', 'satellite', 'credential'] }),
    value: 'satellite'
  },
  { title: () => translate('form-dialog.label', { context: ['option', 'vcenter', 'credential'] }), value: 'vcenter' },
  { title: () => translate('form-dialog.label', { context: ['option', 'ansible', 'credential'] }), value: 'ansible' }
];

/**
 * On select create credential
 *
 * @param {object} options
 * @param {Function} options.useOnUpdateCredential
 * @returns {Function}
 */
const useOnSelect = ({ useOnUpdateCredential: useAliasOnUpdateCredential = useOnUpdateCredential } = {}) => {
  const { onAdd } = useAliasOnUpdateCredential();
  return ({ value = null }) => onAdd(value);
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
      ouiaId="add_credential"
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
