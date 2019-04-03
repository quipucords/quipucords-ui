import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Alert, EmptyState, Modal, VerticalNav } from 'patternfly-react';
import _startsWith from 'lodash/startsWith';
import { connect, reduxActions, reduxTypes, store } from '../redux';
import helpers from '../common/helpers';
import { Router, routes } from './router/router';
import AboutModal from './aboutModal/aboutModal';
import AddSourceWizard from './addSourceWizard/addSourceWizard';
import CreateCredentialDialog from './createCredentialDialog/createCredentialDialog';
import CreateScanDialog from './createScanDialog/createScanDialog';
import ToastNotificationsList from './toastNotificationsList/toastNotificationsList';
import ConfirmationModal from './confirmationModal/confirmationModal';
import MastheadOptions from './mastheadOptions/mastheadOptions';
import titleImg from '../styles/images/title.svg';
import titleImgBrand from '../styles/images/title-brand.svg';

class App extends React.Component {
  componentDidMount() {
    const { authorizeUser } = this.props;

    authorizeUser();
  }

  onLogout = () => {
    const { logoutUser } = this.props;

    logoutUser().finally(() => {
      window.location = '/logout';
    });
  };

  onNavigateTo = path => {
    const { history } = this.props;
    history.push(path);
  };

  onShowAbout = () => {
    store.dispatch({
      type: reduxTypes.aboutModal.ABOUT_MODAL_SHOW
    });
  };

  renderMenuItems() {
    const { location, menu } = this.props;
    const activeItem = menu.find(item => _startsWith(location.pathname, item.to));

    return menu.map(item => (
      <VerticalNav.Item
        key={item.to}
        title={item.title}
        iconClass={item.iconClass}
        active={item === activeItem || (!activeItem && item.redirect)}
        onClick={() => this.onNavigateTo(item.to)}
      />
    ));
  }

  renderMenuActions() {
    const { logoutUser } = this.props;

    return [
      <VerticalNav.Item key="about" className="collapsed-nav-item" title="About" onClick={() => this.onShowAbout()} />,
      <VerticalNav.Item key="logout" className="collapsed-nav-item" title="Logout" onClick={logoutUser} />
    ];
  }

  render() {
    const { session } = this.props;
    const productTitleImg = helpers.RH_BRAND ? titleImgBrand : titleImg;

    if (session.pending) {
      return (
        <Modal bsSize="lg" backdrop={false} show animation={false}>
          <Modal.Body>
            <div className="spinner spinner-xl" />
            <div className="text-center">Logging in...</div>
          </Modal.Body>
        </Modal>
      );
    }

    if (!session.authorized || session.error) {
      return (
        <div className="layout-pf layout-pf-fixed fadein">
          <nav className="navbar navbar-pf-vertical">
            <div className="navbar-header">
              <span className="navbar-brand">
                <img className="navbar-brand-name" src={productTitleImg} alt="" />
              </span>
            </div>
          </nav>
          <div>
            <EmptyState className="full-page-blank-slate">
              <Alert type="error">
                <span>
                  Login error: {session.errorMessage.replace(/\.$/, '')}
                  {session.errorMessage && '.'}
                  {!session.authorized && (
                    <React.Fragment>
                      Please <a href="/login">login</a> to continue.
                    </React.Fragment>
                  )}
                </span>
              </Alert>
            </EmptyState>
          </div>
        </div>
      );
    }

    return (
      <div className="layout-pf layout-pf-fixed fadein">
        <VerticalNav persistentSecondary={false}>
          <VerticalNav.Masthead>
            <VerticalNav.Brand titleImg={productTitleImg} />
            <MastheadOptions username={session.username} showAboutModal={this.onShowAbout} logoutUser={this.onLogout} />
          </VerticalNav.Masthead>
          {this.renderMenuItems()}
          {this.renderMenuActions()}
        </VerticalNav>
        <div className="container-pf-nav-pf-vertical">
          <Router />
          <ToastNotificationsList key="toastList" />
          <ConfirmationModal key="confirmationModal" />
          <AboutModal />
          <AddSourceWizard />
          <CreateCredentialDialog />
          <CreateScanDialog />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  authorizeUser: PropTypes.func,
  logoutUser: PropTypes.func,
  session: PropTypes.object,
  location: PropTypes.object,
  menu: PropTypes.array,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

App.defaultProps = {
  authorizeUser: helpers.noop,
  logoutUser: helpers.noop,
  menu: routes,
  session: {},
  location: {}
};

const mapDispatchToProps = dispatch => ({
  authorizeUser: () => dispatch(reduxActions.user.authorizeUser()),
  logoutUser: () => dispatch(reduxActions.user.logoutUser())
});

const mapStateToProps = state => ({
  session: state.user.session
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
