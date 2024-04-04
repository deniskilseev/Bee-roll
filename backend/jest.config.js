module.exports = {
    globalSetup: './tests/framework/setup.js',
    globalTeardown: './tests/framework/teardown.js',
    testRunner: 'jest-jasmine2',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'controllers/*.js',
        'model/*.js',
        'middleware/*.js',
        'routes/*.js',
        '*.js',
      ]
};