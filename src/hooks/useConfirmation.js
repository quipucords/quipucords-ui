import { reduxTypes, storeHooks } from '../redux';
import { helpers } from '../common';

/**
 * Base confirmation behavior
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {(function({confirmButtonText: *, heading: *, title: *}=): void)|*}
 */
const useConfirmation = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return ({
    cancelButtonText,
    confirmButtonText,
    heading,
    onConfirm = helpers.noop,
    title,
    ...confirmationOptions
  } = {}) => {
    let updatedOnConfirm;

    if (typeof onConfirm === 'function') {
      updatedOnConfirm = () => {
        dispatch([
          {
            type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_HIDE
          }
        ]);

        onConfirm();
      };
    }

    dispatch({
      ...confirmationOptions,
      type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_SHOW,
      title,
      heading,
      confirmButtonText,
      cancelButtonText,
      onConfirm: updatedOnConfirm
    });
  };
};

export { useConfirmation as default, useConfirmation };
