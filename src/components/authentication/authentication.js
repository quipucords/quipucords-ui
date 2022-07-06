import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Button, Bullseye } from '@patternfly/react-core';
import { EmptyState } from 'patternfly-react';
import { Modal, ModalVariant } from '../modal/modal';
import { reduxActions } from '../../redux';
import helpers from '../../common/helpers';
import { PageLayout } from '../pageLayout/pageLayout';
import { translate } from '../i18n/i18n';

/**
 * Authentication, determine if a user is authorized.
 */
class Authentication extends React.Component {
  componentDidMount() {
    const { session, authorizeUser } = this.props;

    if (!session.authorized) {
      authorizeUser();
    }
  }

  render() {
    const { children, session, t } = this.props;

    if (session.authorized) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    if (session.pending) {
      return (
        <Modal variant={ModalVariant.medium} backdrop={false} isOpen disableFocusTrap>
          <div className="spinner spinner-xl" />
          <Bullseye>{t('view.login', { context: 'pending' })}</Bullseye>
        </Modal>
      );
    }

    return (
      <PageLayout>
        <EmptyState className="full-page-blank-slate">
          <Alert variant="danger" title={t('view.login', { context: 'error' })}>
            {session.errorMessage.replace(/\.$/, '')}
            {session.errorMessage && '.'}
            {!session.authorized &&
              t('view.login-message', { context: 'error' }, [
                <Button isInline component="a" variant="link" href="/login" />
              ])}
          </Alert>
        </EmptyState>
      </PageLayout>
    );
  }
}

/**
 * Prop types
 *
 * @type {{authorizeUser: Function, t: Function, children: React.ReactNode, session: object}}
 */
Authentication.propTypes = {
  authorizeUser: PropTypes.func,
  children: PropTypes.node.isRequired,
  session: PropTypes.shape({
    authorized: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    pending: PropTypes.bool
  }),
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{authorizeUser: Function, t: translate, session: {authorized: boolean, pending: boolean,
 *     errorMessage: string, error: boolean}}}
 */
Authentication.defaultProps = {
  authorizeUser: helpers.noop,
  session: {
    authorized: false,
    error: false,
    errorMessage: '',
    pending: false
  },
  t: translate
};

const mapDispatchToProps = dispatch => ({
  authorizeUser: () => dispatch(reduxActions.user.authorizeUser())
});

const mapStateToProps = state => ({ session: state.user.session });

const ConnectedAuthentication = connect(mapStateToProps, mapDispatchToProps)(Authentication);

export { ConnectedAuthentication as default, ConnectedAuthentication, Authentication };
