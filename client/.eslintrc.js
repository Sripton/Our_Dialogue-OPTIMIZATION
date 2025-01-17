module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "airbnb",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    quotes: 0,
    "comma-dangle": 0,
    "jsx-a11y/control-has-associated-label": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "no-restricted-exports": 0,
    "jsx-a11y/anchor-has-content": 0,
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": 0,
    "no-unused-vars": 0,
    "react/prop-types": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
  },
};
