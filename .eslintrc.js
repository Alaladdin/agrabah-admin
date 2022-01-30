module.exports = {
  root: true,
  env : {
    browser: true,
    node   : true,
  },
  parserOptions: {
    parser           : '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
  ],
  rules: {
    'vue/component-definition-name-casing'       : ['error', 'kebab-case'],
    'vue/singleline-html-element-content-newline': [0],
    'key-spacing'                                : [1, {
      singleLine: {
        beforeColon: false,
        afterColon : true,
      },
      multiLine: {
        align: 'colon',
      },
    }],
    curly: [
      'error',
      'multi-or-nest',
      'consistent',
    ],
    'comma-dangle': ['error', {
      arrays   : 'always-multiline',
      objects  : 'always-multiline',
      imports  : 'never',
      exports  : 'never',
      functions: 'never',
    }],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev     : '*',
        next     : 'return',
      },
      {
        blankLine: 'always',
        prev     : ['const', 'let', 'var'],
        next     : '*',
      },
      {
        blankLine: 'any',
        prev     : ['const', 'let', 'var'],
        next     : ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev     : ['if', 'case', 'default'],
        next     : '*',
      },
      {
        blankLine: 'always',
        prev     : '*',
        next     : ['if', 'case', 'default'],
      },
      {
        blankLine: 'any',
        prev     : ['if', 'case', 'default'],
        next     : ['if', 'case', 'default'],
      },
    ],
  },
}
