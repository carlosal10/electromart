module.exports = {
  root: true,
  env: {
    browser: false,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  overrides: [
    {
      files: ['client/src/**/*.{js,jsx}'],
      env: {
        browser: true,
        node: false,
      },
    },
    {
      files: ['**/__tests__/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
      env: {
        jest: true,
      },
    },
  ],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/no-unresolved': 'off',
  },
  ignorePatterns: ['client/build', 'build', 'node_modules', 'client/node_modules'],
};
