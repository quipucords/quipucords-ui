import _size from 'lodash/size';
import { helpers } from '../../common';

/**
 * Create a consistent mock event object.
 *
 * @param {object} event
 * @param {boolean} persistEvent
 * @returns {{keyCode, currentTarget, name, id: *, persist: Function, value, target}}
 */
const createMockEvent = (event, persistEvent = false) => {
  const { checked, currentTarget = {}, keyCode, persist = helpers.noop, target = {} } = { ...event };
  if (persistEvent) {
    persist();
  }

  return {
    checked,
    currentTarget,
    keyCode,
    id: currentTarget.id || currentTarget.name,
    name: currentTarget.name,
    persist,
    value: currentTarget.value,
    target
  };
};

/**
 * Confirm a string has minimum length.
 *
 * @param {string} value
 * @param {number} characters
 * @returns {boolean}
 */
const doesNotHaveMinimumCharacters = (value, characters = 1) =>
  (typeof value === 'string' && value.length < characters) || typeof value !== 'string';

/**
 * Confirm a string is not empty.
 *
 * @param {string} value
 * @returns {boolean}
 */
const isEmpty = value => (typeof value !== 'number' && _size(value) < 1) || false;

/**
 * Confirm string is the start of a path.
 *
 * @param {string} value
 * @returns {boolean}
 */
const isFilePath = value => /^\/.*$/.test(value);

/**
 * Confirm the port is valid.
 *
 * @param {string} value
 * @returns {boolean}
 */
const isPortValid = value => /^\d{1,5}$/.test(value) && value <= 65535;

const formHelpers = {
  createMockEvent,
  doesNotHaveMinimumCharacters,
  isEmpty,
  isFilePath,
  isPortValid
};

export { formHelpers as default, formHelpers, createMockEvent, doesNotHaveMinimumCharacters };
