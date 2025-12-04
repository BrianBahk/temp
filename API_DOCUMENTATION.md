# ReadSphere API Documentation

## Authentication

All authenticated endpoints require a user ID header:

```
x-user-id: <user-id>
```

Admin endpoints require the user to have `role: "admin"` in the database.

---

## Reviews API

### Get Reviews

**GET** `/api/reviews`

Fetch reviews for a specific publication.

**Query Parameters:**

- `publicationId` (required): ID of the publication
- `status` (optional, default: "approved"): Filter by review status (pending/approved/rejected)

**Response:** `200 OK`

```json
[
  {
    "id": "review-id",
    "rating": 5,
    "comment": "Great publication!",
    "status": "approved",
    "createdAt": "2025-12-04T10:00:00Z",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

### Create Review

**POST** `/api/reviews`

Create a new review for a purchased publication.

**Headers:**

- `x-user-id`: User ID (required)

**Request Body:**

```json
{
  "publicationId": "publication-id",
  "rating": 5,
  "comment": "Excellent content!"
}
```

**Validation:**

- User must have purchased the publication
- User can only review each publication once
- Rating must be between 1-5

**Response:** `201 Created`

```json
{
  "id": "review-id",
  "userId": "user-id",
  "publicationId": "publication-id",
  "rating": 5,
  "comment": "Excellent content!",
  "status": "pending",
  "createdAt": "2025-12-04T10:00:00Z",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid input or user already reviewed
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: User hasn't purchased this publication

---

## Admin Reviews API

### Get All Reviews (Admin)

**GET** `/api/admin/reviews`

Get all reviews with optional status filter.

**Headers:**

- `x-user-id`: Admin user ID (required)

**Query Parameters:**

- `status` (optional): Filter by status (pending/approved/rejected)

**Response:** `200 OK`

```json
[
  {
    "id": "review-id",
    "rating": 4,
    "comment": "Very informative",
    "status": "pending",
    "createdAt": "2025-12-04T10:00:00Z",
    "user": {
      "id": "user-id",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "publication": {
      "id": "pub-id",
      "title": "The Economist",
      "type": "magazine",
      "image": "https://..."
    }
  }
]
```

**Error Response:**

- `403 Forbidden`: User is not an admin

---

### Get Single Review (Admin)

**GET** `/api/admin/reviews/[id]`

Get details of a specific review.

**Headers:**

- `x-user-id`: Admin user ID (required)

**Response:** `200 OK`

```json
{
  "id": "review-id",
  "rating": 4,
  "comment": "Very informative",
  "status": "pending",
  "createdAt": "2025-12-04T10:00:00Z",
  "user": {
    "id": "user-id",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "publication": {
    "id": "pub-id",
    "title": "The Economist",
    "type": "magazine",
    "image": "https://..."
  }
}
```

**Error Responses:**

- `403 Forbidden`: User is not an admin
- `404 Not Found`: Review doesn't exist

---

### Approve/Reject Review (Admin)

**PATCH** `/api/admin/reviews/[id]`

Approve or reject a pending review.

**Headers:**

- `x-user-id`: Admin user ID (required)

**Request Body:**

```json
{
  "status": "approved"
}
```

**Status Options:**

- `approved`: Approve the review (updates publication rating)
- `rejected`: Reject the review

**Response:** `200 OK`

```json
{
  "id": "review-id",
  "rating": 4,
  "comment": "Very informative",
  "status": "approved",
  "createdAt": "2025-12-04T10:00:00Z",
  "updatedAt": "2025-12-04T11:00:00Z",
  "user": { ... },
  "publication": { ... }
}
```

**Side Effects:**

- When approved, recalculates the publication's average rating and review count

**Error Responses:**

- `400 Bad Request`: Invalid status value
- `403 Forbidden`: User is not an admin

---

## Orders API

### Create Order

**POST** `/api/orders`

Create a new order from cart items and apply points.

**Headers:**

- `x-user-id`: User ID (required)

**Request Body:**

```json
{
  "pointsToUse": 50
}
```

**Order Calculation:**

- Subtotal: Sum of all cart items
- Tax: 8.25% applied only to magazines
- Points: Deducted from total (1 point = $1)
- Points Earned: 1 point per dollar spent (rounded down)

**Response:** `201 Created`

```json
{
  "id": "order-id",
  "orderNumber": "ORD-1733323200-A1B2C3D4",
  "userId": "user-id",
  "subtotal": 100.0,
  "tax": 8.25,
  "pointsUsed": 50,
  "total": 58.25,
  "status": "completed",
  "createdAt": "2025-12-04T10:00:00Z",
  "orderItems": [
    {
      "id": "item-id",
      "quantity": 1,
      "price": 100.0,
      "publication": {
        "id": "pub-id",
        "title": "Forbes",
        "type": "magazine",
        "price": 100.0
      }
    }
  ]
}
```

**Side Effects:**

- Clears user's cart
- Deducts points used from user balance
- Awards new points based on purchase amount
- Creates order items for each cart item

**Error Responses:**

- `400 Bad Request`: Cart is empty or insufficient points
- `401 Unauthorized`: Not authenticated

---

### Get User Orders

**GET** `/api/orders`

Get all orders for the authenticated user.

**Headers:**

- `x-user-id`: User ID (required)

**Response:** `200 OK`

```json
[
  {
    "id": "order-id",
    "orderNumber": "ORD-1733323200-A1B2C3D4",
    "subtotal": 100.00,
    "tax": 8.25,
    "pointsUsed": 50,
    "total": 58.25,
    "status": "completed",
    "createdAt": "2025-12-04T10:00:00Z",
    "orderItems": [ ... ]
  }
]
```

---

### Get Single Order

**GET** `/api/orders/[id]`

Get details of a specific order.

**Headers:**

- `x-user-id`: User ID (required)

**Authorization:**

- Users can only view their own orders
- Admins can view any order

**Response:** `200 OK`

```json
{
  "id": "order-id",
  "orderNumber": "ORD-1733323200-A1B2C3D4",
  "subtotal": 100.00,
  "tax": 8.25,
  "pointsUsed": 50,
  "total": 58.25,
  "status": "completed",
  "createdAt": "2025-12-04T10:00:00Z",
  "orderItems": [
    {
      "id": "item-id",
      "quantity": 1,
      "price": 100.00,
      "publication": { ... }
    }
  ]
}
```

**Error Responses:**

- `403 Forbidden`: User trying to access another user's order
- `404 Not Found`: Order doesn't exist

---

## Admin Orders API

### Get All Orders (Admin)

**GET** `/api/admin/orders`

Get all orders in the system.

**Headers:**

- `x-user-id`: Admin user ID (required)

**Query Parameters:**

- `status` (optional): Filter by order status (pending/completed/cancelled)

**Response:** `200 OK`

```json
[
  {
    "id": "order-id",
    "orderNumber": "ORD-1733323200-A1B2C3D4",
    "subtotal": 100.0,
    "tax": 8.25,
    "pointsUsed": 50,
    "total": 58.25,
    "status": "completed",
    "createdAt": "2025-12-04T10:00:00Z",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "orderItems": [
      {
        "id": "item-id",
        "quantity": 1,
        "price": 100.0,
        "publication": {
          "id": "pub-id",
          "title": "Forbes",
          "type": "magazine",
          "price": 100.0
        }
      }
    ]
  }
]
```

**Error Response:**

- `403 Forbidden`: User is not an admin

---

## User API

### Get Current User

**GET** `/api/users/me`

Get information about the currently authenticated user.

**Headers:**

- `x-user-id`: User ID (required)

**Response:** `200 OK`

```json
{
  "id": "user-id",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "points": 150
}
```

**Error Response:**

- `401 Unauthorized`: Not authenticated

---

## Publications API

### Get All Publications

**GET** `/api/publications`

Get all publications with optional filtering.

**Query Parameters:**

- `type` (optional): Filter by type (magazine/newspaper)
- `category` (optional): Filter by category
- `city` (optional): Filter newspapers by city
- `featured` (optional): Filter by featured status (true/false)

**Response:** `200 OK`

```json
[
  {
    "id": "pub-id",
    "title": "The Economist",
    "type": "magazine",
    "description": "An international weekly newspaper...",
    "price": 189.99,
    "image": "https://...",
    "issuesPerYear": 51,
    "city": null,
    "category": "Business & Finance",
    "rating": 4.8,
    "reviewCount": 1247,
    "featured": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-12-04T10:00:00Z"
  }
]
```

---

### Get Single Publication

**GET** `/api/publications/[id]`

Get details of a specific publication.

**Response:** `200 OK`

```json
{
  "id": "pub-id",
  "title": "The Economist",
  "type": "magazine",
  "description": "An international weekly newspaper...",
  "price": 189.99,
  "image": "https://...",
  "issuesPerYear": 51,
  "city": null,
  "category": "Business & Finance",
  "rating": 4.8,
  "reviewCount": 1247,
  "featured": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-12-04T10:00:00Z"
}
```

**Error Response:**

- `404 Not Found`: Publication doesn't exist

---

## Database Schema

### User

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  name          String
  password      String
  role          String         @default("user") // 'user' or 'admin'
  points        Int            @default(0)
  pointsEarned  Int            @default(0)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  subscriptions Subscription[]
  reviews       Review[]
  cartItems     CartItem[]
  orders        Order[]
}
```

### Publication

```prisma
model Publication {
  id            String         @id @default(uuid())
  title         String
  type          String         // 'magazine' or 'newspaper'
  description   String
  price         Float
  image         String
  issuesPerYear Int?
  city          String?
  category      String
  rating        Float          @default(0)
  reviewCount   Int            @default(0)
  featured      Boolean        @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  subscriptions Subscription[]
  reviews       Review[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
}
```

### Review

```prisma
model Review {
  id            String      @id @default(uuid())
  userId        String
  publicationId String
  rating        Int
  comment       String
  status        String      @default("pending") // 'pending', 'approved', 'rejected'
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  publication   Publication @relation(fields: [publicationId], references: [id], onDelete: Cascade)
}
```

### Order

```prisma
model Order {
  id            String        @id @default(uuid())
  orderNumber   String        @unique
  userId        String
  subtotal      Float
  tax           Float         @default(0)
  pointsUsed    Int           @default(0)
  total         Float
  status        String        @default("completed") // 'pending', 'completed', 'cancelled'
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  orderItems    OrderItem[]
}
```

### OrderItem

```prisma
model OrderItem {
  id            String      @id @default(uuid())
  orderId       String
  publicationId String
  quantity      Int
  price         Float
  createdAt     DateTime    @default(now())
  order         Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  publication   Publication @relation(fields: [publicationId], references: [id], onDelete: Cascade)
}
```

---

## Business Logic

### Tax Calculation

- Tax rate: 8.25%
- Applied only to magazines
- Newspapers are tax-exempt

### Points System

- **Earning Points**: 1 point per dollar spent (rounded down)
  - Example: $58.25 purchase = 58 points earned
- **Using Points**: 1 point = $1 discount
  - Cannot use more points than order total
  - Cannot use more points than user has available
- **Points Display**: Points balance shown in user account dashboard

### Review Workflow

1. User purchases a publication
2. User can submit a review (rating + comment)
3. Review status is "pending" by default
4. Admin reviews and approves/rejects
5. Only approved reviews are publicly visible
6. When approved, publication rating is recalculated

### Order Number Format

`ORD-{timestamp}-{8-char-uuid}`

Example: `ORD-1733323200-A1B2C3D4`

---

## Admin Credentials

**Email:** `admin@readsphere.com`  
**Password:** `admin123`

**Test User:**  
**Email:** `test@example.com`  
**Password:** `test123`  
**Starting Points:** 100

---

## Error Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 200         | Success                              |
| 201         | Created                              |
| 400         | Bad Request - Invalid input          |
| 401         | Unauthorized - Not authenticated     |
| 403         | Forbidden - Insufficient permissions |
| 404         | Not Found - Resource doesn't exist   |
| 500         | Internal Server Error                |

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All monetary values are in USD
- Images are hosted on Unsplash
- Session/authentication is simulated via `x-user-id` header (in production, use JWT or session cookies)
