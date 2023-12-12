module.exports = {
  // tells eslint to use the TypeScript parser
  "parser": "@typescript-eslint/parser",
  // tell the TypeScript parser that we want to use JSX syntax
  "parserOptions": {
    "tsx": true,
    "jsx": true,
    "js": true,
    "useJSXTextNode": true,
    "project": "tsconfig.json",
    "comment": true,
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2022,
    "extraFileExtensions": [".json"],
    "sourceType": "module",
    "tsconfigRootDir": "."
  },
  // we want to use the recommended rules provided from the typescript plugin
  "extends": [
    "@redhat-cloud-services/eslint-config-redhat-cloud-services",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "globals": {
    "window": "readonly",
    "describe": "readonly",
    "test": "readonly",
    "expect": "readonly",
    "it": "readonly",
    "process": "readonly",
    "document": "readonly",
    "insights": "readonly",
    "shallow": "readonly",
    "render": "readonly",
    "mount": "readonly"
  },
  "overrides": [
    {
      "files": ["src/**/*.ts", "src/**/*.tsx"],
      "parser": "@typescript-eslint/parser",
      "plugins": ["@typescript-eslint"],
      "extends": ["plugin:@typescript-eslint/recommended"],
      "rules": {
        "react/prop-types": "off",
        "@typescript-eslint/no-unused-vars": "error"
      },
    },
  ],
  "settings": {
    "react": {
      "version": "^16.11.0"
    }
  },
  // includes the typescript specific rules found here: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
  "plugins": [
    "import",
    "jest",
    "jest",
    "node",
    "prettier",
    "react",
    "react-hooks",
    "@typescript-eslint"
  ],
  "rules": {
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "pathGroups": [
          {
            "pattern": "react**",
            "group": "external",
            "position": "before"
          }
        ],
        "pathGroupsExcludedImportTypes": ["builtin"],
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        },
        "newlines-between": "never"
      }
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/interface-name-prefix": "off",
    "prettier/prettier": [
      "error",
      {
        "arrowParens": "avoid",
        "singleQuote": true,
        "trailingComma": "none",
        "printWidth": 100
      }
    ],
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "react/prop-types": "off"
  },
  "env": {
    "browser": true,
    "node": true
  }
}
