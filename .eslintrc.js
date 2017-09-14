module.exports = {
  "extends": "airbnb-base",
  "rules": {
    "comma-dangle": "off",
    "one-var": ["error", "always"],
    "indent": ["error", 2, {
      "SwitchCase": 1,
      "VariableDeclarator": {
        "var": 2,
        "let": 2,
        "const": 3
      }
    }],
    "no-restricted-properties": "warn"
  }
};
