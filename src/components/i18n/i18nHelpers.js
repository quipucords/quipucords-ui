import React from 'react';
import { Trans } from 'react-i18next';
import i18next from 'i18next';
import { helpers } from '../../common';

/**
 * Check for providing an empty context (empty string).
 *
 * @type {string}
 */
const EMPTY_CONTEXT = 'LOCALE_EMPTY_CONTEXT';

/**
 * Apply a string towards a key. Optional replacement values and component/nodes.
 * See, https://react.i18next.com/
 *
 * @param {string|Array} translateKey A key reference, or an array of a primary key with fallback keys.
 * @param {string|object|Array} values A default string if the key can't be found. An object with i18next settings. Or an array of objects (key/value) pairs used to replace string tokes. i.e. "[{ hello: 'world' }]"
 * @param {Array} components An array of HTML/React nodes used to replace string tokens. i.e. "[<span />, <React.Fragment />]"
 * @param {object} options
 * @param {string} options.emptyContextValue Check to allow an empty context value.
 * @returns {string|React.ReactNode}
 */
const translate = (translateKey, values = null, components, { emptyContextValue = EMPTY_CONTEXT } = {}) => {
  const updatedValues = values;
  let updatedTranslateKey = translateKey;

  if (Array.isArray(updatedTranslateKey)) {
    updatedTranslateKey = updatedTranslateKey.filter(value => typeof value === 'string' && value.length > 0);
  }

  if (Array.isArray(updatedValues?.context)) {
    updatedValues.context = updatedValues.context
      .map(value => (value === emptyContextValue && ' ') || value)
      .filter(value => typeof value === 'string' && value.length > 0)
      .join('_');
  } else if (updatedValues?.context === emptyContextValue) {
    updatedValues.context = ' ';
  }

  if (helpers.TEST_MODE) {
    return helpers.noopTranslate(updatedTranslateKey, updatedValues, components);
  }

  if (components) {
    return (
      (i18next.store && <Trans i18nKey={updatedTranslateKey} values={updatedValues} components={components} />) || (
        <React.Fragment>t({updatedTranslateKey})</React.Fragment>
      )
    );
  }

  return (i18next.store && i18next.t(updatedTranslateKey, updatedValues)) || `t([${updatedTranslateKey}])`;
};

const i18nHelpers = { EMPTY_CONTEXT, translate };

export { i18nHelpers as default, i18nHelpers, EMPTY_CONTEXT, translate };
