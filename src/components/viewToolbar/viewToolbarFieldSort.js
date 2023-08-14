import React from 'react';
import PropTypes from 'prop-types';
import { reduxTypes, storeHooks } from '../../redux';
import { useView } from '../view/viewContext';
import { ViewToolbarFieldSortButton } from './viewToolbarFieldSortButton';
import { DropdownSelect } from '../dropdownSelect/dropdownSelect';
import { API_QUERY_TYPES } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/**
 * On select category for sorting.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useView
 * @returns {Function}
 */
const useOnSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useView: useAliasView = useView
} = {}) => {
  const { viewId } = useAliasView();
  const dispatch = useAliasDispatch();

  return ({ value }) =>
    dispatch([
      {
        type: reduxTypes.view.SET_QUERY,
        viewId,
        filter: API_QUERY_TYPES.ORDERING,
        value
      }
    ]);
};

/**
 * Toolbar sort button wrapper.
 *
 * @fires onSelectUpdated
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useView
 * @returns {React.ReactNode}
 */
const ViewToolbarFieldSort = ({ t, useOnSelect: useAliasOnSelect, useView: useAliasView }) => {
  const onSelect = useAliasOnSelect();
  const { query, config } = useAliasView();
  const selectedOption = query?.[API_QUERY_TYPES.ORDERING];
  const { sortFields } = config?.toolbar || {};

  /**
   * Intercept selected value to apply default dsc/asc
   *
   * @event onSelectUpdated
   * @param {object} event
   * @param {*} event.value
   * @param {object} event.selected
   */
  const onSelectUpdated = ({ value, selected }) => {
    let updatedValue = value;
    if (selected?.isDefaultDescending && selectedOption !== value) {
      updatedValue = `-${value}`;
    }

    onSelect({ value: updatedValue });
  };

  return (
    <React.Fragment>
      <DropdownSelect
        placeholder={t('toolbar.label', { context: ['option', 'sort'] })}
        options={sortFields}
        onSelect={onSelectUpdated}
        selectedOptions={selectedOption?.replace(/^-/, '')}
        ouiaId="toolbar_sort_type"
      />
      <ViewToolbarFieldSortButton />
    </React.Fragment>
  );
};

/**
 * Prop types
 *
 * @type {{useView: Function, t: Function, useSelector: Function}}
 */
ViewToolbarFieldSort.propTypes = {
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useView: PropTypes.func
};

/**
 * Default props
 *
 * @type {{useOnSelect: Function, t: Function, useView: Function}}
 */
ViewToolbarFieldSort.defaultProps = {
  t: translate,
  useOnSelect,
  useView
};

export { ViewToolbarFieldSort as default, ViewToolbarFieldSort, useOnSelect };
