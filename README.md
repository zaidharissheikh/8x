# Amazon Clone

A production-quality, pixel-faithful, fully functional e-commerce clone of the Amazon.com shopping experience, built as a university assignment.

## Features

This project covers a complete end-to-end shopping workflow:

- **Authentication:** Secure user login and registration.
- **Catalog Browsing:** Browse products with a UI/UX closely matching Amazon's layout, spacing, and interactions.
- **Search:** Functional product search.
- **Product Details:** Detailed product pages with images, pricing, and descriptions.
- **Cart Management:** Add to cart, update quantities, and remove items.
- **Checkout & Payment:** Simulated payment flow (test mode).
- **Orders:** Order history and tracking.
- **Reviews:** Product reviews and ratings.
- **Account Management:** User profile and settings.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + shadcn/ui primitives
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** Prisma

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g., Supabase)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd <repo-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   DATABASE_URL="your-postgresql-database-url"
   AUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```
   *(Note: You can generate an `AUTH_SECRET` using `openssl rand -base64 32` or `npx auth secret`)*

4. Sync your database schema and generate the Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Seed the database with dummy products:
   ```bash
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured to be deployed easily on Vercel.

1. Push your code to a GitHub repository.
2. Import the project into your Vercel dashboard.
3. Add your `DATABASE_URL` and `AUTH_SECRET` environment variables in Vercel.
4. Deploy! A `postinstall` script in `package.json` ensures the Prisma Client is generated during the Vercel build.
