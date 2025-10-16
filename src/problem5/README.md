# Problem5: Express CRUD API with TypeORM & SQLite

A production-ready REST API backend built with Express.js, TypeScript, and TypeORM, using SQLite for data persistence.

## Features

- ✅ Full CRUD operations on Product resource
- ✅ SQLite database with automatic schema synchronization
- ✅ TypeORM for type-safe database operations
- ✅ Built-in filtering for list endpoint
- ✅ RESTful API design
- ✅ TypeScript for type safety

## Prerequisites

- Node.js >= 16.x
- npm or yarn

## Installation

1. Navigate to the project directory:
```bash
cd code/src/problem5
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The application uses SQLite database stored locally as `database.sqlite`. No additional configuration is needed for basic development.

Environment variables (optional):
```bash
PORT=4000  # Default: 4000
```

## Running the Application

### Development mode (with hot-reload via ts-node):
```bash
npm run dev
```

### Production build:
```bash
npm run build
npm start
```

The server will start at `http://localhost:4000`

## Swagger UI (API Testing)

Once the server is running, access Swagger UI for interactive API testing and documentation:

📚 **Swagger UI**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

### Features
- ✅ Interactive endpoint documentation
- ✅ One-click API testing (Try it out)
- ✅ Request/response examples
- ✅ Automatic schema validation
- ✅ Real-time error feedback
- ✅ Download OpenAPI spec

### Using Swagger UI to Test Endpoints

1. **Create a Product**
   - Click on `POST /api/products`
   - Click "Try it out"
   - Fill in the example body:
     ```json
     {
       "name": "Laptop",
       "description": "High-performance laptop",
       "price": 1299.99,
       "quantity": 10,
       "category": "Electronics"
     }
     ```
   - Click "Execute"
   - View response status (201) and returned product data

2. **List Products with Filters**
   - Click on `GET /api/products`
   - Click "Try it out"
   - Optional: Add query parameters
     - `category`: Electronics
     - `minPrice`: 100
     - `maxPrice`: 2000
   - Click "Execute"

3. **Get Product Details**
   - Click on `GET /api/products/{id}`
   - Click "Try it out"
   - Enter product ID (e.g., 1)
   - Click "Execute"

4. **Update Product**
   - Click on `PUT /api/products/{id}`
   - Click "Try it out"
   - Enter product ID
   - Modify the request body with new values
   - Click "Execute"

5. **Delete Product**
   - Click on `DELETE /api/products/{id}`
   - Click "Try it out"
   - Enter product ID
   - Click "Execute"

### Additional Endpoints

- **OpenAPI Spec (JSON)**: `http://localhost:4000/api/docs.json`
- **Health Check**: `http://localhost:4000/health`

## API Endpoints

### 1. Create a Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1299.99,
  "quantity": 10,
  "category": "Electronics"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": "1299.99",
  "quantity": 10,
  "category": "Electronics",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. List Products with Filters
```http
GET /api/products?category=Electronics&minPrice=100&maxPrice=2000
```

**Query Parameters:**
- `category` (optional): Filter by category
- `minPrice` (optional): Filter products with price >= minPrice
- `maxPrice` (optional): Filter products with price <= maxPrice

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": "1299.99",
    "quantity": 10,
    "category": "Electronics",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 3. Get Product Details
```http
GET /api/products/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": "1299.99",
  "quantity": 10,
  "category": "Electronics",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Update Product
```http
PUT /api/products/1
Content-Type: application/json

{
  "name": "Updated Laptop",
  "price": 1199.99,
  "quantity": 5
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Laptop",
  "description": "High-performance laptop",
  "price": "1199.99",
  "quantity": 5,
  "category": "Electronics",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### 5. Delete Product
```http
DELETE /api/products/1
```

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully",
  "id": 1
}
```

### 6. Health Check
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Error Handling

All errors return appropriate HTTP status codes with descriptive messages:

- `400 Bad Request`: Missing or invalid required fields
- `404 Not Found`: Resource does not exist
- `500 Internal Server Error`: Server-side error

## Database Schema

The `products` table includes:
- `id` (Primary Key, Auto-increment)
- `name` (VARCHAR 255, Required)
- `description` (TEXT, Required)
- `price` (DECIMAL 10,2, Required)
- `quantity` (INTEGER, Default: 0)
- `category` (VARCHAR 100, Optional)
- `createdAt` (TIMESTAMP, Auto-generated)
- `updatedAt` (TIMESTAMP, Auto-updated)

## Project Structure

```
src/
├── index.ts                          # Server entry point
├── database.ts                       # TypeORM DataSource config
├── swagger.ts                        # OpenAPI/Swagger config
├── entity/
│   └── Product.ts                    # TypeORM Product entity
├── controller/
│   └── ProductController.ts          # HTTP routing & request handling
├── repository/
│   └── ProductRepository.ts          # Business logic & data access
├── middleware/
│   └── responseMiddleware.ts         # Standardized response formatting
├── types/
│   └── response.ts                   # Response schemas & types
└── routes/
    └── productRoutes.ts              # Route definitions with Swagger docs
```

## Architecture Pattern

This project follows the **Repository Pattern** with clear separation of concerns:

```
HTTP Request
    ↓
Router → Controller → Repository → Database
    ↑                     ↓
Response Middleware ← Result
```

### Layer Responsibilities

**Controller** (`ProductController.ts`)
- Parse HTTP requests and extract parameters
- Call appropriate repository methods
- Handle errors and invoke response middleware
- Route HTTP calls to business logic

**Repository** (`ProductRepository.ts`)
- All business logic and validation
- Data access via TypeORM
- Query building and filtering
- Error handling at data layer

**Middleware** (`responseMiddleware.ts`)
- Standardize all API responses
- Add response metadata (status, timestamp)
- Format error responses consistently

### Request Flow Example

```
POST /api/products
  ↓
ProductController.createProduct()
  - Extract name, description, price, quantity, category from req.body
  - Call ProductRepository.create(data)
  ↓
ProductRepository.create()
  - Validate all required fields
  - Validate price >= 0 and quantity >= 0
  - Create product entity
  - Save to database
  - Return created product
  ↓
ProductController (receive product)
  - Call res.sendCreated(product)
  ↓
Response Middleware
  - Format as standardized response
  - Add iStatus, iMessage, iPayload, iCode, iTimestamp
  ↓
Client receives:
{
  "iStatus": "SUCCESS",
  "iMessage": "Product created successfully",
  "iPayload": { /* product data */ },
  "iCode": 201,
  "iTimestamp": "2024-01-15T10:30:00.000Z"
}
```

## Testing with cURL

```bash
# Create
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Product 1","description":"Desc","price":99.99,"quantity":5,"category":"Test"}'

# List all
curl http://localhost:4000/api/products

# List filtered
curl "http://localhost:4000/api/products?category=Test&minPrice=50&maxPrice=150"

# Get one
curl http://localhost:4000/api/products/1

# Update
curl -X PUT http://localhost:4000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated","price":89.99}'

# Delete
curl -X DELETE http://localhost:4000/api/products/1

# Health
curl http://localhost:4000/health
```

## Response Schema

All API responses follow a standardized professional format:

```json
{
  "iStatus": "SUCCESS | FAIL | ERROR",
  "iMessage": "Human-readable message",
  "iPayload": { /* response data or null */ },
  "iCode": 200,
  "iError": "Error details (optional)",
  "iTimestamp": "2024-01-15T10:30:00.000Z"
}
```

### Response Status Types

- **SUCCESS** (iCode: 200/201): Operation completed successfully
- **FAIL** (iCode: 400/404): Client error or validation failure
- **ERROR** (iCode: 500): Server-side error

### Example Responses

**Success Response (200):**
```json
{
  "iStatus": "SUCCESS",
  "iMessage": "Product retrieved successfully",
  "iPayload": {
    "id": 1,
    "name": "Laptop",
    "price": "1299.99",
    "quantity": 10
  },
  "iCode": 200,
  "iTimestamp": "2024-01-15T10:30:00.000Z"
}
```

**Created Response (201):**
```json
{
  "iStatus": "SUCCESS",
  "iMessage": "Product created successfully",
  "iPayload": { /* full product object */ },
  "iCode": 201,
  "iTimestamp": "2024-01-15T10:30:00.000Z"
}
```

**Validation Failure (400):**
```json
{
  "iStatus": "FAIL",
  "iMessage": "Missing required fields: name, description, price, quantity",
  "iPayload": null,
  "iCode": 400,
  "iError": "VALIDATION_ERROR",
  "iTimestamp": "2024-01-15T10:30:00.000Z"
}
```

**Not Found (404):**
```json
{
  "iStatus": "FAIL",
  "iMessage": "Product with ID 999 not found",
  "iPayload": null,
  "iCode": 404,
  "iTimestamp": "2024-01-15T10:30:00.000Z"
}
```

**Server Error (500):**
```json
{
  "iStatus": "ERROR",
  "iMessage": "Failed to create product",
  "iPayload": null,
  "iCode": 500,
  "iError": "Connection timeout",
  "iTimestamp": "2024-01-15T10:30:00.000Z"
}
```

## Middleware Integration

The application uses a response middleware (`responseMiddleware`) that extends Express Response object with helper methods:

- `res.sendSuccess<T>(data, message?, code?)` - Success response
- `res.sendCreated<T>(data, message?)` - Created (201)
- `res.sendFail(message, code?, error?)` - Client error
- `res.sendNotFound(message?, error?)` - Not found (404)
- `res.sendError(message, code?, error?)` - Server error (500)
- `res.sendDeleted(id, message?)` - Deletion success

All methods automatically set appropriate HTTP status codes and include timestamps.

## Notes

- Database file (`database.sqlite`) is created automatically on first run
- Decorators must be imported via `reflect-metadata` (done in index.ts)
- SQLite is suitable for development; for production, consider PostgreSQL or MySQL
- All timestamps are in UTC
- Response middleware is automatically applied to all routes

## Benefits of Repository Pattern

✅ **Separation of Concerns**
- Controllers handle HTTP routing only
- Repository handles all business logic
- Middleware handles response formatting

✅ **Testability**
- Easy to unit test repository methods independently
- Mock repository for controller tests
- Business logic isolated from HTTP layer

✅ **Maintainability**
- Business logic in one place (repository)
- Easy to find and modify rules
- Consistent error handling

✅ **Scalability**
- Add service layer later if needed
- Easy to add validation middleware
- Support multiple data sources

✅ **Reusability**
- Repository methods can be called from multiple sources
- Decoupled from Express framework
- Could be used in CLI, WebSocket, or GraphQL APIs

## Repository Methods

All business logic is encapsulated in `ProductRepository`:

```typescript
// Create
await ProductRepository.create({ name, description, price, quantity, category })

// Read
await ProductRepository.findAll(filters?)  // Returns Product[]
await ProductRepository.findById(id)       // Returns Product | null

// Update
await ProductRepository.update(id, { name?, description?, price?, quantity?, category? })

// Delete
await ProductRepository.delete(id)         // Returns deleted id

// Utility
await ProductRepository.count()            // Returns total count
await ProductRepository.exists(id)         // Returns boolean
```

Each method includes:
- Input validation
- Error handling
- Consistent error messages
- TypeORM query building


