import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, EmptyState } from 'patternfly-react';
import { Modal, ModalVariant } from '../modal/modal';
import { reduxActions } from '../../redux';
import helpers from '../../common/helpers';
import { PageLayout } from '../pageLayout/pageLayout';

class Authentication extends React.Component {
  componentDidMount() {
    const { session, authorizeUser } = this.props;

    if (!session.authorized) {
      authorizeUser();
    }
  }

  render() {
    const { children, session } = this.props;

    if (session.authorized) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    if (session.pending) {
      return (
        <Modal variant={ModalVariant.medium} backdrop={false} isOpen disableFocusTrap>
          <div className="spinner spinner-xl" />
          <div className="text-center">Logging in...</div>
        </Modal>
      );
    }

    return (
      <PageLayout>
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
      </PageLayout>
    );
  }
}

Authentication.propTypes = {
  authorizeUser: PropTypes.func,
  children: PropTypes.node.isRequired,
  session: PropTypes.shape({
    authorized: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    pending: PropTypes.bool
  })
};

Authentication.defaultProps = {
  authorizeUser: helpers.noop,
  session: {
    authorized: false,
    error: false,
    errorMessage: '',
    pending: false
  }
};

const mapDispatchToProps = dispatch => ({
  authorizeUser: () => dispatch(reduxActions.user.authorizeUser())
});

const mapStateToProps = state => ({ session: state.user.session });

const ConnectedAuthentication = connect(mapStateToProps, mapDispatchToProps)(Authentication);

export { ConnectedAuthentication as default, ConnectedAuthentication, Authentication };
