import React from 'react';
import PropTypes from 'prop-types';
import { detect } from 'detect-browser';
import { AboutModal as PfAboutModal, Button, Icon } from 'patternfly-react';
import { connectTranslate, reduxActions, reduxTypes, store } from '../../redux';
import helpers from '../../common/helpers';
import logoImg from '../../styles/images/logo.svg';
import titleImg from '../../styles/images/title.svg';
import logoImgBrand from '../../styles/images/logo-brand.svg';
import titleImgBrand from '../../styles/images/title-brand.svg';

class AboutModal extends React.Component {
  selectElement = React.createRef();

  state = {
    copied: null,
    timer: null
  };

  componentDidUpdate() {
    const { serverVersion, getStatus, show } = this.props;

    if (show && serverVersion === null) {
      getStatus();
    }
  }

  onCopy = () => {
    const { timer } = this.state;
    const selectElement = this.selectElement.current;
    const success = helpers.copyClipboard(selectElement.innerText);

    selectElement.focus();
    clearTimeout(timer);

    this.setState(
      {
        copied: success
      },
      () => this.resetStateTimer()
    );
  };

  onClose = () => {
    store.dispatch({
      type: reduxTypes.aboutModal.ABOUT_MODAL_HIDE
    });
  };

  resetStateTimer() {
    const { resetTimer } = this.props;
    const selectElement = this.selectElement.current;

    const timer = setTimeout(() => {
      selectElement.blur();

      this.setState({
        copied: null
      });
    }, resetTimer);

    this.setState({ timer });
  }

  render() {
    const { copied } = this.state;
    const { show, serverVersion, t, uiBrand, uiName, uiShortName, uiVersion, username } = this.props;
    const browser = detect();

    const props = {
      show,
      onHide: this.onClose,
      logo: logoImg,
      productTitle: <img src={titleImg} alt={uiName} />,
      altLogo: uiShortName
    };

    if (uiBrand) {
      props.logo = logoImgBrand;
      props.productTitle = <img src={titleImgBrand} alt={uiName} />;
      props.trademarkText = 'Copyright (c) 2019 - 2022 Red Hat Inc.';
    }

    return (
      <PfAboutModal {...props}>
        <div ref={this.selectElement} tabIndex={-1} aria-label="Application information copied" aria-live="polite">
          <PfAboutModal.Versions className="quipucords-about-modal-list">
            {username && (
              <PfAboutModal.VersionItem label={t('about-modal.username', 'Username')} versionText={username || ''} />
            )}
            {browser && (
              <PfAboutModal.VersionItem
                label={t('about-modal.browser-version', 'Browser Version')}
                versionText={`${browser.name} ${browser.version}`}
              />
            )}
            {browser && (
              <PfAboutModal.VersionItem
                label={t('about-modal.browser-os', 'Browser OS')}
                versionText={browser.os || ''}
              />
            )}
            {serverVersion && (
              <PfAboutModal.VersionItem
                label={t('about-modal.server-version', 'Server Version')}
                versionText={serverVersion}
              />
            )}
            {uiVersion && (
              <PfAboutModal.VersionItem label={t('about-modal.ui-version', 'UI Version')} versionText={uiVersion} />
            )}
          </PfAboutModal.Versions>
        </div>
        <div className="quipucords-about-modal-copy-footer">
          <Button
            onClick={this.onCopy}
            title="Copy application information"
            className="quipucords-about-modal-copy-button"
          >
            {copied && <Icon type="fa" name="check" />}
            {!copied && <Icon type="fa" name="paste" />}
          </Button>
        </div>
      </PfAboutModal>
    );
  }
}

AboutModal.propTypes = {
  getStatus: PropTypes.func,
  getUser: PropTypes.func,
  resetTimer: PropTypes.number,
  serverVersion: PropTypes.string,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func,
  uiBrand: PropTypes.bool,
  uiName: PropTypes.string,
  uiShortName: PropTypes.string,
  uiVersion: PropTypes.string,
  username: PropTypes.string
};

AboutModal.defaultProps = {
  getStatus: helpers.noop,
  getUser: helpers.noop,
  resetTimer: 3000,
  serverVersion: null,
  t: helpers.noopTranslate,
  uiBrand: helpers.UI_BRAND,
  uiName: helpers.UI_NAME,
  uiShortName: helpers.UI_SHORT_NAME,
  uiVersion: helpers.UI_VERSION,
  username: null
};

const mapDispatchToProps = dispatch => ({
  getStatus: () => dispatch(reduxActions.status.getStatus())
});

const mapStateToProps = state => ({
  serverVersion: state.status.serverVersion,
  show: state.aboutModal.show,
  username: state.user.session.username
});

const ConnectedAboutModal = connectTranslate(mapStateToProps, mapDispatchToProps)(AboutModal);

export { ConnectedAboutModal as default, ConnectedAboutModal, AboutModal };
