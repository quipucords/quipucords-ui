import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { useMount } from 'react-use';
import { helpers } from '../../common';
import { EMPTY_CONTEXT, translate } from './i18nHelpers';

const I18n = ({ children, fallbackLng, loadPath, locale }) => {
  const [initialized, setInitialized] = useState(false);

  /**
   * Initialize i18next
   */
  useMount(async () => {
    try {
      await i18next
        .use(XHR)
        .use(initReactI18next)
        .init({
          backend: {
            loadPath
          },
          fallbackLng,
          lng: undefined,
          debug: !helpers.PROD_MODE,
          ns: ['default'],
          defaultNS: 'default',
          react: {
            useSuspense: false
          }
        });
    } catch (e) {
      //
    }

    setInitialized(true);
  });

  /**
   * Update locale.
   */
  useEffect(() => {
    if (initialized) {
      try {
        i18next.changeLanguage(locale);
      } catch (e) {
        //
      }
    }
  }, [initialized, locale]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (initialized && children) || <React.Fragment />;
};

I18n.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackLng: PropTypes.string,
  loadPath: PropTypes.string,
  locale: PropTypes.string
};

I18n.defaultProps = {
  fallbackLng: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
  loadPath: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_PATH,
  locale: null
};

export { I18n as default, I18n, EMPTY_CONTEXT, translate };
