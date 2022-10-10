import React from 'react';
import PropTypes from 'prop-types';
import { useMount } from 'react-use';
import { reduxActions, storeHooks } from '../redux';
import { I18n } from './i18n/i18n';
import Authentication from './authentication/authentication';
import PageLayout from './pageLayout/pageLayout';
import { Router } from './router/router';
import ToastNotificationsList from './toastNotificationsList/toastNotificationsList';
import ConfirmationModal from './confirmationModal/confirmationModal';
import AboutModal from './aboutModal/aboutModal';
import AddSourceWizard from './addSourceWizard/addSourceWizard';
import CreateCredentialDialog from './createCredentialDialog/createCredentialDialog';
import CreateScanDialog from './createScanDialog/createScanDialog';
import MergeReportsDialog from './mergeReportsDialog/mergeReportsDialog';

/**
 * Organize components into an app
 *
 * @param {object} props
 * @param {Function} props.getLocale
 * @param {Function} props.useDispatch
 * @param {Function} props.useSelector
 * @returns {React.ReactNode}
 */
const App = ({ getLocale, useDispatch: useAliasDispatch, useSelector: useAliasSelector }) => {
  const dispatch = useAliasDispatch();
  const locale = useAliasSelector(({ user }) => user?.session?.locale?.value, null);

  useMount(() => {
    dispatch(getLocale());
  });

  return (
    <I18n locale={locale}>
      <Authentication>
        <PageLayout>
          <Router />
          <ToastNotificationsList />
          <ConfirmationModal />
          <AboutModal />
          <AddSourceWizard />
          <CreateCredentialDialog />
          <CreateScanDialog />
          <MergeReportsDialog />
        </PageLayout>
      </Authentication>
    </I18n>
  );
};

/**
 * Prop types
 *
 * @type {{useSelector: Function, useDispatch: Function, getLocale: Function}}
 */
App.propTypes = {
  getLocale: PropTypes.func,
  useDispatch: PropTypes.func,
  useSelector: PropTypes.func
};

/**
 * Prop types
 *
 * @type {{useSelector: Function, useDispatch: Function, getLocale: Function}}
 */
App.defaultProps = {
  getLocale: reduxActions.user.getLocale,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useSelector: storeHooks.reactRedux.useSelector
};

export { App as default, App };
