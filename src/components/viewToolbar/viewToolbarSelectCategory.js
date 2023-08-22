import React from 'react';
import PropTypes from 'prop-types';
import { useShallowCompareEffect } from 'react-use';
import { FilterIcon } from '@patternfly/react-icons';
import { reduxTypes, storeHooks } from '../../redux';
import { useView } from '../view/viewContext';
import { DropdownSelect } from '../dropdownSelect/dropdownSelect';
import { translate } from '../i18n/i18n';

/**
 * On select update category.
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

  return ({ value = null } = {}) => {
    dispatch([
      {
        type: reduxTypes.view.SET_FILTER,
        viewId,
        currentFilterCategory: value
      }
    ]);
  };
};

/**
 * Select available filter categories.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useSelector
 * @param {Function} props.useView
 * @returns {React.ReactNode}
 */
const ViewToolbarSelectCategory = ({
  t,
  useOnSelect: useAliasOnSelect,
  useSelector: useAliasSelector,
  useView: useAliasView
}) => {
  const { viewId, config } = useAliasView();
  const options = config?.toolbar?.filterFields;
  const onSelect = useAliasOnSelect(viewId);

  const selectedOption = useAliasSelector(({ view }) => view?.filters?.[viewId]?.currentFilterCategory);

  useShallowCompareEffect(() => {
    const initialCategory = options.find(({ selected }) => selected === true);

    if (!selectedOption && initialCategory?.value) {
      onSelect({ value: initialCategory?.value });
    }
  }, [options, onSelect, selectedOption]);

  return (
    <DropdownSelect
      ariaLabel={t('toolbar.label', { context: ['placeholder', 'filter'] })}
      placeholder={t('toolbar.label', { context: ['placeholder', 'filter'] })}
      options={options}
      onSelect={onSelect}
      selectedOptions={selectedOption}
      toggleIcon={<FilterIcon />}
      ouiaId="toolbar_select_category"
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useView: Function, useOnSelect: Function, t: Function, useSelector: Function}}
 */
ViewToolbarSelectCategory.propTypes = {
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useSelector: PropTypes.func,
  useView: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useView: Function, useOnSelect: Function, t: translate, useSelector: Function}}
 */
ViewToolbarSelectCategory.defaultProps = {
  t: translate,
  useOnSelect,
  useSelector: storeHooks.reactRedux.useSelector,
  useView
};

export { ViewToolbarSelectCategory as default, ViewToolbarSelectCategory, useOnSelect };
