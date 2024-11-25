module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb', // Use Airbnb style guide
    'plugin:prettier/recommended', // Integrate Prettier
  ],
  rules: {
    'no-console': 'warn', // Allow console logs but show a warning
    'no-unused-vars': 'warn', // Warn for unused variables instead of error
    'prefer-const': 'warn', // Suggest using const but don't enforce
    'arrow-body-style': 'off', // Don't enforce arrow function body style
    'react/jsx-props-no-spreading': 'off', // Allow prop spreading in JSX
    'import/no-extraneous-dependencies': 'off',
    'no-throw-literal': 'off',
    'default-param-last': 'off',
  },
};
