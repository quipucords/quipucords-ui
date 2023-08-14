import React from 'react';
import PropTypes from 'prop-types';
import { DropdownSelect, SelectPosition } from '../dropdownSelect/dropdownSelect';
import { reduxTypes, storeHooks } from '../../redux';
import { useView } from '../view/viewContext';
import { API_QUERY_TYPES } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/*
 * Credential, and source, field options
 *
 * @type {{title: Function|string, value: string}[]}
 */
const credentialSourceTypeFieldOptions = [
  { title: () => translate('form-dialog.label', { context: ['option', 'network'] }), value: 'network' },
  { title: () => translate('form-dialog.label', { context: ['option', 'openshift'] }), value: 'openshift' },
  { title: () => translate('form-dialog.label', { context: ['option', 'satellite'] }), value: 'satellite' },
  { title: () => translate('form-dialog.label', { context: ['option', 'vcenter'] }), value: 'vcenter' }
];

/**
 * Available select options
 *
 * @type {{'[API_QUERY_TYPES.CREDENTIAL_TYPE]': Array, '[API_QUERY_TYPES.SOURCE_TYPE]': Array}}
 */
const SelectFilterVariantOptions = {
  [API_QUERY_TYPES.CREDENTIAL_TYPE]: credentialSourceTypeFieldOptions,
  [API_QUERY_TYPES.SOURCE_TYPE]: credentialSourceTypeFieldOptions
};

/**
 * Available select filters
 *
 * @type {{'[API_QUERY_TYPES.CREDENTIAL_TYPE]': string, '[API_QUERY_TYPES.SOURCE_TYPE]': string}}
 */
const SelectFilterVariant = {
  [API_QUERY_TYPES.CREDENTIAL_TYPE]: API_QUERY_TYPES.CREDENTIAL_TYPE,
  [API_QUERY_TYPES.SOURCE_TYPE]: API_QUERY_TYPES.SOURCE_TYPE
};

/**
 * On select
 *
 * @param {string} filter
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useView
 * @returns {Function}
 */
const useOnSelect = (
  filter,
  { useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch, useView: useAliasView = useView } = {}
) => {
  const { viewId } = useAliasView();
  const dispatch = useAliasDispatch();

  return ({ value = null }) => {
    dispatch([
      {
        type: reduxTypes.view.RESET_PAGE,
        viewId
      },
      {
        type: reduxTypes.view.SET_QUERY,
        viewId,
        filter,
        value
      }
    ]);
  };
};

/**
 * Display available select options.
 *
 * @param {object} props
 * @param {string} props.filter
 * @param {object} props.filterOptions
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useSelector
 * @param {string} props.useView
 * @returns {React.ReactNode}
 */
const ViewToolbarSelect = ({
  filter,
  filterOptions,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useSelector: useAliasSelector,
  useView: useAliasView
} = {}) => {
  const { viewId } = useAliasView();
  const selectedOption = useAliasSelector(({ view }) => view?.query?.[viewId]?.[filter]);
  const onSelect = useAliasOnSelect(filter);
  const updatedOptions = filterOptions?.[filter] || [];

  return (
    <DropdownSelect
      ariaLabel={t('toolbar.label', { context: ['placeholder', 'filter', filter] })}
      placeholder={t('toolbar.label', { context: ['placeholder', 'filter', filter] })}
      options={updatedOptions}
      onSelect={onSelect}
      position={position}
      selectedOptions={selectedOption}
      ouiaId={`toolbarSelect_${filter}`}
    />
  );
};

/**
 * Prop types
 *
 * @type {{filter: string, useView: Function, useOnSelect: Function, t: Function, useSelector: Function, position: string,
 *     filterOptions: object}}
 */
ViewToolbarSelect.propTypes = {
  filter: PropTypes.oneOf([...Object.values(SelectFilterVariant)]).isRequired,
  filterOptions: PropTypes.shape({
    [API_QUERY_TYPES.CREDENTIAL_TYPE]: PropTypes.array,
    [API_QUERY_TYPES.SOURCE_TYPE]: PropTypes.array
  }),
  position: PropTypes.oneOf([...Object.values(SelectPosition)]),
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useSelector: PropTypes.func,
  useView: PropTypes.func
};

/**
 * Default props
 *
 * @type {{useView: Function, useOnSelect: Function, t: translate, useSelector: Function, position: string,
 *     filterOptions: {'[API_QUERY_TYPES.CREDENTIAL_TYPE]': Array, '[API_QUERY_TYPES.SOURCE_TYPE]': Array}}}
 */
ViewToolbarSelect.defaultProps = {
  filterOptions: SelectFilterVariantOptions,
  position: SelectPosition.left,
  t: translate,
  useOnSelect,
  useSelector: storeHooks.reactRedux.useSelector,
  useView
};

export {
  ViewToolbarSelect as default,
  ViewToolbarSelect,
  SelectFilterVariant,
  SelectFilterVariantOptions,
  useOnSelect
};
