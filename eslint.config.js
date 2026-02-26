const tsParser = require('@typescript-eslint/parser');
const { defineConfig, globalIgnores } = require('eslint/config');
const typescriptPlugin = require('typescript-eslint');
const js = require('@eslint/js');
const json = require('@eslint/json').default;
const commentLengthPlugin = require('eslint-plugin-comment-length');
const importPlugin = require('eslint-plugin-import');
const jestPlugin = require('eslint-plugin-jest');
const jsDocPlugin = require('eslint-plugin-jsdoc');
const jsxA11YPlugin = require('eslint-plugin-jsx-a11y');
const prettierPlugin = require('eslint-plugin-prettier/recommended');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const globals = require('globals');

/* Note on order. TL;DR: it's a mess.
 * Some plugins want to provide configuration early, as they set the stage.
 * Other plugins want to be specified at the end, as they intend to overwrite configurations
 * provided by other plugins.
 * So our main config is supposed to go in the middle, between plugins.
 * However, prettier insists on inlining renovate.json (which is pretty short), so that one needs
 * to go after prettier.
 */

module.exports = defineConfig([
  globalIgnores(['**/package.json', '**/package-lock.json', 'src/vendor/**']),
  commentLengthPlugin.configs['flat/recommended'],
  jsxA11YPlugin.flatConfigs.recommended,
  typescriptPlugin.configs.recommended,
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.tsx', '**/*.jsx'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        NodeJS: true
      },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },

    plugins: {
      js,
      'jsdoc-plugin': jsDocPlugin,
      react: reactPlugin,
      'react-hook': reactHooksPlugin
    },

    extends: [
      'js/recommended',
      'jsdoc-plugin/recommended-typescript', // jsdoc tries to run for json files so must be put in extends
      reactHooksPlugin.configs.flat.recommended // also tries to run for json files
    ],

    settings: {
      'import/external-module-folders': ['public'],
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      },
      jsdoc: {},
      react: {
        version: 'detect'
      }
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'off',
      'no-unused-vars': 'off', // see https://typescript-eslint.io/rules/no-unused-vars/
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'arrow-parens': ['error', 'as-needed'],
      'class-methods-use-this': 'warn',
      'comma-dangle': 'off',
      'comment-length/limit-single-line-comments': [
        'warn',
        {
          maxLength: 120,
          logicalWrap: true
        }
      ],
      'comment-length/limit-multi-line-comments': [
        'warn',
        {
          maxLength: 120,
          logicalWrap: true
        }
      ],
      'consistent-return': 'warn',
      'default-param-last': 'off',
      'import/extensions': [
        'error',
        {
          json: 'always'
        }
      ],
      'import/first': 'off',
      'import/newline-after-import': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true
        }
      ],
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: 'react**',
              group: 'external',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },
          'newlines-between': 'never'
        }
      ],
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: [
            'api',
            'apiDescription',
            'apiSuccess',
            'apiSuccessExample',
            'apiError',
            'apiErrorExample',
            'apiMock',
            'apiParam'
          ]
        }
      ],
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-jsdoc': 'error',
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param-name': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-property': 'error',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-property-name': 'error',
      'jsdoc/require-property-type': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/tag-lines': [
        'warn',
        'always',
        {
          count: 0,
          applyToEndTag: false,
          startLines: 1
        }
      ],
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          labelComponents: ['CustomInputLabel'],
          labelAttributes: ['label'],
          controlComponents: ['CustomInput'],
          depth: 3
        }
      ],
      'jsx-a11y/label-has-for': [
        'error',
        {
          components: ['Label'],
          required: {
            some: ['nesting', 'id']
          }
        }
      ],
      'max-len': [
        'error',
        {
          code: 240,
          comments: 120,
          ignoreComments: false,
          ignoreUrls: true
        }
      ],
      'no-case-declarations': 'off',
      'no-console': 'off',
      'no-continue': 'off',
      'no-debugger': 'warn',
      'no-lonely-if': 'warn',
      'no-plusplus': 'off',
      'no-promise-executor-return': 'warn',
      'no-restricted-exports': [
        'warn',
        {
          restrictedNamedExports: []
        }
      ],
      'no-restricted-properties': [
        'off',
        {
          object: 'Math',
          property: 'pow'
        }
      ],
      'no-underscore-dangle': 'off',
      'no-unsafe-optional-chaining': 'warn',
      'prefer-exponentiation-operator': 'off',
      'prefer-promise-reject-errors': 'warn',
      'prefer-regex-literals': 'off',
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          singleQuote: true,
          trailingComma: 'none',
          printWidth: 120
        }
      ],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function'
        }
      ],
      'react/jsx-curly-newline': 'off',
      'react/jsx-filename-extension': 'off',
      'react/jsx-fragments': ['warn', 'element'],
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-no-constructed-context-values': 'warn',
      'react/no-unstable-nested-components': 'off',
      'react/jsx-no-useless-fragment': 'warn',
      'react/require-default-props': 'off',
      'react/state-in-constructor': ['warn', 'never'],
      'space-before-function-paren': 'off'
    }
  },
  {
    files: ['**/*.json'],
    language: 'json/json',
    plugins: {
      json
    },
    rules: {
      'json/no-duplicate-keys': 'error',
      'max-len': 'off'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: jestPlugin.environments.globals.globals
    },
    rules: {
      'prefer-promise-reject-errors': 'off',
      'jest/no-done-callback': 'off',
      'jest/no-standalone-expect': [
        'error',
        {
          additionalTestBlockFunctions: ['skipIt']
        }
      ],
      'jest/prefer-to-have-length': 'off',
      'jest/valid-describe-callback': 'error'
    }
  },
  {
    files: ['eslint.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  importPlugin.flatConfigs.recommended,
  prettierPlugin,
  {
    files: ['renovate.json'],
    rules: {
      'prettier/prettier': 'off'
    }
  }
]);
