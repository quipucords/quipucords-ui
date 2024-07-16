import { dotenv } from 'weldable';

/**
 * Set dotenv params.
 */
dotenv.setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

/**
 * Emulate i18next setup
 */
jest.mock('i18next', () => {
  const Test = function () { // eslint-disable-line
    this.use = () => this;
    this.init = () => Promise.resolve();
    this.changeLanguage = () => Promise.resolve();
  };
  return new Test();
});

/**
 * Emulate for translation hook for snapshots
 */
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: (...args) => args })
}));
