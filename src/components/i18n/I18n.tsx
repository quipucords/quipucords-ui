/**
 * A React component wrapper for initializing and providing an i18n context for internationalizing an application.
 * Utilizes `i18next` and `i18next-xhr-backend` for loading translations and dynamically changing languages based
 * on user preference or environment settings. Supports fallback languages and custom loading paths for language files.
 * @module I18n
 */
import React, { useState, useEffect } from 'react';
import { initReactI18next } from 'react-i18next';
import { use as i18nextUse, changeLanguage } from 'i18next';
import XHR from 'i18next-xhr-backend';
import { helpers } from '../../helpers';
import { EMPTY_CONTEXT, translate } from './i18nHelpers';

interface I18nProps {
  children: React.ReactNode;
  fallbackLng?: string;
  loadPath?: string;
  locale?: string | null;
}

const I18n: React.FunctionComponent<I18nProps> = ({
  fallbackLng = process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
  loadPath = process.env.REACT_APP_CONFIG_SERVICE_LOCALES_PATH,
  locale = null,
  children
}) => {
  const [initialized, setInitialized] = useState(false);

  React.useEffect(() => {
    let canceled = false;
    i18nextUse(XHR)
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
      })
      .then(() => {
        if (!canceled) {
          setInitialized(true);
        }
      })
      .catch(() => {});
    return () => {
      canceled = false;
    };
  }, [fallbackLng, loadPath]);

  /**
   * Update locale.
   */
  useEffect(() => {
    if (initialized && locale) {
      try {
        changeLanguage(locale);
      } catch (e) {
        //
      }
    }
  }, [initialized, locale]);

  if (!initialized) {
    return null;
  }
  return children;
};

export { I18n as default, EMPTY_CONTEXT, translate };
