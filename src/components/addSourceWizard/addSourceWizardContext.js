import { useShallowCompareEffect } from 'react-use';
import { AlertVariant } from '@patternfly/react-core';
import { reduxTypes, storeHooks } from '../../redux';
import apiTypes from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/**
 * Return an updated source. Display relative toast messaging after wizard closes.
 *
 * @param {object} options
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelector
 * @returns {{}}
 */
const useGetAddSource = ({
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const selectorResponse = useAliasSelector(({ addSourceWizard }) => addSourceWizard, {});
  const dispatch = useAliasDispatch();
  const { edit, error, errorMessage, fulfilled, show, source } = selectorResponse;

  useShallowCompareEffect(() => {
    if (show === false && (fulfilled || error)) {
      dispatch({
        type: reduxTypes.toastNotifications.TOAST_ADD,
        alertType: (error && AlertVariant.danger) || AlertVariant.success,
        header: t('toast-notifications.title_add-source_hidden', {
          context: [error && 'error', edit && 'edit']
        }),
        message: t('toast-notifications.description_add-source_hidden', {
          context: [error && 'error', edit && 'edit'],
          message: errorMessage,
          name: source?.[apiTypes.API_SUBMIT_SOURCE_NAME]
        })
      });
    }
  }, [dispatch, edit, error, fulfilled, show, source, t]);

  return selectorResponse;
};

const context = {
  useGetAddSource
};

export { context as default, context, useGetAddSource };
