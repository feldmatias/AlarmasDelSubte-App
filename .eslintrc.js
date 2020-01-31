module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", {"argsIgnorePattern": "^_"}],
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/explicit-member-accessibility": ["error"],
    'prettier/prettier': 0,
  },
  env: {
    jest: true
  },
};
