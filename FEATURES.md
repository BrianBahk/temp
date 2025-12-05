# ReadSphere - Magazine & Newspaper Subscription System

A comprehensive full-stack subscription management platform built with React, TypeScript, and Tailwind CSS. The system enables users to purchase magazine and newspaper subscriptions, earn reward points, submit reviews, and manage their accounts.

## Implemented Features

### 1. ✅ Purchase Magazine Subscriptions
- Search and browse magazine catalog with filtering
- Sort by: title, price, issues per year, and points awarded
- Add multiple magazines to cart
- Tax calculation: 8.25% applied to magazine prices
- Automatic order and subscription number generation
- Points earned: 10% of pre-tax price
- Free shipping

**Location:** `/catalog` → Select magazines → `/cart` → Complete Purchase

### 2. ✅ Purchase Newspaper Subscriptions
- Search and browse newspaper catalog with filtering
- Sort by: title, city, price, and points awarded
- Add multiple newspapers to cart
- No tax charged (city taxes handled separately)
- Automatic order and subscription number generation
- Points earned: 20% of price
- Free shipping

**Location:** `/catalog` → Select newspapers → `/cart` → Complete Purchase

### 3. ✅ Create User Account
- Multi-step signup form (3 steps)
- Collect: First name, Last name, Middle initial, Email, Address, Credit card info
- Username and password creation
- Admin account support
- Account validation and data persistence

**Location:** `/signup`

**Demo Accounts:**
- User: `demo` / Password: `demo`
- Admin: `admin` / Password: `admin`

### 4. ✅ Manage User Account
- View and edit account profile (all fields except username)
- Display: name, email, address, account type (user/admin)
- View accumulated points
- View active and cancelled subscriptions
- View submitted reviews and their status
- Credit card information display (partially masked)

**Location:** `/account`

### 5. ✅ Cancel a Subscription
- Pro-rated refund calculation based on:
  - Current date vs subscription start date
  - Subscription end date
  - Issues per year (magazines) or 365 (newspapers)
- Automatic points refund to user account
- Cannot cancel subscriptions paid entirely with points
- Displays refund amount to user

**Refund Formula:**
```
remainingDays = (endDate - currentDate) / issuesPerYear
refundAmount = (remainingDays / issuesPerYear) * originalPrice
```

**Location:** `/account` → Active Subscriptions → Cancel button

### 6. ✅ Accumulate Points
- Magazines: 10% of pre-tax price as points
- Newspapers: 20% of price as points
- Points awarded immediately upon purchase
- Points displayed in account dashboard
- Calculation: `Math.floor(price * rate * 100)`

**Location:** `/account` → Points display in sidebar

### 7. ✅ Redeem Points
- 100 points = $1 USD
- Three payment methods in cart:
  - **Credit Card Only:** Standard card payment
  - **Points Only:** Requires sufficient points balance
  - **Mixed Payment:** Use points + card for balance
- Real-time calculation of card amount needed
- Validation ensures user has sufficient points

**Location:** `/cart` → Order Summary → Payment Method selection

### 8. ✅ Submit Reviews
- Multi-field review submission form
- Fields: Subscription ID, Issue number, Publication date, Article name, Author last name, Content
- Validation:
  - Minimum 50 words
  - Minimum 5 sentences
  - Publication date within last 30 days
- Automatic word/sentence counting
- Reviews submitted in "pending" status
- Eligible for 200 points if approved

**Location:** `/submit-review` (linked from `/account`)

### 9. ✅ Qualify Reviews (Admin Only)
- Admin-only management interface
- View all submissions in three tabs: Pending, Approved, Rejected
- Review quality checklist display
- Approve reviews that meet requirements (50+ words, 5+ sentences)
- Reject with reason
- Award 200 points for approved reviews
- Cannot approve substandard reviews (disabled button)

**Location:** `/admin-reviews` (Admin account required)

## User Interface Features

### Navigation & Layout
- Responsive header with authentication state
- Navigation links to catalog, cart, and account
- Mobile-friendly sidebar menu
- Clean, modern design with Tailwind CSS

### Shopping Experience
- Publication grid with search and filtering
- Multi-select sorting options
- Quick-add to cart functionality
- Visual cart summary with real-time calculations
- Order summary with tax/shipping breakdown

### Account Management
- Profile editing with form validation
- Subscription management with status indicators
- Review history with approval status
- Points balance display with usage info
- Admin panel access for admins

## Technical Architecture

### Frontend Stack
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Sonner for toast notifications
- Lucide React for icons

### State Management
- React Context for Authentication (AuthContext)
- React Context for Shopping Cart (CartContext)
- Component-level state with useState

### Key Components
```
src/
├── pages/
│   ├── Index.tsx                 # Home page
│   ├── Catalog.tsx               # Browse & sort publications
│   ├── PublicationDetail.tsx      # Publication details
│   ├── Cart.tsx                  # Shopping cart & checkout
│   ├── Login.tsx                 # User authentication
│   ├── Signup.tsx                # Account creation
│   ├── Account.tsx               # User profile & subscriptions
│   ├── SubmitReview.tsx          # Review submission
│   ├── AdminReviews.tsx          # Admin review management
│   └── NotFound.tsx              # 404 page
├── contexts/
│   ├── AuthContext.tsx           # Authentication state
│   └── CartContext.tsx           # Shopping cart state
├── types/
│   └── index.ts                  # TypeScript interfaces
└── components/
    ├── layout/
    ├── publications/
    └── ui/
```

### Data Models

**User:**
```typescript
{
  id: string;
  username: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  address: string;
  creditCard: CreditCard;
  points: number;
  subscriptions: Subscription[];
  reviews: Review[];
  role: 'user' | 'admin';
}
```

**Subscription:**
```typescript
{
  id: string;
  subscriptionNumber: string;
  publicationId: string;
  publicationTitle: string;
  type: 'magazine' | 'newspaper';
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
  orderNumber: string;
  price: number;
  issuesPerYear: number;
  pointsAwarded: number;
  paidWithPoints: boolean;
  refundAmount?: number;
}
```

**Review:**
```typescript
{
  id: string;
  userId: string;
  subscriptionId: string;
  issueNumber: number;
  publicationDate: string;
  articleName: string;
  authorLastName: string;
  content: string;
  wordCount: number;
  sentenceCount: number;
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  submittedDate: string;
  rejectionReason?: string;
}
```

## Calculation Rules

### Tax Calculation
- **Magazines:** 8.25% of base price
- **Newspapers:** 0% (city taxes assumed)

### Points Calculation
- **Magazines:** 10% of pre-tax price × 100 (integer)
- **Newspapers:** 20% of price × 100 (integer)
- **Points to Currency:** 100 points = $1.00

### Refund Calculation (Pro-rated)
```
totalDays = endDate - startDate
usedDays = currentDate - startDate
remainingDays = totalDays - usedDays
dailyRate = price / issuesPerYear
refundAmount = (remainingDays / issuesPerYear) * price
```

## How to Use

### 1. User Registration
```
Navigate to /signup
Fill in 3-step form:
- Step 1: Personal info (name, email)
- Step 2: Address & payment info
- Step 3: Login credentials
Submit to create account
```

### 2. Browse & Purchase
```
Navigate to /catalog
- Search by title or description
- Filter by type (magazine/newspaper) and category
- Sort by title, price, issues/year, or points
- Click to add items to cart
- Review order summary
- Select payment method (card/points/mixed)
- Complete purchase
```

### 3. Manage Account
```
Navigate to /account
- View account details
- Edit profile (except username)
- View available points
- Manage subscriptions (view/cancel)
- Submit reviews
- View review status
```

### 4. Submit Reviews
```
Navigate to /account → Submit Review button
OR directly to /submit-review
- Select subscription
- Enter issue details
- Write review (50+ words, 5+ sentences)
- Must be within 30 days of publication
- Submit for admin approval
```

### 5. Admin Functions
```
Admin account required (admin/admin)
Navigate to /account → Manage Reviews button
OR directly to /admin-reviews
- View pending reviews
- Check quality metrics (word count, sentences)
- Approve/reject with reasons
- Approved reviews award 200 points
```

## Key Features Summary

| Feature | Magazine | Newspaper | Notes |
|---------|----------|-----------|-------|
| Tax Rate | 8.25% | 0% | Included in price |
| Points Rate | 10% | 20% | Of pre-tax/base price |
| Issues/Year | Variable | 365 | Used for pro-rating |
| Sorting | Title, Price, Issues, Points | Title, City, Price, Points | Dynamic filters |
| Refund | Pro-rated | Pro-rated (365 issues) | Based on days used |
| Points Payment | Yes | Yes | 100 points = $1 |
| Review Submission | Yes | Yes | Same process for both |

## Future Enhancements

1. Backend API integration with database persistence
2. Real payment processing (Stripe/PayPal)
3. Email notifications for orders and reviews
4. Advanced admin analytics dashboard
5. Subscription renewal automation
6. Digital delivery of publications
7. Social sharing of reviews
8. Subscription recommendations engine
9. Mobile app version
10. Multi-language support

## Demo Workflow

1. **Login** with `demo`/`demo`
2. **Browse** catalog with sorting options
3. **Add** magazines and newspapers to cart
4. **Choose** payment method (points, card, or mixed)
5. **Complete** purchase to get order/subscription numbers
6. **View** account with subscriptions and points
7. **Submit** a review for approval
8. **Login as Admin** with `admin`/`admin`
9. **Approve** or reject reviews in admin panel
10. **Cancel** subscriptions to see pro-rated refunds

---

**Built for CS 373 Software Engineering Course**
Final Project Implementation
