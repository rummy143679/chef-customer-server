# 🍽️ Chef-Customer Server

A robust **Node.js + Express** backend API for a multi-role food ordering and delivery management system. Handles user authentication, orders, payments, dishes, and real-time delivery tracking.

---

## 🚀 Quick Start (3 Simple Steps)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
# Create .env file in root directory (see below)

# 3. Start development server
npm start
```

Server runs at `http://localhost:5000` 🎉

---

## 📋 Project Overview

**Chef-Customer Server** is a production-ready API built with **Express.js + MongoDB + Mongoose** that powers a complete food delivery ecosystem:

- 👤 **Customer Management** - Registration, authentication, order placement
- 👨‍🍳 **Chef/Provider Management** - Dish management, order handling
- 🚚 **Delivery Partner Management** - Real-time location tracking, delivery status updates
- 💳 **Payment Processing** - Razorpay integration for secure payments
- 🛠️ **Admin Controls** - System-wide management and monitoring
- 🗺️ **Real-time Delivery Tracking** - Live location updates and route optimization

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Runtime** | Node.js | latest |
| **Framework** | Express.js | 5.1.0 |
| **Database** | MongoDB | 6.20.0 |
| **ODM** | Mongoose | 8.19.3 |
| **Authentication** | JWT | 9.0.2 |
| **Security** | bcrypt | 6.0.0 |
| **Payments** | Razorpay | 2.9.6 |
| **CORS** | cors | 2.8.5 |
| **Environment** | dotenv | 17.2.3 |
| **Cookies** | cookie-parser | 1.4.7 |
| **Development** | Nodemon | latest |

---

## 📁 Project Structure

```
chef-customer-server/
├── contollers/                         # Business logic & API handlers
│   ├── userControllers.js             # Auth (register, login, user list)
│   ├── dishController.js              # Basic dish CRUD operations
│   ├── Dish-Controller.js             # Advanced dish queries & filtering
│   ├── customerController.js          # Customer-specific features
│   ├── OrdersController.js            # Order processing & tracking
│   ├── paymentController.js           # Razorpay payment integration
│   ├── deliveryController.js          # Delivery tracking & management
│   └── deliveryBoyController.js       # Delivery partner operations
├── models/                             # MongoDB Mongoose Schemas
│   ├── userSchema.js                  # User data model
│   ├── dishSchema.js                  # Dish/menu items
│   ├── Dish-Schema.js                 # Alternative dish schema
│   ├── orderSchema.js                 # Order records
│   ├── paymentSchema.js               # Payment transactions
│   ├── deliverySchema.js              # Delivery tracking
│   └── deliveryPersonAvailableSchema.js # Delivery partner availability
├── routers/
│   └── router.js                      # All API route definitions
├── DbConnevtion/
│   └── db.js                          # MongoDB connection setup
├── utility/
│   └── createJwtToken.js              # JWT token generation utility
├── .env                               # Environment variables
├── .gitignore                         # Git ignore rules
├── package.json                       # Dependencies & scripts
├── index.js                           # Server entry point
└── README.md                          # This file
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the **root directory**:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Authentication
JWT_KEY=your_secret_jwt_key_here

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_RdnclI5ujSSmVe
RAZORPAY_SECRET=Y96N40KNYisEJZoAuSvlPBGV

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `5000` | Yes |
| `NODE_ENV` | Environment mode | `development` or `production` | Yes |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` | Yes |
| `JWT_KEY` | Secret key for JWT tokens | `My_key_Is_Jaffa` | Yes |
| `RAZORPAY_KEY_ID` | Razorpay public key | `rzp_test_...` | Yes |
| `RAZORPAY_SECRET` | Razorpay secret key | `Y96N40KNYisEJZoAuSvl...` | Yes |
| `CLIENT_URL` | Frontend URL for CORS | `https://domain.netlify.app` | Yes |

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn** package manager
- **MongoDB** (Atlas cloud or local instance)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Add to `.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chef-customer?retryWrites=true&w=majority
   ```

**Note:** Whitelist your IP address in MongoDB Atlas Network Access settings.

#### Option B: Local MongoDB

1. Install [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   mongod
   
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```
3. Add to `.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/chef-customer
   ```

### Step 3: Setup .env File

```bash
# Copy and edit the provided .env
cp .env.example .env
```

Edit with your configuration (see Environment Configuration above)

### Step 4: Start Server

```bash
# Development mode (with Nodemon auto-reload)
npm start

# Or run directly
node index.js
```

**Success message:**
```
✅ Server running on port 5000
MongoDB connected successfully
```

---

## 📜 Available Scripts

```bash
# Start development server with auto-reload (Nodemon)
npm start

# Run tests (when configured)
npm test
```

---

## 🔌 API Endpoints Reference

### Base URL: `http://localhost:5000/api/v1.0`

---

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/register` | Register new user | Public |
| `POST` | `/login` | User login, returns JWT | Public |
| `GET` | `/users` | Get all users | Admin |

---

### 🍽️ Dish Management Endpoints

#### Basic Operations
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/add-dish` | Add new dish | Chef |
| `GET` | `/dishes` | Fetch all dishes | Public |
| `DELETE` | `/delete-dish/:id` | Delete dish by ID | Chef |

#### Advanced Dish Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/insert-one-dish` | Insert single dish |
| `POST` | `/insert-meny-dishes` | Insert multiple dishes |
| `GET` | `/find-all-dishes` | Find all dishes with filters |
| `GET` | `/find-one-by-name/:name` | Find dish by name |
| `PATCH` | `/update-one-dish/:name` | Update dish by name |
| `POST` | `/update-many-dishes` | Update multiple dishes |
| `DELETE` | `/delete-one-by-id/:id` | Delete by ID |
| `DELETE` | `/delete-many-dishes` | Delete multiple dishes |
| `GET` | `/by-category/:category` | Get dishes by category |
| `GET` | `/price` | Get dishes by price range |
| `GET` | `/with-required-fields` | Get dishes with specific fields |

---

### 👤 Customer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tioec` | Top items from each category |
| `GET` | `/top-rated` | Get top-rated dishes |
| `GET` | `/category-wise` | Dishes grouped by category |
| `GET` | `/dishes` | Get dishes with category & rating filter |

---

### 🛒 Order Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/order` | Create new order | Customer |
| `GET` | `/orders/:id` | Get orders by customer ID | Customer |
| `POST` | `/orders` | Get orders for chef | Chef |
| `POST` | `/orders/:orderId/:itemId` | Update order item status | Chef |

---

### 💳 Payment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/payment/create` | Create Razorpay order |
| `POST` | `/payment/verify` | Verify payment & create order |

**Payment Flow:**
1. Frontend calls `POST /payment/create` → Get Razorpay Order ID
2. User completes payment on Razorpay checkout
3. Frontend calls `POST /payment/verify` → Verify signature & create order

---

### 🚚 Delivery Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/delivery-boy/location` | Update delivery partner location | Delivery |
| `POST` | `/delivery/assign` | Assign delivery partner to order | Admin |
| `PUT` | `/delivery/:id/pick` | Mark order as picked | Delivery |
| `PUT` | `/delivery/:id/start` | Start delivery (on the way) | Delivery |
| `PUT` | `/delivery/:id/location` | Update live location | Delivery |
| `PUT` | `/delivery/:id/reached` | Reached customer location | Delivery |
| `PUT` | `/delivery/:id/delivered` | Mark order as delivered | Delivery |
| `GET` | `/delivery/:id` | Get delivery details | Admin/Customer |
| `GET` | `/delivery-boy/active/:id` | Get active deliveries | Delivery |
| `POST` | `/delivery-boy/logout` | Logout delivery partner | Delivery |

---

## 💾 Database Models

### User Schema
```javascript
{
  userName: String (required, trim),
  email: String (required, unique, lowercase, trim),
  password: String (required, hashed with bcrypt),
  role: String (enum: "customer", "provider", "admin", "deliveryPartner", default: "customer"),
  contact: String (required, trim),
  status: String (enum: "active", "pending", "Blocked", default: "active"),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Dish Schema
```javascript
{
  dishName: String (required),
  category: String (required),
  price: Number (required),
  description: String,
  rating: Number,
  image: String,
  available: Boolean,
  preparationTime: Number,
  providerId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  customerId: ObjectId (required),
  chefId: ObjectId,
  items: [
    {
      dishId: ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: Number,
  status: String (enum: "pending", "preparing", "ready", "on-the-way", "delivered"),
  deliveryPartner: ObjectId,
  deliveryAddress: String,
  orderDate: Date,
  deliveryDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Schema
```javascript
{
  orderId: ObjectId (required),
  customerId: ObjectId (required),
  amount: Number (required),
  paymentMethod: String,
  transactionId: String,
  status: String (enum: "pending", "success", "failed"),
  createdAt: Date,
  updatedAt: Date
}
```

### Delivery Schema
```javascript
{
  orderId: ObjectId (required),
  deliveryPartnerId: ObjectId (required),
  customerId: ObjectId,
  pickupLocation: { latitude: Number, longitude: Number },
  deliveryLocation: { latitude: Number, longitude: Number },
  currentLocation: { latitude: Number, longitude: Number },
  status: String (enum: "picked", "in-transit", "delivered"),
  estimatedTime: Number,
  actualDeliveryTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication & Security

### JWT Token Flow

1. **User Registration/Login**
   - User credentials validated
   - Password hashed with bcrypt (10 salt rounds)
   - JWT token created with `JWT_KEY`

2. **Token in Request**
   - Frontend sends token in `Authorization` header
   - Backend validates token signature
   - Extracts user info from token payload

3. **Protected Routes**
   - Middleware checks JWT validity
   - Returns 401 if invalid or expired
   - Proceeds if valid

### Password Security

- **Hashing Algorithm**: bcrypt with 10 salt rounds
- **Storage**: Never plaintext in database
- **Validation**: Compared during login using bcrypt.compare()

### CORS Configuration

```javascript
allowedOrigins: [
  "http://localhost:5173",              // Local frontend
  "https://chef-customer.netlify.app"   // Production frontend
]
```

---

## 💳 Payment Integration (Razorpay)

### Setup Razorpay Account

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Create free account
3. Get API keys from Settings → API Keys
4. Add to `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_SECRET=...
   ```

### Payment Flow

**Step 1: Create Order**
```
POST /payment/create
Body: {
  amount: 5000,        // Amount in paise (50 rupees)
  orderId: "order123"
}
Response: {
  razorpayOrderId: "order_..."
}
```

**Step 2: Payment on Frontend**
- User opens Razorpay checkout modal
- Enters payment details
- Completes transaction

**Step 3: Verify Payment**
```
POST /payment/verify
Body: {
  razorpayOrderId: "order_...",
  razorpayPaymentId: "pay_...",
  signature: "..."
}
Response: {
  status: "success",
  message: "Order created successfully"
}
```

**Step 4: Order Creation**
- Upon successful verification
- Order created in database
- Order status = "pending"
- Customer receives confirmation

---

## 🌐 Deployment

### Deployment Platforms

#### Option 1: Heroku
```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Set environment variables
heroku config:set PORT=5000
heroku config:set MONGO_URI=...
heroku config:set JWT_KEY=...
heroku config:set RAZORPAY_KEY_ID=...
heroku config:set RAZORPAY_SECRET=...

# 5. Deploy
git push heroku main
```

#### Option 2: Railway / Render
1. Connect GitHub repository
2. Configure environment variables in dashboard
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Deploy

#### Option 3: AWS / Azure / Google Cloud
- Use container services (Docker recommended)
- Set environment variables
- Configure load balancing

### Production Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://prod_username:secure_password@cluster.mongodb.net/prod_database
JWT_KEY=very_secure_production_secret_key_minimum_32_chars
RAZORPAY_KEY_ID=rzp_live_LIVE_KEY_ID
RAZORPAY_SECRET=live_secret_key
CLIENT_URL=https://your-production-frontend.com
```

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **MongoDB Connection Error** | Invalid connection string | Verify `MONGO_URI`; ensure IP whitelisted in Atlas |
| **Authentication Failed** | Wrong credentials | Check username/password in MONGO_URI |
| **Connection Timeout** | Slow network/Atlas issue | Increase `serverSelectionTimeoutMS` |
| **CORS Error** | Frontend not in allowed origins | Add frontend URL to `allowedOrigins` in index.js |
| **JWT Token Invalid** | Wrong `JWT_KEY` | Verify `JWT_KEY` matches between frontend & backend |
| **Razorpay Payment Fails** | Invalid test keys | Use test keys; verify key format |
| **Port Already in Use** | Another service on port 5000 | Change `PORT` in `.env` or kill process |
| **Nodemon Not Reloading** | File not watched | Restart `npm start` |
| **Internal Server Error** | Unhandled exception | Check server console logs |

### MongoDB Connection Issues

```bash
# Connection refused
# Solution: Start MongoDB
mongod

# Authentication failed
# Solution: Verify username:password in MONGO_URI

# IP address not whitelisted
# Solution: Add your IP in MongoDB Atlas → Network Access

# Timeout connecting
# Solution: Check internet; try in different network
```

### API Endpoint Issues

```bash
# Use Postman to test endpoints
# 1. Set correct base URL: http://localhost:5000/api/v1.0
# 2. Send request body as JSON
# 3. Check response status code
# 4. Review error message

# Common response codes:
# 200 - OK
# 201 - Created
# 400 - Bad Request (invalid input)
# 401 - Unauthorized (JWT issue)
# 409 - Conflict (user already exists)
# 500 - Server Error
```

---

## 🔍 Key Controllers Overview

### User Controller
- **register()** - Create new user with hashed password
- **login()** - Authenticate user, return JWT token
- **users()** - Fetch all users (admin only)

### Dish Controller
- **addNewDish()** - Chef adds new dish
- **fetchDishes()** - Get all available dishes
- **deleteDish()** - Remove dish by ID
- Advanced queries in Dish-Controller.js

### Order Controller
- **postOrders()** - Create new order
- **getAllOrders()** - Get customer's order history
- **getOrdersForChef()** - Get orders assigned to chef
- **updateOrderItemStatus()** - Update order preparation status

### Payment Controller
- **createRazorpayOrder()** - Initialize payment, return order ID
- **verifyPaymentAndCreateOrder()** - Verify signature, create order

### Delivery Controller
- **updateDeliveryBoyLocation()** - Real-time location tracking
- **assignDeliveryBoy()** - Assign delivery partner to order
- **pickOrder()** - Mark order as picked up
- **startDelivery()** - Start delivery route
- **updateLocation()** - Live location updates
- **reachedDestination()** - Mark as reached customer
- **markDelivered()** - Complete delivery
- **getDeliveryDetails()** - Get delivery info
- **getActiveDeliveries()** - Get partner's active deliveries
- **logoutDeliveryBoy()** - Logout partner

---

## 📝 Best Practices

1. **Validate Input** - Check req.body before processing
2. **Use try-catch** - Handle errors gracefully
3. **Hash Passwords** - Never store plaintext
4. **Verify JWT** - Protect sensitive routes
5. **Log Events** - Track important actions
6. **Test APIs** - Use Postman before deployment
7. **Monitor DB** - Check connection stats
8. **Env Variables** - Never hardcode secrets
9. **Rate Limiting** - Prevent abuse
10. **Sanitize Input** - Prevent injection attacks

---

## 🚀 Performance Optimization

- **Connection Pooling** - `maxPoolSize: 10` for concurrent connections
- **Database Indexing** - Index frequently queried fields
- **Query Optimization** - Use projection to fetch only needed fields
- **Pagination** - Paginate large result sets
- **Caching** - Cache static data (dish list, ratings)
- **Compression** - Enable gzip compression
- **Async/Await** - Non-blocking operations
- **Batch Operations** - Use bulk insert/update

---

## 📊 Monitoring & Logging

```javascript
// Add logging for important events
console.log(`User registered: ${email}`);
console.log(`Order created: ${orderId}`);
console.log(`Payment verified: ${transactionId}`);
```

**Recommended Logging Tools:**
- Winston
- Morgan
- Bunyan

---

## 📞 Support & Resources

- **Express.js**: https://expressjs.com
- **MongoDB**: https://www.mongodb.com/docs
- **Mongoose**: https://mongoosejs.com
- **JWT**: https://jwt.io
- **bcrypt**: https://www.npmjs.com/package/bcrypt
- **Razorpay**: https://razorpay.com/docs
- **CORS**: https://enable-cors.org

---

## 🔧 Development Tools

**Recommended Tools:**
- **Postman** - API endpoint testing
- **MongoDB Compass** - Visual database management
- **VS Code** - Code editor
- **Thunder Client** - REST client (VS Code extension)
- **nodemon** - Auto-restart on file changes

---

## 📄 License

ISC License

---

## 👨‍💻 Author

**Matteda Ramesh**

---

**Happy Coding! 🎉**

For frontend setup, refer to the frontend repository documentation.
https://github.com/rummy143679/chef-customer-client.git

---

## 🆘 Need Help?

If you encounter issues:

1. Check server console logs
2. Verify `.env` configuration
3. Test endpoints with Postman
4. Check MongoDB Atlas connection status
5. Review error response messages
6. Consult documentation links above
