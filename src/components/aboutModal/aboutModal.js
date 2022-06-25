import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { detect } from 'detect-browser';
import {
  AboutModal as PfAboutModal,
  Button,
  ButtonVariant,
  TextContent,
  TextList,
  TextListItem
} from '@patternfly/react-core';
import { CheckIcon, PasteIcon } from '@patternfly/react-icons';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import logoImg from '../../styles/images/logo.svg';
import titleImg from '../../styles/images/title.svg';
import logoImgBrand from '../../styles/images/logo-brand.svg';
import titleImgBrand from '../../styles/images/title-brand.svg';

/**
 * About modal, display application information.
 */
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
    const currentYear = moment.utc(helpers.getCurrentDate()).format('YYYY');

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
      props.trademarkText = t('about-modal.copyright', { year: currentYear });
    }

    return (
      <PfAboutModal
        className="quipucords-about-modal"
        isOpen={props.show}
        onClose={props.onHide}
        productName={props.productTitle}
        brandImageSrc={props.logo}
        brandImageAlt={props.altLogo}
        trademark={props.trademarkText}
      >
        <div
          ref={this.selectElement}
          className="quipucords-about-modal-list"
          tabIndex={-1}
          aria-label={t('about-modal.copy-confirmation')}
          aria-live="polite"
        >
          <TextContent>
            <TextList component="dl">
              {username && (
                <React.Fragment>
                  <TextListItem component="dt">{t('about-modal.username')}</TextListItem>
                  <TextListItem component="dd">{username || ''}</TextListItem>
                </React.Fragment>
              )}
              {browser && (
                <React.Fragment>
                  <TextListItem component="dt">{t('about-modal.browser-version')}</TextListItem>
                  <TextListItem component="dd">{`${browser.name} ${browser.version}`}</TextListItem>
                </React.Fragment>
              )}
              {browser && (
                <React.Fragment>
                  <TextListItem component="dt">{t('about-modal.browser-os')}</TextListItem>
                  <TextListItem component="dd">{browser.os || ''}</TextListItem>
                </React.Fragment>
              )}
              {serverVersion && (
                <React.Fragment>
                  <TextListItem component="dt">{t('about-modal.server-version')}</TextListItem>
                  <TextListItem component="dd">{serverVersion}</TextListItem>
                </React.Fragment>
              )}
              {uiVersion && (
                <React.Fragment>
                  <TextListItem component="dt">{t('about-modal.ui-version')}</TextListItem>
                  <TextListItem component="dd">{uiVersion}</TextListItem>
                </React.Fragment>
              )}
            </TextList>
          </TextContent>
        </div>
        <div className="quipucords-about-modal-copy-footer">
          <Button
            onClick={this.onCopy}
            title={t('about-modal.copy-button')}
            className="quipucords-about-modal-copy-button"
            variant={ButtonVariant.tertiary}
          >
            {(copied && <CheckIcon />) || <PasteIcon />}
          </Button>
        </div>
      </PfAboutModal>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{uiShortName: string, serverVersion: string, t: Function, resetTimer: number, show: boolean,
 *     uiVersion: string, getStatus: Function, uiName: string, uiBrand: boolean, username: string}}
 */
AboutModal.propTypes = {
  getStatus: PropTypes.func,
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

/**
 * Default props.
 *
 * @type {{uiShortName: string, serverVersion: null, t: translate, resetTimer: number, uiVersion: string,
 *     getStatus: Function, uiName: string, uiBrand: boolean, username: null}}
 */
AboutModal.defaultProps = {
  getStatus: helpers.noop,
  resetTimer: 3000,
  serverVersion: null,
  t: translate,
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

const ConnectedAboutModal = connect(mapStateToProps, mapDispatchToProps)(AboutModal);

export { ConnectedAboutModal as default, ConnectedAboutModal, AboutModal };
