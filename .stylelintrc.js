/**
 * @type {import("stylelint").ConfigRules}
 */
const commonRules = {
  'alpha-value-notation': null,
  'color-function-notation': null,
  'comment-empty-line-before': null,
  'custom-property-empty-line-before': null,
  'declaration-empty-line-before': null,
  'function-whitespace-after': null,
  'no-descending-specificity': null,
  'rule-empty-line-before': null,
  'value-keyword-case': null,
  'property-no-vendor-prefix': null,
  'selector-class-pattern': null,
}

/**
 * @type {import("stylelint").Config}
 */
 
module.exports = {
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        'stylelint-config-standard',
        'stylelint-config-recommended',
        'stylelint-config-styled-components',
        'stylelint-config-prettier',
      ],
      customSyntax: 'postcss-styled-syntax',
      rules: {
        ...commonRules,
        'function-no-unknown': null,
      },
    },
  ],
}
