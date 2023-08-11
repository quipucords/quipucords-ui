import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from '@patternfly/react-core';
import _debounce from 'lodash/debounce';
import { reduxTypes, storeHooks } from '../../redux';
import { useView } from '../view/viewContext';
import { TextInput } from '../form/textInput';
import { API_QUERY_TYPES } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/**
 * Available text input filters
 *
 * @type {{'[API_QUERY_TYPES.SEARCH_SOURCES_NAME]': string, '[API_QUERY_TYPES.SEARCH_NAME]': string,
 *   '[API_QUERY_TYPES.SEARCH_CREDENTIALS_NAME]': string}}
 */
const TextInputFilterVariants = {
  [API_QUERY_TYPES.SEARCH_CREDENTIALS_NAME]: API_QUERY_TYPES.SEARCH_CREDENTIALS_NAME,
  [API_QUERY_TYPES.SEARCH_NAME]: API_QUERY_TYPES.SEARCH_NAME,
  [API_QUERY_TYPES.SEARCH_SOURCES_NAME]: API_QUERY_TYPES.SEARCH_SOURCES_NAME
};

/**
 * On submit input, dispatch type.
 *
 * @param {string} filter
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useView
 * @returns {Function}
 */
const useOnSubmit = (
  filter,
  { useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch, useView: useAliasView = useView } = {}
) => {
  const { viewId } = useAliasView();
  const dispatch = useAliasDispatch();

  return ({ value }) =>
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

/**
 * On clear input, dispatch type.
 *
 * @param {string} filter
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelector
 * @param {Function} options.useView
 * @returns {Function}
 */
const useOnClear = (
  filter,
  {
    useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
    useSelector: useAliasSelector = storeHooks.reactRedux.useSelector,
    useView: useAliasView = useView
  } = {}
) => {
  const { viewId } = useAliasView();
  const currentValue = useAliasSelector(({ view }) => view?.query?.[viewId]?.[filter]);
  const dispatch = useAliasDispatch();

  return () => {
    if (currentValue === '' || !currentValue) {
      return;
    }

    dispatch([
      {
        type: reduxTypes.view.RESET_PAGE,
        viewId
      },
      {
        type: reduxTypes.view.SET_QUERY,
        viewId,
        filter,
        value: ''
      }
    ]);
  };
};

/**
 * Display an input field for filtering results.
 *
 * @fires onKeyUp
 * @param {object} props
 * @param {number} props.debounceTimer
 * @param {string} props.filter
 * @param {Function} props.t
 * @param {Function} props.useOnClear
 * @param {Function} props.useOnSubmit
 * @param {Function} props.useSelector
 * @param {Function} props.useView
 * @returns {React.ReactNode}
 */
const ViewToolbarTextInput = ({
  debounceTimer,
  filter,
  t,
  useOnClear: useAliasOnClear,
  useOnSubmit: useAliasOnSubmit,
  useSelector: useAliasSelector,
  useView: useAliasView
}) => {
  const { viewId } = useAliasView();
  const currentValue = useAliasSelector(({ view }) => view?.query?.[viewId]?.[filter]);
  const onSubmit = useAliasOnSubmit(filter);
  const onClear = useAliasOnClear(filter);

  /**
   * Set up submit debounce event to allow for bypass.
   */
  const debounced = _debounce(onSubmit, debounceTimer);

  /**
   * On enter submit value, on type submit value, and on esc ignore (clear value at component level).
   *
   * @event onKeyUp
   * @param {object} event
   */
  const onKeyUp = event => {
    switch (event.keyCode) {
      case 13:
        onSubmit(event);
        break;
      case 27:
        break;
      default:
        debounced(event);
        break;
    }
  };

  return (
    <InputGroup>
      <TextInput
        aria-label={t('toolbar.label', { context: ['placeholder', 'filter', filter] })}
        maxLength={255}
        onClear={onClear}
        onKeyUp={onKeyUp}
        value={currentValue}
        placeholder={t('toolbar.label', { context: ['placeholder', 'filter', filter] })}
        data-test="toolbarSearchName"
        ouiaId="toolbar_search_name"
      />
    </InputGroup>
  );
};

/**
 * Prop types
 *
 * @type {{filter: string, useOnSubmit: Function, useView: Function, t: Function, useSelector: Function, debounceTimer: number,
 *     useOnClear: Function}}
 */
ViewToolbarTextInput.propTypes = {
  debounceTimer: PropTypes.number,
  filter: PropTypes.oneOf([...Object.values(TextInputFilterVariants)]).isRequired,
  t: PropTypes.func,
  useOnClear: PropTypes.func,
  useOnSubmit: PropTypes.func,
  useSelector: PropTypes.func,
  useView: PropTypes.func
};

/**
 * Default props
 *
 * @type {{useOnSubmit: Function, useView: Function, t: translate, useSelector: Function, debounceTimer: number,
 *     useOnClear: Function}}
 */
ViewToolbarTextInput.defaultProps = {
  debounceTimer: 800,
  t: translate,
  useOnClear,
  useOnSubmit,
  useSelector: storeHooks.reactRedux.useSelector,
  useView
};

export { ViewToolbarTextInput as default, ViewToolbarTextInput, TextInputFilterVariants, useOnClear, useOnSubmit };
