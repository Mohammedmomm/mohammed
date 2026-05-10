# Smart Health Tools 💊

A modern full-stack health tools website with **Age Calculator** and **BMI Calculator**, supporting **Arabic** and **English** with full RTL support.

## Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Frontend   | Next.js (React), Framer Motion, CSS     |
| Backend    | Node.js, Express.js                     |
| Database   | PostgreSQL                              |
| Auth       | JWT + bcrypt                            |
| Deploy     | Vercel (frontend) + any Node.js host    |

## Features

- ✅ Age Calculator (live counting with birthday celebration)
- ✅ BMI Calculator (color-coded progress bar + health tips)
- ✅ Arabic / English language toggle (RTL/LTR)
- ✅ Light / Dark mode
- ✅ JWT Authentication (register, login, profile)
- ✅ Calculation history saved to PostgreSQL
- ✅ SEO-optimized (meta, OG, Twitter tags, sitemap, robots.txt)
- ✅ Fully responsive — mobile friendly

---

## Project Structure

```
/
├── backend/              # Express.js API
│   ├── db/
│   │   ├── pool.js       # PostgreSQL connection pool
│   │   └── schema.sql    # Database schema
│   ├── middleware/
│   │   └── auth.js       # JWT middleware
│   ├── routes/
│   │   ├── auth.js       # Register, Login, Profile
│   │   └── history.js    # Save & get calculator history
│   ├── server.js
│   ├── vercel.json
│   └── .env.example
│
└── frontend/             # Next.js app
    ├── components/
    │   ├── Navbar.js
    │   └── Footer.js
    ├── context/
    │   ├── AuthContext.js
    │   ├── ThemeContext.js
    │   └── LangContext.js
    ├── pages/
    │   ├── index.js          # Landing page
    │   ├── login.js
    │   ├── register.js
    │   ├── dashboard.js
    │   ├── age-calculator.js
    │   └── bmi-calculator.js
    ├── styles/globals.css
    ├── utils/api.js
    └── .env.example
```

---

## Quick Start

### 1. Database Setup

Create a PostgreSQL database and run the schema:

```bash
psql -U your_user -d your_database -f backend/db/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, FRONTEND_URL
npm run dev          # runs on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev          # runs on http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@host:5432/health_tools
JWT_SECRET=change_this_to_a_long_random_string
PORT=5000
FRONTEND_URL=https://yourdomain.vercel.app
NODE_ENV=production
DATABASE_SSL=true        # set true if your DB requires SSL
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

---

## API Routes

| Method | Endpoint             | Auth | Description            |
|--------|----------------------|------|------------------------|
| POST   | /api/auth/register   | No   | Register a new user    |
| POST   | /api/auth/login      | No   | Login                  |
| GET    | /api/auth/profile    | Yes  | Get current user       |
| GET    | /api/history         | Yes  | Get calculation history|
| POST   | /api/history         | Yes  | Save a calculation     |
| DELETE | /api/history/:id     | Yes  | Delete a history item  |

---

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import the `frontend/` folder in [vercel.com](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url`
4. Deploy

### Backend → Vercel Serverless

1. Import the `backend/` folder in Vercel
2. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`
3. The `vercel.json` inside routes everything to `server.js`

### Backend → VPS / Your Own Machine

```bash
cd backend
npm install
NODE_ENV=production npm start
# Or with PM2:
pm2 start server.js --name health-api
```

### PostgreSQL on Your Own Machine

Run PostgreSQL locally and expose it with a public IP or use a tunnel.
Set `DATABASE_URL=postgresql://user:pass@your-public-ip:5432/health_tools`
and `DATABASE_SSL=false` in your backend `.env`.

---

## License

MIT
