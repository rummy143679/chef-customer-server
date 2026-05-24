# Backend Testing Documentation

## Overview

Comprehensive test suite for the Chef-Customer food ordering application backend. This includes unit and integration tests for all controllers, models, and utilities.

## Test Files

### 1. **auth.test.js**
Tests for JWT authentication and authorization middleware
- ✅ JWT token creation
- ✅ Token validation
- ✅ Protected route access
- ✅ Invalid token handling
- ✅ Missing token handling

### 2. **user.test.js**
Integration tests for User registration and login
- ✅ User registration with validation
- ✅ Password hashing verification
- ✅ Duplicate user prevention
- ✅ User login with credentials
- ✅ Role-based access control
- ✅ Cookie management
- ✅ Email validation
- ✅ Contact field validation

### 3. **dish.test.js**
Integration tests for Dish management
- ✅ Add new dish
- ✅ Update existing dish
- ✅ Fetch dishes with pagination
- ✅ Delete single dish
- ✅ Available/unavailable status
- ✅ Proper error handling

### 4. **order.test.js**
Integration tests for Order management
- ✅ Create new order
- ✅ Multiple items in single order
- ✅ Order payment status tracking
- ✅ Get customer's current orders
- ✅ Get customer's completed orders
- ✅ Order separation logic
- ✅ Order validation

### 5. **payment.test.js**
Integration tests for Razorpay payment processing
- ✅ Create Razorpay order
- ✅ Amount conversion (paise)
- ✅ Payment verification
- ✅ Signature validation
- ✅ Payment record creation
- ✅ Delivery record creation
- ✅ Customer location tracking

### 6. **delivery.test.js**
Integration tests for Delivery management
- ✅ Delivery boy location update
- ✅ Delivery boy availability
- ✅ Assign delivery boy to order
- ✅ Order pickup
- ✅ Delivery start
- ✅ Live location tracking
- ✅ Delivery boy logout
- ✅ Delivery status progression

### 7. **customer.test.js**
Integration tests for Customer-specific features
- ✅ Top items from each category
- ✅ Top-rated dishes
- ✅ Category-wise dish grouping
- ✅ Rating sorting
- ✅ Category filtering

### 8. **dish-schema.test.js**
Integration tests for advanced Dish operations
- ✅ Insert single dish
- ✅ Insert multiple dishes
- ✅ Find dish by name
- ✅ Find all dishes with count
- ✅ Select required fields only
- ✅ Update single dish
- ✅ Update multiple dishes
- ✅ Delete operations
- ✅ Filter by category
- ✅ Filter by price range
- ✅ Filter by category and rating

## Setup & Installation

### Prerequisites
```bash
npm install jest supertest mongodb-memory-server --save-dev
```

### Environment Variables
Create a `.env` file in the server root:
```
JWT_KEY=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
NODE_ENV=test
PORT=5000
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test -- tests/user.test.js
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Specific Pattern
```bash
npm test -- --testNamePattern="should register"
```

## Test Structure

Each test file follows this structure:

```javascript
describe("Feature Name Tests", () => {
    
    beforeAll(async () => {
        // Setup: Create MongoDB Memory Server
    });

    afterAll(async () => {
        // Cleanup: Disconnect database
    });

    beforeEach(async () => {
        // Reset database before each test
    });

    describe("Specific Endpoint/Feature", () => {
        
        test("should do something", async () => {
            // Arrange
            // Act
            // Assert
        });
    });
});
```

## Database Testing

Tests use **MongoDB Memory Server** which:
- Creates an in-memory MongoDB instance for each test file
- Automatically manages database lifecycle
- Provides isolation between test files
- No external database required
- Fast test execution

## Coverage Report

Run tests with coverage:
```bash
npm test -- --coverage
```

Coverage report will be generated in:
```
./coverage/lcov-report/index.html
```

## Best Practices Used

1. **Isolation**: Each test is independent and can run in any order
2. **Cleanup**: Database is cleared between tests
3. **Mocking**: External services (Razorpay) are mocked
4. **Descriptive Names**: Test names clearly describe what is being tested
5. **AAA Pattern**: Arrange-Act-Assert structure
6. **Error Cases**: Tests cover both success and failure scenarios
7. **Edge Cases**: Tests include boundary conditions

## Common Test Patterns

### Testing Success Scenarios
```javascript
test("should successfully complete operation", async () => {
    const response = await request(app)
        .post("/api/endpoint")
        .send(validData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("success");
});
```

### Testing Error Scenarios
```javascript
test("should fail with missing fields", async () => {
    const response = await request(app)
        .post("/api/endpoint")
        .send({});
    
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
});
```

### Testing Database Operations
```javascript
test("should persist data to database", async () => {
    const response = await request(app)
        .post("/api/endpoint")
        .send(data);
    
    const savedData = await Model.findById(response.body.data._id);
    expect(savedData).toBeDefined();
});
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
Tests use random ports, but if you see conflicts:
```bash
npm test -- --forceExit
```

### Timeout Issues
Increase timeout in jest.config.js:
```javascript
testTimeout: 30000, // 30 seconds
```

### Memory Issues
For large test suites:
```bash
npm test -- --maxWorkers=2
```

## Continuous Integration

For CI/CD pipelines (GitHub Actions, Jenkins, etc.):

```yaml
- name: Run Tests
  run: npm test -- --coverage --forceExit

- name: Upload Coverage
  run: npm run coverage:upload
```

## Future Enhancements

- [ ] Add E2E tests using Playwright/Cypress
- [ ] Performance/Load testing with Apache JMeter
- [ ] Security testing with OWASP ZAP
- [ ] API documentation auto-generation
- [ ] Mutation testing for test quality
- [ ] Contract testing between frontend and backend

## Support

For issues or questions about the test suite, refer to:
- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/typegoose/mongodb-memory-server)
