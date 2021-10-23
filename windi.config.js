export default {
  extract: {
    include: [
      'node_modules/tv-*/dist/tv-*.umd.min.js',
      'node_modules/vue-tailwind/dist/components',
      '**/*.{vue,html,jsx,tsx,js}',
    ],
    exclude: ['.git/**/*'],
  },
  plugins: [
    require('@windicss/plugin-scrollbar'),
  ],
  variants: {
    scrollbar: ['rounded'],
  },
}
