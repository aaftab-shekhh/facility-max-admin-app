module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-filename-extension': [
      1,
      {extensions: ['.js', '.jsx', '.ts', '.tsx']},
    ],
    'react/no-unstable-nested-components': [
      'off' || 'warn' || 'error',
      {
        allowAsProps: true || false,
        customValidators: [],
      },
    ],
  },
};
