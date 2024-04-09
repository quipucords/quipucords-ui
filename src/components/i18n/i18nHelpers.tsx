/**
 * Provides utilities for translating text within React components using `react-i18next`. Includes a function for handling translations
 * with dynamic values and custom components, and a constant for cases where translation context is intentionally empty.
 * Streamlines integration of i18n in React applications, ensuring flexibility and support for complex translation scenarios.
 * @module i18nHelpers
 */
import React from 'react';
import { Trans } from 'react-i18next';
import i18next, { TFunction } from 'i18next';
import { helpers } from '../../helpers';

const EMPTY_CONTEXT: string = 'LOCALE_EMPTY_CONTEXT';

const translate = (
  t: TFunction,
  translateKey: string | string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: string | any | string[] | any[] | null = null,
  components:
    | readonly React.ReactElement[]
    | { readonly [tagName: string]: React.ReactElement } = {},
  { emptyContextValue = EMPTY_CONTEXT } = {}
): string | React.ReactNode => {
  const updatedValues = values || {};
  let updatedTranslateKey = translateKey;

  if (Array.isArray(updatedTranslateKey)) {
    updatedTranslateKey = updatedTranslateKey.filter(
      value => typeof value === 'string' && value.length > 0
    );
  }

  if (Array.isArray(updatedValues?.context)) {
    const updatedContext = updatedValues.context
      .map(value => (value === emptyContextValue && ' ') || value)
      .filter(value => typeof value === 'string' && value.length > 0);

    if (updatedContext?.length > 1) {
      const lastContext = updatedContext.pop();

      if (Array.isArray(updatedTranslateKey)) {
        updatedTranslateKey[0] = `${updatedTranslateKey[0]}_${updatedContext.join('_')}`;
      } else {
        updatedTranslateKey = `${updatedTranslateKey}_${updatedContext.join('_')}`;
      }

      updatedValues.context = lastContext;
    } else {
      updatedValues.context = updatedContext.join('_');
    }
  } else if (updatedValues?.context === emptyContextValue) {
    updatedValues.context = ' ';
  }

  if (helpers.TEST_MODE) {
    return helpers.noopTranslate(updatedTranslateKey, updatedValues, components);
  }

  if (components) {
    return (
      (i18next.store && (
        <Trans i18nKey={updatedTranslateKey} values={updatedValues} components={components} />
      )) || <React.Fragment>t({updatedTranslateKey})</React.Fragment>
    );
  }

  return (
    (t(updatedTranslateKey, updatedValues) as React.ReactNode) || `t([${updatedTranslateKey}])`
  );
};

const i18nHelpers = { EMPTY_CONTEXT, translate };

export { i18nHelpers as default, i18nHelpers, EMPTY_CONTEXT, translate };
