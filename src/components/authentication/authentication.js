import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, AlertVariant, Button, Bullseye, EmptyState } from '@patternfly/react-core';
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
      return children;
    }

    if (session.pending) {
      return (
        <Modal variant={ModalVariant.medium} backdrop={false} isOpen disableFocusTrap>
          <div className="spinner spinner-xl" />
          <Bullseye>{t('view.loading', { context: 'authentication' })}</Bullseye>
        </Modal>
      );
    }

    return (
      <PageLayout>
        <EmptyState className="quipucords-empty-state__alert">
          <Alert variant={AlertVariant.danger} title={t('view.error', { context: 'authentication' })}>
            {!session.authorized &&
              t(
                'view.error-message',
                {
                  context: 'authentication',
                  message: `${session.errorMessage.replace(/\.$/, '')}${session.errorMessage && '.'}` || undefined
                },
                [<Button isInline component="a" variant="link" href="/login" />]
              )}
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
