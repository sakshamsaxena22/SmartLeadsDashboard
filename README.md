# 🚀 Smart Leads Dashboard

A full-stack **Lead Management Dashboard** built with the **MERN stack** (MongoDB, Express, React, Node.js) using **TypeScript** throughout.

## Tech Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Frontend  | React 19, TypeScript, TailwindCSS v4, Vite      |
| Backend   | Node.js, Express 4, TypeScript                   |
| Database  | MongoDB + Mongoose                               |
| Auth      | JWT (Access + Refresh Tokens, HTTP-only cookies)  |
| Forms     | React Hook Form + Zod (shared validation)        |
| State     | TanStack Query (server state), React Context     |
| Security  | Helmet, CORS, Rate Limiting, Mongo Sanitize      |
| Infra     | Docker, Docker Compose, Nginx                    |

## Features

- ✅ JWT Auth with refresh token rotation
- ✅ Role-Based Access Control (Admin / Sales)
- ✅ Lead CRUD with ownership checks
- ✅ MongoDB text-search filtering
- ✅ Pagination, sorting, and status/source filters
- ✅ CSV export (Admin only)
- ✅ Dark mode with system preference detection
- ✅ Responsive design with mobile sidebar
- ✅ Shared Zod validation (frontend ↔ backend)
- ✅ Containerized with Docker Compose

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
cd smart-leads-dashboard
cp .env.example .env      # Edit with your MongoDB URI and JWT secret

cd server && npm install
cd ../shared && npm install
cd ../client && npm install
```

### 2. Seed Demo Data

```bash
cd server
npm run seed
```

Demo accounts:
- **Admin:** `admin@smartleads.com` / `Admin@123`
- **Sales:** `sales@smartleads.com` / `Sales@123`

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Docker Compose (Production)

```bash
docker compose up --build
```

App available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
smart-leads-dashboard/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── api/            # Axios instances & API services
│       ├── components/     # UI primitives & lead components
│       ├── context/        # Auth & Theme context providers
│       ├── hooks/          # Custom hooks (useDebounce)
│       ├── pages/          # Route pages
│       └── types/          # Client type re-exports
├── server/                 # Express backend
│   └── src/
│       ├── config/         # Env, DB, Logger setup
│       ├── controllers/    # Thin route handlers
│       ├── middleware/      # Auth, RBAC, Validation, Security, Error
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express route definitions
│       ├── seed/            # Database seeder
│       ├── services/        # Business logic layer
│       └── utils/           # Token, CSV, API response helpers
├── shared/                 # Shared types & Zod validators
│   ├── types/
│   └── validators/
├── Dockerfile.client
├── Dockerfile.server
├── docker-compose.yml
└── nginx.conf
```

## RBAC Permission Matrix

| Action         | Admin | Sales |
| -------------- | ----- | ----- |
| View all leads | ✅    | ❌ (own only) |
| Create lead    | ✅    | ✅    |
| Edit lead      | ✅    | ✅ (own only) |
| Delete lead    | ✅    | ❌    |
| Export CSV     | ✅    | ❌    |

## API Endpoints

| Method | Endpoint               | Auth | Description           |
| ------ | ---------------------- | ---- | --------------------- |
| POST   | /api/v1/auth/register  | No   | User registration     |
| POST   | /api/v1/auth/login     | No   | User login            |
| POST   | /api/v1/auth/refresh   | No   | Refresh access token  |
| POST   | /api/v1/auth/logout    | No   | Clear refresh cookie  |
| GET    | /api/v1/auth/me        | Yes  | Get current user      |
| GET    | /api/v1/leads          | Yes  | List leads (paginated)|
| GET    | /api/v1/leads/export   | Admin| Export CSV             |
| GET    | /api/v1/leads/:id      | Yes  | Get single lead       |
| POST   | /api/v1/leads          | Yes  | Create lead           |
| PUT    | /api/v1/leads/:id      | Yes  | Update lead           |
| DELETE | /api/v1/leads/:id      | Admin| Delete lead           |

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your-secret-key-must-be-at-least-32-characters-long
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```
