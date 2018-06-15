module.exports = function(config) {
    config.set({
      frameworks: ['mocha', 'chai'],
      plugins: [
        'karma-mocha',
        'karma-chai',
        'karma-firebase',
        'karma-chrome-launcher'
      ],
      files: [
        'public/js/firebase.js',
        'public/js/firebase.config.js',
        'public/js/mui.min.js',
        'public/js/authorize.js',
        'tests/*.js'
      ],
      exclude: ['public/js/app.js'],
      reporters: ['progress'],
      port: 9876,  // karma web server port
      colors: true,
      logLevel: config.LOG_INFO,
      browsers: ['ChromeHeadless'],
      autoWatch: false,
      // singleRun: false, // Karma captures browsers, runs the tests and exits
      concurrency: Infinity
    })
  }