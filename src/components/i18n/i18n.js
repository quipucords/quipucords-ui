import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

const i18nInit = lng =>
  i18n
    .use(XHR)
    .use(initReactI18next)
    .init({
      backend: {
        loadPath: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_PATH
      },
      fallbackLng: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
      lng,
      debug: process.env.REACT_APP_ENV !== 'production',
      ns: ['default'],
      defaultNS: 'default',
      react: {
        useSuspense: false
      }
    });

/**
 * FixMe: the "I18nextProvider" appears to have timing issues, reevaluate this alt implementation
 */
const I18n = ({ children, locale }) => {
  i18nInit(locale);
  return <React.Fragment>{children}</React.Fragment>;
};

I18n.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.string
};

I18n.defaultProps = {
  locale: null
};

export { I18n as default, i18nInit, I18n };
