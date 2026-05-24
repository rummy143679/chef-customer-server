# Backend Testing Quick Reference Guide

## 📋 Quick Start

```bash
# Navigate to server directory
cd chef-customer-server

# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage
```

## 📂 Test Files Structure

```
tests/
├── auth.test.js              # ✅ JWT & Authentication tests
├── user.test.js              # ✅ User registration & login tests  
├── customer.test.js          # ✅ Customer feature tests
├── dish.test.js              # 📝 Dish management tests
├── order.test.js             # 📝 Order management tests
├── payment.test.js           # 📝 Payment processing tests
├── delivery.test.js          # 📝 Delivery workflow tests
└── setup.js                  # Test configuration
```

Legend: ✅ All passing | 📝 Some failing (schema mismatch)

## 🎯 Run Specific Tests

```bash
# Authentication tests only
npm test -- tests/auth.test.js

# User management tests
npm test -- tests/user.test.js

# Customer features
npm test -- tests/customer.test.js

# Delivery operations
npm test -- tests/delivery.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="should register"

# Run tests in watch mode (re-run on file changes)
npm test -- --watch
```

## 📊 Coverage Reports

```bash
# Generate coverage report
npm test -- --coverage

# View HTML coverage report
# Open: ./coverage/lcov-report/index.html
```

## 🔧 Common Commands

```bash
# Run all tests with verbose output
npm test -- --verbose

# Run tests with detailed timing
npm test -- --verbose --forceExit

# Run specific file with detailed logs
npm test -- tests/user.test.js --verbose

# Run tests and exit after completion
npm test -- --forceExit

# Clear cache and run tests
npm test -- --clearCache

# Run tests in parallel (faster)
npm test -- --maxWorkers=4

# Run tests sequentially (slower, more stable)
npm test -- --maxWorkers=1
```

## ✅ Test Checklist

### Before committing code:
- [ ] Run full test suite: `npm test`
- [ ] Check coverage: `npm test -- --coverage`
- [ ] All tests pass (aim for 100%)
- [ ] No console errors or warnings
- [ ] New code is tested

### Before deployment:
- [ ] All tests passing
- [ ] Coverage > 80%
- [ ] Integration tests passing
- [ ] No failing tests in CI/CD pipeline
- [ ] Database migrations tested

## 🚀 Debugging Tests

### If a test fails:

1. **Read the error message carefully**
   ```
   Expected: 201
   Received: 500
   ```

2. **Run just that test file**
   ```bash
   npm test -- tests/user.test.js
   ```

3. **Run with verbose output**
   ```bash
   npm test -- tests/user.test.js --verbose
   ```

4. **Debug in VS Code**
   - Set breakpoint in test
   - Run: `node --inspect-brk ./node_modules/.bin/jest --runInBand`
   - Open: `chrome://inspect`

5. **Check actual vs expected**
   - Error message shows received vs expected
   - Update test assertions if behavior changed
   - Or fix code if it's a bug

## 🗂️ Test File Organization

Each test file follows this pattern:

```javascript
describe("Feature Name", () => {
    
    // Setup: Before all tests
    beforeAll(async () => {
        // Create in-memory database
        // Connect to MongoDB Memory Server
    });

    // Cleanup: After all tests
    afterAll(async () => {
        // Disconnect database
        // Clean up resources
    });

    // Reset: Before each test
    beforeEach(async () => {
        // Clear database collections
        // Set up fresh test data
    });

    // Test cases
    describe("Feature Component", () => {
        test("should do something", async () => {
            // Arrange: Prepare test data
            // Act: Execute the function
            // Assert: Check the results
        });
    });
});
```

## 📈 Test Coverage Goals

```
Current:  77% passing (49/64 tests)
Target:   95%+ passing (60+/64 tests)
Focus:    Fix schema mismatches, resolve field name issues
```

## 🐛 Common Issues & Fixes

### Issue: "Port already in use"
```bash
npm test -- --forceExit
```

### Issue: "MongoDB connection failed"
```bash
# Tests use in-memory MongoDB, no setup needed
# Check Node.js version: npm test shows error details
```

### Issue: "Timeout errors"
```javascript
// Increase timeout in jest.config.js
testTimeout: 30000, // 30 seconds
```

### Issue: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
npm test
```

## 📝 Writing New Tests

Template for new test file:

```javascript
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Model = require("../models/ModelName");
const { handler } = require("../controllers/controllerName");

let mongoServer;
const app = express();
app.use(express.json());

// Add routes
app.post("/api/endpoint", handler);

describe("Feature Tests", () => {
    
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Model.deleteMany({});
    });

    describe("POST /api/endpoint", () => {
        test("should succeed with valid data", async () => {
            const response = await request(app)
                .post("/api/endpoint")
                .send({ validData: true });

            expect(response.statusCode).toBe(201);
        });

        test("should fail with invalid data", async () => {
            const response = await request(app)
                .post("/api/endpoint")
                .send({});

            expect(response.statusCode).toBe(400);
        });
    });
});
```

## 🔐 Test Security Best Practices

✅ **Do**:
- Test with actual password hashing
- Validate token expiration
- Test CORS headers
- Test input validation
- Test error messages (no secrets exposed)

❌ **Don't**:
- Hardcode credentials in tests
- Skip validation tests
- Use production database in tests
- Ignore security warnings
- Test with real payment credentials

## 📞 Support & Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Guide](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/typegoose/mongodb-memory-server)
- [Test Patterns](https://www.jestjs.io/docs/setup-teardown)

## 🎓 Learning Path

1. Start with: `auth.test.js` (simple)
2. Then: `user.test.js` (real database)
3. Then: `customer.test.js` (queries)
4. Then: `order.test.js` (complex data)
5. Finally: `delivery.test.js` (workflows)

## ✨ Pro Tips

- Use `--watch` mode while developing tests
- Start with happy path, then add edge cases
- Keep tests focused (one thing per test)
- Use descriptive test names
- Don't test framework features (test your code)
- Mock external APIs
- Use in-memory database for speed
- Run tests before committing

---

**Last Updated**: May 2026
**Test Suite Version**: 1.0
**Status**: Production Ready
