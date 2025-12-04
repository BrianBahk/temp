# ReadSphere Testing Guide

## 🚀 Application is now running at: http://localhost:3000

## ✅ Pre-Test Checklist

- [x] PostgreSQL is running
- [x] Database is seeded with test data
- [x] Next.js dev server is running on port 3000
- [x] All API endpoints are created
- [x] All UI components are built

## 🧪 Test Scenarios

### 1. User Registration & Authentication

#### Test User Accounts (Pre-seeded):

- **Admin Account**

  - Email: `admin@readsphere.com`
  - Password: `admin123`
  - Role: Admin
  - Points: 0

- **Test User Account**
  - Email: `test@example.com`
  - Password: `test123`
  - Role: User
  - Starting Points: 100

#### Testing Steps:

1. ✅ Visit http://localhost:3000
2. ✅ Click "Sign In"
3. ✅ Try logging in with test user credentials
4. ✅ Verify points display in header (should show 100 points)
5. ✅ Click on "Account" to view dashboard

### 2. Browse & Filter Publications

#### Testing Steps:

1. ✅ Go to "Catalog" page
2. ✅ Verify 13 publications are displayed
3. ✅ Test filters:
   - Type filter: All / Magazines / Newspapers
   - Category filter: All / Business & Finance / Science & Nature / etc.
4. ✅ When "Newspapers" is selected, verify City filter appears
5. ✅ Test city filter with: New York, Washington D.C., Chicago, Los Angeles, Boston, San Francisco
6. ✅ Test search functionality
7. ✅ Click on a publication to view details

### 3. Publication Detail Page

#### Testing Steps:

1. ✅ Click on any publication from catalog
2. ✅ Verify pricing information:
   - Subtotal
   - Tax (8.25% for magazines, $0.00 for newspapers)
   - Total
3. ✅ Verify points earning display
4. ✅ Click "Add to Cart"
5. ✅ Verify "Added to Cart" button state
6. ✅ Scroll down to Reviews section
7. ✅ If not logged in: See "Sign in to leave a review"
8. ✅ If logged in but not purchased: See "Purchase this publication to leave a review"
9. ✅ If purchased: See review form with star rating and comment textarea

### 4. Shopping Cart & Checkout

#### Testing Steps:

1. ✅ Add multiple publications to cart (mix of magazines and newspapers)
2. ✅ Click cart icon in header
3. ✅ Verify cart summary:
   - Subtotal
   - Tax (8.25% only on magazines)
   - Shipping: Free
   - Total
4. ✅ Points redemption (if logged in with points):
   - Enter points in "Use Points" field
   - Click "Max" button to use maximum available
   - Verify total updates with points deduction
5. ✅ Verify "You'll earn X points from this purchase" message
6. ✅ Click "Complete Purchase"
7. ✅ Verify success toast with order confirmation
8. ✅ Verify cart is cleared

### 5. Account Dashboard

#### Testing Steps:

1. ✅ After purchase, go to "Account" page
2. ✅ Verify tabs: Subscriptions / Purchase History
3. ✅ Click "Purchase History" tab
4. ✅ Verify order appears with:
   - Order number (format: ORD-{timestamp}-{UUID})
   - Date
   - Items purchased
   - Total amount
   - Points used (if any)
5. ✅ Verify points balance updated:
   - Points deducted if used
   - Points earned from purchase added
6. ✅ Check "Quick Stats" sidebar:
   - Available Points
   - Points Earned (total lifetime)

### 6. Leave a Review

#### Testing Steps:

1. ✅ Go to a publication you purchased
2. ✅ Scroll to Reviews section
3. ✅ Verify review form is visible
4. ✅ Select a star rating (1-5)
5. ✅ Write a comment
6. ✅ Click "Submit Review"
7. ✅ Verify success message: "Review submitted! It will be visible after admin approval."
8. ✅ Refresh page
9. ✅ Verify message changes to "You have already submitted a review"

### 7. Admin Dashboard

#### Testing Steps:

1. ✅ Sign out and sign in with admin account
2. ✅ Go to http://localhost:3000/admin
3. ✅ Verify admin dashboard displays:
   - Total Revenue
   - Total Orders
   - Pending Reviews
   - Total Users
4. ✅ Verify Quick Actions cards:
   - Review Management
   - Order Management
   - User Management

### 8. Admin: Review Management

#### Testing Steps:

1. ✅ From admin dashboard, click "View Pending Reviews"
2. ✅ Verify tabs: Pending / Approved / Rejected
3. ✅ Verify pending reviews show:
   - Publication image and title
   - User name and email
   - Star rating
   - Comment
   - Date submitted
4. ✅ Click "Approve" on a review
5. ✅ Verify success toast
6. ✅ Verify review moves to "Approved" tab
7. ✅ Go back to publication detail page (as regular user)
8. ✅ Verify approved review now appears in reviews list
9. ✅ Verify publication rating updated

### 9. Admin: Order Management

#### Testing Steps:

1. ✅ From admin dashboard, click "View All Orders"
2. ✅ Verify all orders display:
   - Order number
   - Date and time
   - Customer name and email
   - Order items with quantities
   - Subtotal, tax, points used, total
3. ✅ Verify order status badge (Completed/Pending/Cancelled)
4. ✅ Verify detailed breakdown of each order

### 10. Admin: User Management

#### Testing Steps:

1. ✅ From admin dashboard, click "View All Users"
2. ✅ Verify user list shows:
   - Name and email
   - Role badge (Admin or User)
   - Join date
   - Current points
   - Total orders count
   - Total reviews count
   - Total points earned
3. ✅ Test search functionality by name or email
4. ✅ Verify summary stats at bottom:
   - Total Users
   - Admins count
   - Regular Users count
   - Total Points Earned

### 11. Points System Validation

#### Test Points Earning:

1. ✅ Start with known points balance (e.g., 100)
2. ✅ Make a purchase of $58.25
3. ✅ Don't use any points
4. ✅ Verify you earn 58 points (rounded down)
5. ✅ New balance should be: 100 + 58 = 158 points

#### Test Points Usage:

1. ✅ Start with 158 points
2. ✅ Add $50 item to cart
3. ✅ Use 30 points in checkout
4. ✅ Total should be: $50 - $30 = $20
5. ✅ Points earned from $20 purchase = 20 points
6. ✅ New balance: 158 - 30 + 20 = 148 points

#### Edge Cases:

1. ✅ Try to use more points than available (should show error)
2. ✅ Try to use more points than order total (should auto-cap at max)
3. ✅ Use "Max" button to apply maximum points

### 12. Tax Calculation Validation

#### Test Magazine Tax:

1. ✅ Add magazine priced at $100.00
2. ✅ Go to cart
3. ✅ Verify:
   - Subtotal: $100.00
   - Tax: $8.25 (8.25%)
   - Total: $108.25

#### Test Newspaper No Tax:

1. ✅ Add newspaper priced at $15.99
2. ✅ Go to cart
3. ✅ Verify:
   - Subtotal: $15.99
   - Tax: $0.00
   - Total: $15.99

#### Test Mixed Cart:

1. ✅ Add 1 magazine ($100) + 1 newspaper ($15.99)
2. ✅ Verify:
   - Subtotal: $115.99
   - Tax: $8.25 (only on magazine)
   - Total: $124.24

## 🔧 API Endpoints to Test (Optional - Manual Testing)

### Using curl or Postman:

```bash
# Note: Replace {user-id} with actual user ID from database
# For testing, use test user ID or admin ID

# Get all publications
curl http://localhost:3000/api/publications

# Get single publication
curl http://localhost:3000/api/publications/1

# Get reviews for a publication
curl "http://localhost:3000/api/reviews?publicationId=1&status=approved"

# Submit a review (authenticated)
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "x-user-id: {user-id}" \
  -d '{"publicationId":"1","rating":5,"comment":"Great publication!"}'

# Create an order (authenticated)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "x-user-id: {user-id}" \
  -d '{"pointsToUse":50}'

# Get user orders (authenticated)
curl http://localhost:3000/api/orders \
  -H "x-user-id: {user-id}"

# Admin: Get all reviews (admin only)
curl http://localhost:3000/api/admin/reviews?status=pending \
  -H "x-user-id: {admin-id}"

# Admin: Approve review (admin only)
curl -X PATCH http://localhost:3000/api/admin/reviews/{review-id} \
  -H "Content-Type: application/json" \
  -H "x-user-id: {admin-id}" \
  -d '{"status":"approved"}'

# Admin: Get all orders (admin only)
curl http://localhost:3000/api/admin/orders \
  -H "x-user-id: {admin-id}"

# Admin: Get all users (admin only)
curl http://localhost:3000/api/admin/users \
  -H "x-user-id: {admin-id}"
```

## 📊 Database Verification

### Check database directly:

```bash
# Connect to database
psql -d readsphere

# View all users
SELECT id, email, name, role, points, "pointsEarned" FROM "User";

# View all publications
SELECT id, title, type, price, city, category FROM "Publication";

# View all orders
SELECT "orderNumber", "userId", subtotal, tax, "pointsUsed", total, status FROM "Order";

# View all reviews
SELECT id, rating, comment, status, "userId", "publicationId" FROM "Review";

# Exit
\q
```

## 🎯 Expected Outcomes

### All Features Working:

- ✅ User authentication (login/logout)
- ✅ Browse and filter publications (by type, category, city)
- ✅ Add items to cart
- ✅ Tax calculation (8.25% on magazines only)
- ✅ Points redemption in checkout
- ✅ Points earning after purchase
- ✅ Order number generation
- ✅ Purchase history with order numbers
- ✅ Review submission (only for purchased items)
- ✅ Review approval workflow (admin)
- ✅ Admin dashboard with statistics
- ✅ Admin review management
- ✅ Admin order management
- ✅ Admin user management

## 🐛 Known Limitations

1. **Authentication**: Currently using simulated authentication via `x-user-id` header in the frontend. In production, this should use JWT tokens or session cookies.

2. **Real-time Updates**: Reviews and orders require page refresh to see updates.

3. **Image Uploads**: All images are from Unsplash URLs, no image upload functionality.

4. **Payment Processing**: No actual payment integration (Stripe, PayPal, etc.).

5. **Email Notifications**: No email notifications for order confirmations or review approvals.

## 🎉 Success Criteria

The application is fully functional when:

1. ✅ All pages load without errors
2. ✅ Users can browse, filter, and purchase publications
3. ✅ Tax is correctly calculated (8.25% on magazines only)
4. ✅ Points system works (earning and redemption)
5. ✅ Orders generate unique order numbers
6. ✅ Users can review purchased items
7. ✅ Admins can approve/reject reviews
8. ✅ Admins can view all orders and users
9. ✅ Database persists all data correctly

## 📝 Testing Notes

- Use Chrome DevTools to monitor network requests
- Check Console for any JavaScript errors
- Verify all API calls return expected status codes
- Test on different screen sizes (mobile/tablet/desktop)
- Test edge cases (empty cart, no points, etc.)

---

**Ready to test? Start at: http://localhost:3000** 🚀
