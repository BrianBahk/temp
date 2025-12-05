# ReadSphere - Magazine & Newspaper Subscription Platform

A full-stack subscription management system built with React, TypeScript, Spring Boot, and PostgreSQL.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (navigation)
- Sonner (notifications)
- Lucide React (icons)

### Backend
- Spring Boot 3.3.4
- Java 17
- Maven
- Spring Data JPA
- Spring Security with JWT
- PostgreSQL driver

### Database
- PostgreSQL 16 (running in Docker)

## Architecture

- **Frontend**: Runs locally on port 5173/3000 (development server)
- **Backend**: Runs locally on port 8080 (Spring Boot)
- **Database**: Runs in Docker container on port 5432

## Features

1. **Purchase Magazine Subscriptions** - Browse and purchase magazines with sorting by title, price, issues, points
2. **Purchase Newspaper Subscriptions** - Browse and purchase newspapers with sorting by title, city, price, points
3. **Create User Account** - Multi-step registration with full profile data collection
4. **Manage User Account** - Edit profile information (except username)
5. **Cancel Subscription** - Cancel active subscriptions with pro-rated refunds
6. **Accumulate Points** - Earn points on purchases (10% for magazines, 20% for newspapers)
7. **Redeem Points** - Use points for payment (100 points = $1), supports mixed payments
8. **Submit Reviews** - Write reviews with validation (minimum 50 words, 5 sentences, within 30 days)
9. **Qualify Reviews** - Admin panel to approve/reject reviews with 200 points awarded for approved reviews

## Prerequisites

- Node.js (v16 or higher)
- Java 17
- Maven
- Docker & Docker Compose

## Getting Started

### 1. Start PostgreSQL Database

```bash
cd final
docker compose up -d postgres
```

This will start PostgreSQL in a Docker container with:
- Database name: `readsphere`
- Username: `postgres`
- Password: `postgres`
- Port: `5432`

### 2. Start Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

The backend will:
- Run on `http://localhost:8080`
- Create database tables automatically via Hibernate
- Seed demo data (users and publications)
- Enable JWT authentication
- Configure CORS for frontend

**Default Users:**
- Demo User: `demo` / `demo` (1000 points)
- Admin User: `admin` / `admin` (500 points)

### 3. Start Frontend (React)

```bash
# From the final directory
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)

### Users
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update profile (requires auth)
- `POST /api/users/points/add` - Add points (requires auth)
- `POST /api/users/points/subtract` - Subtract points (requires auth)

### Publications
- `GET /api/publications` - Get all publications
- `GET /api/publications/{id}` - Get publication by ID
- `GET /api/publications/type/{type}` - Get by type (magazine/newspaper)
- `GET /api/publications/featured` - Get featured publications
- `GET /api/publications/search?query=...` - Search publications

### Subscriptions
- `GET /api/subscriptions/user` - Get user subscriptions (requires auth)
- `POST /api/subscriptions/purchase` - Purchase subscription (requires auth)
- `DELETE /api/subscriptions/{id}/cancel` - Cancel subscription (requires auth)

### Reviews
- `GET /api/reviews/user` - Get user reviews (requires auth)
- `POST /api/reviews` - Submit review (requires auth)
- `GET /api/reviews/pending` - Get pending reviews (requires auth)
- `GET /api/reviews/approved` - Get approved reviews (requires auth)
- `GET /api/reviews/rejected` - Get rejected reviews (requires auth)
- `PUT /api/reviews/{id}/approve` - Approve review (requires auth)
- `PUT /api/reviews/{id}/reject` - Reject review with reason (requires auth)

### Admin
- `GET /api/admin/reviews/pending` - Get pending reviews (requires admin role)
- `GET /api/admin/reviews/approved` - Get approved reviews (requires admin role)
- `GET /api/admin/reviews/rejected` - Get rejected reviews (requires admin role)
- `PUT /api/admin/reviews/{id}/approve` - Approve review (requires admin role)
- `PUT /api/admin/reviews/{id}/reject` - Reject review (requires admin role)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Call `/api/auth/login` with username and password
2. Receive JWT token in response
3. Include token in `Authorization` header: `Bearer <token>`
4. Frontend stores token in localStorage

## Database Schema

### Tables
- `users` - User accounts with roles, points, credit card info
- `publications` - Magazines and newspapers
- `user_subscriptions` - Active, cancelled, and expired subscriptions
- `reviews` - User reviews with approval status

### Key Relationships
- User has many Subscriptions
- User has many Reviews
- Publication has many Subscriptions
- Publication has many Reviews
- Subscription has many Reviews

## Points System

### Earning Points
- Magazines: 10% of purchase price (e.g., $100 = 1000 points)
- Newspapers: 20% of purchase price (e.g., $50 = 1000 points)
- Approved Reviews: 200 points

### Redeeming Points
- 100 points = $1
- Can use full points, credit card, or mixed payment
- Points deducted when subscription is cancelled

## Tax Calculation
- Magazines: 8.25% tax
- Newspapers: 0% tax (newspapers are tax-exempt)

## Pro-Rated Refunds

When cancelling a subscription:
```
refundAmount = (remainingDays / totalDays) * originalPrice
```

Points earned from the subscription are also deducted.

## Review Validation

Reviews must meet these criteria:
- Minimum 50 words
- Minimum 5 sentences
- Submitted within 30 days of publication date
- Linked to an active subscription

## Development

### Build Frontend for Production
```bash
npm run build
```

### Build Backend JAR
```bash
cd backend
mvn clean package
```

### Run Backend JAR
```bash
java -jar target/backend-1.0.0.jar
```

### Check Database
```bash
docker exec -it readsphere-postgres psql -U postgres -d readsphere
```

## Environment Configuration

### Backend (application.properties)
- `spring.datasource.url` - PostgreSQL connection URL
- `spring.datasource.username` - Database username
- `spring.datasource.password` - Database password
- `jwt.secret` - JWT signing secret
- `jwt.expiration` - Token expiration time (default 24 hours)

### Frontend
- API calls are made to `http://localhost:8080/api`
- Can be configured in a `.env` file if needed

## Stopping Services

```bash
# Stop frontend (Ctrl+C in terminal)

# Stop backend (Ctrl+C in terminal)

# Stop and remove PostgreSQL container
docker compose down
```

## Troubleshooting

### Port Already in Use
- Frontend (5173): `lsof -ti:5173 | xargs kill -9`
- Backend (8080): `lsof -ti:8080 | xargs kill -9`
- Database (5432): Stop other PostgreSQL instances

### Database Connection Issues
- Ensure Docker is running
- Check PostgreSQL container: `docker ps`
- View logs: `docker logs readsphere-postgres`

### CORS Issues
- Backend is configured to allow `localhost:5173` and `localhost:3000`
- Check SecurityConfig.java for CORS configuration

### JWT Token Issues
- Token expires after 24 hours
- Clear localStorage and login again
- Check JWT secret key in application.properties

## Project Structure

```
final/
├── backend/
│   ├── src/main/java/com/readsphere/
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # Spring Data repositories
│   │   ├── service/        # Business logic
│   │   ├── controller/     # REST controllers
│   │   ├── security/       # JWT & Spring Security
│   │   ├── dto/            # Data transfer objects
│   │   └── config/         # Configuration & data seeder
│   └── pom.xml
├── src/
│   ├── pages/              # React pages
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts (Auth, Cart)
│   ├── types/              # TypeScript types
│   └── data/               # Static data
├── docker-compose.yml
├── init.sql
└── package.json
```

## License

This project is for educational purposes as part of CS 373 Software Engineering.
