import { reduxTypes, storeHooks } from '../../redux';
import { useView } from '../view/viewContext';

/**
 * Clear a specific toolbar category.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useView
 * @returns {Function}
 */

const useToolbarFieldClear = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useView: useAliasView = useView
} = {}) => {
  const { viewId } = useAliasView();
  const dispatch = useAliasDispatch();

  return filter =>
    dispatch([
      {
        type: reduxTypes.view.RESET_PAGE,
        viewId
      },
      {
        type: reduxTypes.view.SET_QUERY,
        viewId,
        filter,
        value: undefined
      }
    ]);
};

/**
 * Clear all available toolbar categories.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useView
 * @returns {Function}
 */
const useToolbarFieldClearAll = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useView: useAliasView = useView
} = {}) => {
  const dispatch = useAliasDispatch();
  const { viewId, config } = useAliasView();
  const options = config?.toolbar?.filterFields;

  return () => {
    const resetFilters = [
      {
        type: reduxTypes.view.RESET_PAGE,
        viewId
      }
    ];

    options.forEach(({ value: filter }) => {
      resetFilters.push({
        type: reduxTypes.view.SET_QUERY,
        viewId,
        filter,
        value: undefined
      });
    });

    dispatch(resetFilters);
  };
};

const context = {
  useToolbarFieldClear,
  useToolbarFieldClearAll
};

export { context as default, context, useToolbarFieldClear, useToolbarFieldClearAll };
