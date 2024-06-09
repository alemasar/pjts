/* eslint-disable no-undef */
module.exports = {
  plugins: {
    'postcss-preset-env': {
      /* use stage 3 features + css nesting rules */
      stage: 3,
      features: {
        'nesting-rules': false
      },
      browsers: 'last 2 versions'
    },
    'postcss-import': {},
    'postcss-extend': {},
    'postcss-mixins': {},
    'postcss-simple-vars': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    ...(process.env.NODE_ENV === 'production' ? { autoprefixer: {} } : {}),
    ...(process.env.NODE_ENV === 'production'
      ? { cssnano: { preset: 'default' } }
      : {})
  }
};
