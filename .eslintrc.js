// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-blocks': [0, "always"],//不以新行开始的块{前面要不要有空格
    'spaced-comment': 0, //注释风格要不要有空格什么的,
    'semi': [0],
    'no-multiple-empty-lines': [0, {"max": 2}],
    'padded-blocks': 0, //块语句内行首行尾是否要空行,
    'no-unused-vars': 0,
    'space-before-function-paren': 0,
    'brace-style': 0
  }
};
