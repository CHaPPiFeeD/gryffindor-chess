module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 11,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
  ],
  'rules': {
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'linebreak-style': ['error', 'windows'],
    'quotes': ['error', 'single'],
    'react/react-in-jsx-scope': [0],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'comma-dangle': [2, 'always-multiline'],
    'eol-last': [2],
    'object-curly-spacing': ['error', 'always', { 'objectsInObjects': false }],
    'react/prop-types': 'off',
    'semi': [2, 'always'],
  },
};
