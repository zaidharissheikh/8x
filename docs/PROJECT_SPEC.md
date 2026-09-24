# Amazon Clone Project Specification

## 1. Feature List
- **Phase 1 (Foundation & Auth):** Global layout (header, footer, nav), Authentication (NextAuth, email/password credentials, optional Google OAuth), Home Page (hero carousel, product categories, recommended rails).
- **Phase 2 (Catalog & Cart):** Search functionality (filters, sort, pagination, autosuggest), Category pages, Product detail page (gallery, stock-aware buy box, reviews summary), Cart (client state, sync with DB/localstorage, quantity, delete).
- **Phase 3 (Checkout):** Address management, Shipping options, Stripe test payments, Order confirmation, Order history.
- **Phase 4 (Reviews & Account):** User reviews, Wishlist, User profile settings.
- **Phase 5 (Admin):** Admin dashboard for products, orders, inventory.
- **Phase 6 (Polish):** Accessibility, performance, tests, deployment readiness.

## 2. Data Model (Prisma)
- **User:** id, name, email (unique), passwordHash, image, role (USER|ADMIN), createdAt
- **Address:** id, userId, fullName, phone, line1, line2, city, state, postalCode, country, isDefault
- **Category:** id, name, slug (unique), parentId
- **Product:** id, title, slug (unique), description, bullets (String[]), brand, price (Decimal), listPrice (Decimal?), stock (Int), images (String[]), categoryId, ratingAvg (Float), ratingCount (Int), isPrime (Boolean), createdAt
- **Cart:** id, userId (unique)
- **CartItem:** id, cartId, productId, quantity (Unique: cartId, productId)
- **Order:** id, userId, status (PENDING|PAID|SHIPPED|DELIVERED|CANCELLED), subtotal, tax, shipping, total, addressSnapshot (Json), paymentIntentId, createdAt
- **OrderItem:** id, orderId, productId, titleSnapshot, priceSnapshot, quantity
- **Review:** id, productId, userId, rating (1-5), title, body, createdAt (Unique: productId, userId)
- **WishlistItem:** id, userId, productId

## 3. Route Map
- `/` - Home
- `/s` - Search results
- `/category/[slug]` - Category products
- `/product/[slug]` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout (Protected)
- `/orders` - Order history (Protected)
- `/account` - Profile/Settings (Protected)
- `/auth/signin`, `/auth/register` - Authentication

## 4. Design Tokens (Amazon Style)
- **Colors:**
  - Header Bg: `#131921`
  - Secondary Nav Bg: `#232F3E`
  - Accent Orange: `#FF9900` / `#FEBD69`
  - CTA Primary (Yellow): `#FFD814`
  - CTA Secondary (Orange): `#FFA41C`
  - Links: `#007185` (hover `#C7511F`)
  - Price Red: `#B12704`
  - Page Bg: `#EAEDED`
- **Typography:**
  - Inter or system-ui, 14px base. Price formatting uses superscript for fractions.

## 5. Folder Structure
```
src/app/(shop)/...       storefront routes
src/app/(auth)/...       sign-in, register
src/app/api/...          route handlers
src/components/
  layout/
  product/
  cart/
  ui/
src/lib/
  db/
  auth/
  validators/
  utils/
  cart/
prisma/
  schema.prisma
  seed.ts
docs/
  PROJECT_SPEC.md
  PROGRESS.md
```
