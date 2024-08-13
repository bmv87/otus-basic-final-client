/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    // '@vue/standard',
    '@vue/eslint-config-typescript'
  ],
  // parser: '@typescript-eslint/parser',
  // plugins: ['@typescript-eslint'],
  rules: {
    // "sort-imports": ["warning", {
    //   "ignoreCase": false,
    //   "ignoreDeclarationSort": false,
    //   "ignoreMemberSort": true,
    //   "memberSyntaxSortOrder": ["none", "all", "single", "multiple"],
    //   "allowSeparatedGroups": false
    // }],
    'no-extra-semi': 'off',
    'semi': 'off',
    '@typescript-eslint/brace-style': ['error',
      'stroustrup',
      {
        allowSingleLine: true
      }],
    '@typescript-eslint/prefer-as-const': 'error',
    'quotes': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/no-extra-semi': 'error',
    '@typescript-eslint/semi': ['error', 'never'],
    'comma-spacing': ['error', {
      'before': false,
      'after': true
    }],
    'no-multi-spaces': ['error', {
      ignoreEOLComments: false
    }],
    'no-multiple-empty-lines': ['error', {
      max: 1,
      maxBOF: 2,
      maxEOF: 0
    }],
    'keyword-spacing': ['error', {
      'after': true,
      'before': true
    }],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': ['error', {
      'ignoreComments': true,
      'skipBlankLines': false
    }],
    'object-curly-spacing': ['error', 'always'],
    'object-curly-newline': ['error', {
      'ObjectExpression': {
        'multiline': true,
        'minProperties': 1
      },
      'ObjectPattern': {
        'multiline': true
      },
      'ImportDeclaration': {
        'multiline': true,
        'minProperties': 5
      },
      'ExportDeclaration': {
        'multiline': true,
        'minProperties': 2
      }
    }],
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': 'error',
    'computed-property-spacing': ['error', 'never'],
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    'indent': 'off',
    'space-before-blocks': 'off',
    '@typescript-eslint/space-before-blocks': 'error',
    'object-property-newline': 'error',
    'vue/object-property-newline': 'error',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-explicit-any': 'off',
    'lines-between-class-members': 'off',
    '@typescript-eslint/lines-between-class-members': 'error',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/type-annotation-spacing': 'error',
    'space-infix-ops': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/space-infix-ops': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/multiline-html-element-content-newline': [
      'error',
      {
        ignoreWhenEmpty: true,
        ignores: [],
        allowEmptyLines: true
      }
    ],
    'vue/no-unsupported-features': ['error', {
      version: '3.0.0',
      ignores: []
    }],
    'vue/singleline-html-element-content-newline': [
      'error',
      {
        ignoreWhenNoAttributes: false,
        ignoreWhenEmpty: true,
        ignores: []
      }
    ],
    'vue/no-async-in-computed-properties': 'error',
    'no-case-declarations': 'off',
    'no-prototype-builtins': 'off',
    'vue/no-v-html': 'off',
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never'
      }
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 2,
        baseIndent: 1,
        closeBracket: 1,
        alignAttributesVertically: true,
        ignores: []
      }
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 4,
        multiline: {
          max: 1
        }
      }
    ],
    'vue/mustache-interpolation-spacing': [
      'error',
      'always'
    ],
    'vue/no-multi-spaces': [
      'error',
      {
        ignoreProperties: false
      }
    ],
    'vue/no-spaces-around-equal-signs-in-attribute': 'error',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/v-on-style': [
      'error',
      'shorthand'
    ],
    'vue/v-bind-style': [
      'error',
      'shorthand'
    ],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ],
        alphabetical: false
      }
    ],
    'vue/order-in-components': [
      'error',
      {
        order: [
          'el',
          'name',
          'parent',
          'functional',
          [
            'delimiters',
            'comments'
          ],
          'components',
          [
            'directives',
            'filters'
          ],
          'extends',
          'mixins',
          [
            'props',
            'propsData'
          ],
          'asyncData',
          'data',
          'computed',
          'watch',
          'inheritAttrs',
          'model',
          'fetch',
          'LIFECYCLE_HOOKS',
          'methods',
          'head',
          [
            'template',
            'render'
          ],
          'renderError'
        ]
      }
    ],
    'vue/require-prop-type-constructor': 'off',
    'vue/array-bracket-spacing': [
      'error',
      'always',
      {
        singleValue: true,
        objectsInArrays: true,
        arraysInArrays: true
      }
    ],
    'vue/v-slot-style': ['error', {
      atComponent: 'v-slot',
      default: 'v-slot',
      named: 'longform'
    }],
    'vue/valid-v-slot': 'error',
    'vue/no-deprecated-scope-attribute': 'error',
    'vue/no-deprecated-slot-attribute': 'error',
    'vue/no-deprecated-slot-scope-attribute': 'error',
    'vue/arrow-spacing': 'error',
    'space-in-parens': 'error',
    'arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': [
      'error',
      'stroustrup',
      {
        allowSingleLine: true
      }
    ],
    'vue/comma-dangle': [
      'error',
      'never'
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: true,
        ignores: []
      }
    ],
    'vue/component-tags-order': [
      'error',
      {
        order: [
          'template',
          'style',
          'script'
        ]
      }
    ],
    'vue/dot-location': [
      'error',
      'object'
    ],
    'vue/eqeqeq': [
      'error',
      'always'
    ],
    'vue/key-spacing': [
      'error',
      {
        mode: 'strict'
      }
    ],
    'key-spacing': [
      'error',
      {
        mode: 'strict'
      }
    ],
    'vue/object-curly-spacing': [
      'error',
      'always'
    ],
    'vue/padding-line-between-blocks': [
      'error',
      'always'
    ],
    'vue/require-direct-export': 'error',
    // 'vue/script-indent': [
    //   'error',
    //   2,
    //   {
    //     baseIndent: 1
    //   }
    // ],
    'vue/space-unary-ops': 'error',
    'vue/v-on-function-call': [
      'error',
      'never'
    ]
  }
}
