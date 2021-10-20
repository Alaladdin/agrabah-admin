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
    // require('@windicss/animations')({
    //   settings: {
    //     animatedSpeed      : 1000,
    //     heartBeatSpeed     : 1000,
    //     hingeSpeed         : 2000,
    //     bounceInSpeed      : 750,
    //     bounceOutSpeed     : 750,
    //     animationDelaySpeed: 1000,
    //   },
    // }),
  ],
  variants: {
    scrollbar: ['rounded'],
  },
}
