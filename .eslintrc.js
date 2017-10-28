module.exports = {
  "extends": "airbnb-base",
  "env": {
    "jest": true,
    "browser": true,
    "node": true
  },
  "rules": {
    "comma-dangle": "off",
    "one-var": "off",
    "indent": ["error", 2, {
      "SwitchCase": 1,
      "VariableDeclarator": {
        "var": 2,
        "let": 2,
        "const": 3
      }
    }],
    "no-restricted-properties": "warn",
    "prefer-destructuring": ["error", {
      "array": false,
      "object": true
    }],
    "space-before-function-paren": ["error", "always"]
  }
};
