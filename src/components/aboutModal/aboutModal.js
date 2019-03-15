import React from 'react';
import PropTypes from 'prop-types';
import { detect } from 'detect-browser';
import { AboutModal as PfAboutModal } from 'patternfly-react';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import helpers from '../../common/helpers';
import logoImg from '../../styles/images/logo.svg';
import titleImg from '../../styles/images/title.svg';
import logoImgBrand from '../../styles/images/logo-brand.svg';
import titleImgBrand from '../../styles/images/title-brand.svg';

class AboutModal extends React.Component {
  componentDidUpdate() {
    const { apiVersion, getStatus, show } = this.props;

    if (show && apiVersion === null) {
      getStatus();
    }
  }

  onClose = () => {
    store.dispatch({
      type: reduxTypes.aboutModal.ABOUT_MODAL_HIDE
    });
  };

  render() {
    const { apiVersion, brand, build, show, username } = this.props;
    const versionText = `${apiVersion || 'unknown'} (Build: ${build || 'unknown'})`;
    const browser = detect();

    const props = {
      logo: logoImg,
      productTitle: <img src={titleImg} alt="Entitlements Reporting" />,
      altLogo: 'ER'
    };

    if (brand) {
      props.logo = logoImgBrand;
      props.productTitle = <img src={titleImgBrand} alt="Red Hat Entitlements Reporting" />;
      props.altLogo = 'RH ER';
      props.trademarkText = 'Copyright (c) 2019 Red Hat Inc.';
    }

    return (
      <PfAboutModal show={show} onHide={this.onClose} {...props}>
        <PfAboutModal.Versions>
          <PfAboutModal.VersionItem label="Version" versionText={versionText} />
          {username && <PfAboutModal.VersionItem label="Username" versionText={username || ''} />}
          {browser && (
            <PfAboutModal.VersionItem label="Browser Version" versionText={`${browser.name} ${browser.version}`} />
          )}
          {browser && <PfAboutModal.VersionItem label="Browser OS" versionText={browser.os || ''} />}
        </PfAboutModal.Versions>
      </PfAboutModal>
    );
  }
}

AboutModal.propTypes = {
  apiVersion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  brand: PropTypes.bool,
  build: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  getStatus: PropTypes.func,
  getUser: PropTypes.func,
  show: PropTypes.bool.isRequired,
  username: PropTypes.string
};

AboutModal.defaultProps = {
  apiVersion: null,
  brand: helpers.RH_BRAND,
  build: null,
  getStatus: helpers.noop,
  getUser: helpers.noop,
  username: null
};

const mapDispatchToProps = dispatch => ({
  getStatus: () => dispatch(reduxActions.status.getStatus())
});

const mapStateToProps = state => ({
  apiVersion: state.status.apiVersion,
  build: state.status.build,
  show: state.aboutModal.show,
  username: state.user.session.username
});

const ConnectedAboutModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutModal);

export { ConnectedAboutModal as default, ConnectedAboutModal, AboutModal };
