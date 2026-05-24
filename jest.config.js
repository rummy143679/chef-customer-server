// jest.config.js

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'contollers/**/*.js',
        'models/**/*.js',
        'utility/**/*.js',
        'routers/**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/',
        '/coverage/'
    ],
    testTimeout: 30000,
    verbose: true,
    forceExit: true,
    clearMocks: true,
};