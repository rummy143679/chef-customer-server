// tests/setup.js

// Global test setup
beforeAll(async() => {
    // Suppress console logs during tests if needed
    global.console = {
        ...console,
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };
});

afterAll(async() => {
    jest.restoreAllMocks();
});