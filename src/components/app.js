import React from 'react';
import PropTypes from 'prop-types';
import { connectRouter, reduxActions } from '../redux';
import { helpers } from '../common/helpers';
import I18n from './i18n/i18n';
import Authentication from './authentication/authentication';
import PageLayout from './pageLayout/pageLayout';
import Router from './router/router';
import ToastNotificationsList from './toastNotificationsList/toastNotificationsList';
import ConfirmationModal from './confirmationModal/confirmationModal';
import AboutModal from './aboutModal/aboutModal';
import AddSourceWizard from './addSourceWizard/addSourceWizard';
import CreateCredentialDialog from './createCredentialDialog/createCredentialDialog';
import CreateScanDialog from './createScanDialog/createScanDialog';
import MergeReportsDialog from './mergeReportsDialog/mergeReportsDialog';

class App extends React.Component {
  componentDidMount() {
    const { getLocale } = this.props;

    getLocale();
  }

  render() {
    const { locale } = this.props;

    return (
      <I18n locale={(locale && locale.value) || null}>
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
  }
}

App.propTypes = {
  getLocale: PropTypes.func,
  locale: PropTypes.shape({
    value: PropTypes.string
  })
};

App.defaultProps = {
  getLocale: helpers.noop,
  locale: {}
};

const mapDispatchToProps = dispatch => ({
  getLocale: () => dispatch(reduxActions.user.getLocale())
});

const mapStateToProps = state => ({ locale: state.user.session.locale });

const ConnectedApp = connectRouter(mapStateToProps, mapDispatchToProps)(App);

export { ConnectedApp as default, ConnectedApp, App };
