# Smart Leads Dashboard — Build Walkthrough

## What Was Built

A production-grade **Lead Management Dashboard** using the full MERN stack with TypeScript throughout. The app features JWT authentication with refresh tokens, role-based access control, MongoDB text-search, paginated CRUD, CSV export, and a responsive dark-mode UI.

---

## Architecture

```
smart-leads-dashboard/
├── shared/              # Types + Zod validators (consumed by both client & server)
│   ├── types/           # ILead, IUser, ApiResponse, enums
│   └── validators/      # registerSchema, loginSchema, createLeadSchema, etc.
├── server/              # Express API with TypeScript
│   └── src/
│       ├── config/      # env.ts (Zod validation), db.ts, logger.ts
│       ├── middleware/   # auth, role, validate, security, error
│       ├── models/       # User.model.ts, Lead.model.ts
│       ├── services/     # auth.service.ts, lead.service.ts
│       ├── controllers/  # Thin handlers calling services
│       ├── routes/       # auth, lead, health routes
│       ├── seed/         # Demo data seeder
│       └── utils/        # token.ts, csv.ts, apiResponse.ts
├── client/              # React + Vite + TailwindCSS v4
│   └── src/
│       ├── api/          # Axios instance + API services
│       ├── context/      # AuthContext, ThemeContext
│       ├── components/   # ui/ (Button, Input, etc.) + leads/ + layout/
│       ├── pages/        # Login, Register, Dashboard, LeadDetail, 404
│       ├── hooks/        # useDebounce
│       └── types/        # Re-exports from shared/
├── Dockerfile.client     # Multi-stage: Vite → Nginx
├── Dockerfile.server     # Multi-stage: TSC → Node
├── docker-compose.yml    # MongoDB + Server + Client
└── nginx.conf            # SPA routing + API proxy
```

---

## Key Design Decisions

### 1. Shared Type System
Types and Zod validation schemas live in `shared/` and are imported by **both** client and server. This ensures:
- API request/response shapes are always in sync
- Form validation rules match backend validation exactly
- Single source of truth for enums (LeadStatus, LeadSource, UserRole)

### 2. JWT Refresh Token Flow
- **Access tokens** (15min) sent in `Authorization` header
- **Refresh tokens** (7d) stored in HTTP-only secure cookies
- Axios interceptor automatically retries failed requests with refreshed tokens
- Queue mechanism prevents parallel refresh calls

### 3. RBAC Ownership Model
- **Admin**: Full access to all leads, CSV export, delete
- **Sales**: Can only view/edit their own leads (enforced at service layer with `createdBy` checks)

### 4. Zod + React Hook Form Integration
Used `z.input<T>` for form values (pre-defaults) and `z.output<T>` for submission (post-defaults) to correctly bridge Zod's default-value transforms with React Hook Form's type system.

---

## Verification Results

| Check | Result |
|-------|--------|
| Server `tsc --noEmit` | ✅ Clean |
| Client `tsc --noEmit` | ✅ Clean |
| Client dev server boots | ✅ Running on :5173 |
| Login page renders | ✅ See screenshot below |

![Login Page](file:///C:/Users/saksh/.gemini/antigravity/brain/4d5e6551-f5d8-4707-836c-9d6cfed576ba/login_page_verification_1778945060275.png)

---

## How to Run

```bash
# 1. Install dependencies
cd server && npm install
cd ../shared && npm install
cd ../client && npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Seed demo data
cd server && npm run seed

# 4. Run dev servers
cd server && npm run dev     # Terminal 1
cd client && npm run dev     # Terminal 2
```

**Demo accounts**: `admin@smartleads.com` / `Admin@123` and `sales@smartleads.com` / `Sales@123`

---

## Remaining Steps

The following require a running MongoDB instance:
1. Start backend server (`npm run dev` in `server/`)
2. Run seed script (`npm run seed`)
3. Full end-to-end testing (auth flow, CRUD, RBAC, CSV export)
4. Git init + conventional commits
5. Deploy (Frontend → Vercel, Backend → Render, DB → MongoDB Atlas)
