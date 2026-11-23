# Creek Project — Camping Arroyito

A full-stack booking and management system for **Camping Arroyito**, a campground with rental lodges (cabañas) and tent sites. It has three parts:

- **Client site:** a public website where guests browse lodges, check availability, book a stay and manage their reservations.
- **Admin panel:** an internal dashboard where staff manage bookings, lodges, tents, payments, prices, employees and schedules.
- **REST API:** an Express + MongoDB backend shared by both frontends.

🌐 **Live site:** https://creek-project.vercel.app

---

## Features

### Guest site (`client/`)
- Landing page with the campground's services, activities and reviews
- Search for lodges by date range and number of guests
- Lodge detail pages with photos, capacity, services and an availability calendar
- Sign up / log in with email and password, or with **Google**
- Account page listing the user's past and upcoming bookings

### Admin panel (`admin/`)
- **Dashboard:** occupancy and revenue widgets, plus charts for reservations over time, reservations per lodge, average guests and average length of stay
- **Interactive campground map:** a grid of tent sites and lodges with tooltips, showing which spots are taken
- **Bookings:** create bookings, mark them active, completed or canceled, and browse booking history
- **Lodges:** create and edit lodges, upload photos, track lodge status history
- **Tents:** register tent guests by map position and view tent history
- **Accounting:** payments, deposits (*seña*), receipt uploads, refunds, payment status and comments
- **Prices:** prices by category, with price history by date
- **Employees and schedules:** employee records and a shift calendar (FullCalendar)
- **Notifications:** alerts for missing deposits and the day's check-outs

### Backend (`api/`)
- JWT authentication (sent as a `Bearer` token and an HTTP-only cookie) with three roles:
  - **public:** browse lodges, prices and availability
  - **guests:** book, view and cancel their own bookings
  - **staff (employees and admins):** bookings, tents, accounting, notifications
  - **admin only:** employees, prices, deleting users
- Google sign-in, with the Google ID token verified on the server
- Automatic emails (Nodemailer + Gmail) for booking confirmations, temporary passwords and cancellations
- A nightly cron job (03:00) that:
  - auto-cancels bookings whose deposit was never paid
  - creates notifications for pending deposits and today's check-outs
  - deletes old notifications
- Image uploads with Multer, stored on a persistent Render disk in production and in `api/public/uploads` locally

---

## Tech stack

| Layer | Technologies |
|---|---|
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer, Nodemailer, node-cron |
| Client | React 18, Vite, Tailwind CSS, MUI, React Router, Axios, `@react-oauth/google`, react-date-range |
| Admin | React 17 (Create React App), MUI + MUI X DataGrid, Recharts, FullCalendar, Sass, Axios |
| Testing | Node's built-in test runner (`node --test`), Supertest, Chai |
| CI/CD | GitHub Actions → Render (API) + Vercel (frontends) |

---

## Project structure

```
Creek_project/
├── index.js              # Express server entry point
├── api/
│   ├── controllers/      # Route handlers (bookings, lodges, accounting, auth, ...)
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   └── utils/            # JWT verification, cron jobs, email service, multer config
├── client/               # Guest-facing site (Vite + React)
├── admin/                # Staff dashboard (Create React App)
├── tests/                # API integration tests
└── .github/workflows/    # CI/CD pipeline
```

---

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or MongoDB Atlas), plus a second one for tests

### 1. Clone and install

```bash
git clone https://github.com/micavargas130/Creek_project.git
cd Creek_project

npm install --legacy-peer-deps          # backend
cd client && npm install && cd ..       # guest site
cd admin  && npm install && cd ..       # admin panel
```

### 2. Environment variables

Each app has a `.env.example` template. Copy it to `.env` and fill it in. `.env` files are git-ignored; never commit them.

```bash
cp .env.example .env
cp client/.env.example client/.env
cp admin/.env.example admin/.env
```

**Root `.env`** (backend):

| Variable | Description |
|---|---|
| `MONGO` | MongoDB connection string |
| `MONGO_TEST` | MongoDB connection string used when `NODE_ENV=test` |
| `JWT_KEY` | Secret used to sign login tokens (a long random string) |
| `PORT` | API port, e.g. `4000` |
| `EMAIL_USER` | Gmail account that sends booking emails (defaults to `arroyitocamping@gmail.com`) |
| `EMAIL_PASS` | Gmail [app password](https://support.google.com/accounts/answer/185833) for that account |
| `GOOGLE_CLIENT_ID` | *(optional)* Google OAuth client ID; defaults to the one used by the client site |

**`client/.env`**: `VITE_API_URL=http://localhost:4000`

**`admin/.env`**: `REACT_APP_API_URL=http://localhost:4000`

> If the frontend variables are not set, both frontends fall back to the production API on Render.

### 3. Run it locally

Run each part in its own terminal:

```bash
# Backend (nodemon)
npm start

# Guest site → http://localhost:5173
cd client && npm run dev

# Admin panel → http://localhost:3000
cd admin && npm start
```

> The API's CORS settings allow `localhost:3000`, `localhost:3001` and `localhost:5173`, so run the backend on a different port (for example `4000`).

---

## Running tests

The tests are API integration tests. They run against the database in `MONGO_TEST`, which must contain the base data (booking, lodge, payment and employee statuses; prices; the fixture lodges and user referenced in the tests). They need `JWT_KEY` set.

```bash
npm test                 # runs every suite in order
npm run test:bookings    # or run one suite: users, auth, accounting, employees, bookings, lodges, tents
```

> The test scripts use `NODE_ENV=test ...` syntax, so on Windows run them from Git Bash or WSL.

---

## API overview

| Base route | Purpose |
|---|---|
| `/register`, `/login`, `/login/google`, `/logout`, `/profile` | Authentication |
| `/user` | User management, password changes |
| `/bookings` | Create bookings and update their status (active / completed / canceled) |
| `/lodges` | Lodge CRUD, photos, availability and occupied dates |
| `/lodge_x_status` | Lodge status history |
| `/tents` | Tent guests and occupied map positions |
| `/accounting` | Payments, receipts, refunds, payment history |
| `/prices` | Prices by category and date |
| `/employees`, `/schedule` | Staff records and shifts |
| `/notifications` | Admin notifications |
| `/graphs` | Dashboard statistics |

---

## Deployment

Pushes to `master` or `production` trigger the [GitHub Actions pipeline](.github/workflows/github-actions.yml), which:

1. Installs dependencies and runs the test suite
2. Triggers a backend deploy on **Render** through a deploy hook
3. Deploys the frontends to **Vercel**: `master` deploys to production, and `production` creates a preview deployment

Required repository secrets: `MONGO_TEST`, `RENDER_DEPLOY_HOOK_URL`, `VERCEL_TOKEN`.

The backend on Render needs `MONGO`, `JWT_KEY`, `EMAIL_USER` and `EMAIL_PASS` set as environment variables in the Render dashboard.

---

## Author

**Micaela Vargas** — [@micavargas130](https://github.com/micavargas130)
