# FoodieAI Backend — Setup Guide

## ১. Install Dependencies

```bash
cd backend
npm install
```

## ২. Environment Variables সেট করো

`.env.example` ফাইলটা কপি করে `.env` নামে রাখো:

```bash
cp .env.example .env
```

তারপর `.env` ফাইলে এই ৪টা মান বসাও:

```
MONGODB_URI=mongodb+srv://foodie-ai:<তোমার-নতুন-পাসওয়ার্ড>@cluster0.fkciokq.mongodb.net/foodieai?retryWrites=true&w=majority&appName=Cluster0
CLERK_SECRET_KEY=তোমার Clerk Secret Key (frontend এ যেটা ব্যবহার করেছো)
ANTHROPIC_API_KEY=তোমার Anthropic API key
FRONTEND_URL=http://localhost:3000
```

## ৩. Server চালাও

```bash
npm run dev
```

সফল হলে দেখবে:
```
MongoDB connected: cluster0-shard-xx.mongodb.net
FoodieAI backend running on http://localhost:5000
```

## ৪. Test করো

ব্রাউজারে যাও: http://localhost:5000/health

এরকম দেখাবে: `{"status":"ok","timestamp":"..."}`

## ৫. Sample Data যোগ করো (Optional)

```bash
npm run seed
```

এটা ২টা রেস্টুরেন্ট আর ২টা খাবার আইটেম MongoDB তে যোগ করবে, টেস্ট করার জন্য।

## ৬. Frontend এর সাথে কানেক্ট করো

তোমার `frontend/.env.local` ফাইলে নিশ্চিত করো এটা আছে:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## API Routes List

```
GET    /api/v1/foods              - সব food দেখাবে (search, filter, sort, page সহ)
GET    /api/v1/foods/:id          - নির্দিষ্ট food এর বিস্তারিত
GET    /api/v1/restaurants        - সব restaurant দেখাবে
GET    /api/v1/restaurants/:id    - নির্দিষ্ট restaurant
POST   /api/v1/orders             - Order place করা (customer only)
GET    /api/v1/orders             - নিজের orders দেখা (role অনুযায়ী automatic filter)
PATCH  /api/v1/orders/:id/status  - Order status update (restaurant/admin)
GET    /api/v1/users/profile      - নিজের profile
PUT    /api/v1/users/profile      - Profile update
GET    /api/v1/users              - সব user (admin only)
GET    /api/v1/dashboard/customer - Customer dashboard stats
GET    /api/v1/dashboard/restaurant - Restaurant dashboard stats
GET    /api/v1/dashboard/admin    - Admin dashboard stats
POST   /api/v1/ai/chat            - AI Chat Assistant
POST   /api/v1/ai/generate-description - AI Food Description Generator
POST   /api/v1/auth/sync          - Login এর পর Clerk user কে MongoDB তে sync করা
```

## Role-Based Access কীভাবে কাজ করে

প্রতিটা User MongoDB তে একটা `role` ফিল্ড পায় (`customer`, `restaurant_owner`, বা `admin`)। 
যখন কেউ প্রথমবার লগইন করে, `/api/v1/auth/sync` কল হয়ে তাকে ডিফল্ট `customer` role এ MongoDB তে সেভ করে।

Admin manually কাউকে `restaurant_owner` বা `admin` বানাতে পারবে 
`PATCH /api/v1/users/:id/role` route দিয়ে।

`requireRole()` middleware প্রতিটা protected route এ চেক করে — 
ভুল role দিয়ে access করতে চাইলে 403 error দেবে।
