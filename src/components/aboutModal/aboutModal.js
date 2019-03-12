import React from 'react';
import PropTypes from 'prop-types';
import { detect } from 'detect-browser';
import { AboutModal as PfAboutModal } from 'patternfly-react';
import _get from 'lodash/get';
import helpers from '../../common/helpers';
import logo from '../../styles/images/logo.svg';
import productTitle from '../../styles/images/title.svg';
import rhLogo from '../../styles/images/logo-brand.svg';
import rhProductTitle from '../../styles/images/title-brand.svg';

const AboutModal = ({ user, status, shown, onClose }) => {
  const versionText = `${_get(status, 'api_version', 'unknown')} (Build: ${_get(status, 'build', 'unknown')})`;
  const browser = detect();

  const props = {
    show: shown,
    onHide: onClose,
    logo,
    productTitle: <img src={productTitle} alt="Entitlements Reporting" />,
    altLogo: 'ER'
  };

  if (helpers.RH_BRAND) {
    props.logo = rhLogo;
    props.productTitle = <img src={rhProductTitle} alt="Red Hat Entitlements Reporting" />;
    props.altLogo = 'RH ER';
    props.trademarkText = 'Copyright (c) 2018 Red Hat Inc.';
  }

  return (
    <PfAboutModal {...props}>
      <PfAboutModal.Versions>
        <PfAboutModal.VersionItem label="Version" versionText={versionText} />
        <PfAboutModal.VersionItem label="Username" versionText={_get(user, 'currentUser.username', '')} />
        <PfAboutModal.VersionItem
          label="Browser Version"
          versionText={`${_get(browser, 'name', '')} ${_get(browser, 'version', '')}`}
        />
        <PfAboutModal.VersionItem label="Browser OS" versionText={_get(browser, 'os', '')} />
      </PfAboutModal.Versions>
    </PfAboutModal>
  );
};

AboutModal.propTypes = {
  user: PropTypes.object,
  status: PropTypes.object,
  shown: PropTypes.bool,
  onClose: PropTypes.func
};

AboutModal.defaultProps = {
  user: {},
  status: {},
  shown: false,
  onClose: helpers.noop
};

export { AboutModal as default, AboutModal };
