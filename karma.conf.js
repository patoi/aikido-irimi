// Karma unit test

module.exports = function(config) {
    config.set({
        client: {
            captureConsole: true
        },
// base path, that will be used to resolve files and exclude
        basePath: '',
        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],
        // list of files / patterns to load in the browser
        files: [
            'public/js/jquery.min.js',
            'public/js/angular.min.js',
            'public/js/lodash.min.js',
            'public/js/is.min.js',
            //'public/js/materialize.js',
            'public/app/**/*.module.js',
            'public/app/**/*.service.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'tests/unit/*.test.js',
        ],
        // list of files / patterns to exclude
        exclude: [],
        // web server port
        port: 9876,
        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_DEBUG,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],
        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],
        reporters: ['dots', 'junit'],
        junitReporter: {
            outputFile: 'tests/out/karma_unit.xml',
            suite: 'test'
        }
    });
};
