# Portfolio CMS — Full Stack Web Developer

A dynamic CMS-powered portfolio website built with **Next.js**, **Express.js**, **MongoDB Atlas**, and **React Query**.

**Never edit source code again.** Log into the admin dashboard to update projects, skills, services, testimonials, experience, and more. Changes reflect instantly on the live site — no redeployment needed.

---

## 📁 Project Structure

```
portfolio/
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/      # Admin dashboard pages
│   │   │   ├── globals.css # Global styles + Tailwind
│   │   │   ├── layout.js   # Root layout
│   │   │   ├── page.js     # Home page
│   │   │   └── providers.js # React Query + Theme providers
│   │   ├── components/
│   │   │   ├── sections/   # Portfolio sections (Hero, About, etc.)
│   │   │   └── admin/      # Admin CRUD component
│   │   ├── context/        # ThemeContext, AuthContext
│   │   ├── hooks/          # useApi (React Query hooks), useTypewriter
│   │   └── lib/            # Axios API client
│   ├── .env.local
│   └── package.json
│
└── backend/                # Express API
    ├── config/             # MongoDB + Cloudinary config
    ├── controllers/        # CRUD controllers for each model
    ├── middleware/          # Auth JWT, error handler, upload
    ├── models/             # Mongoose schemas (10 models)
    ├── routes/             # Express routes
    ├── .env.example
    ├── server.js
    ├── seed.js             # Database seed script
    └── package.json
```

---

## 🚀 Prerequisites

- **Node.js** v18+ 
- **npm** v9+
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account (free tier for image uploads)
- **Git**

---

## ⚙️ Step-by-Step Setup

### 1. Clone & Install Dependencies

```bash
# From the project root
cd portfolio

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and sign up/in
2. Create a **free M0 cluster**
3. Click **"Connect"** → **"Drivers"**
4. Copy the connection string: `mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`
5. Replace `<username>` and `<password>` with your database user credentials
6. Under **Network Access**, add your IP address (or `0.0.0.0/0` for development)

### 3. Set Up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com) and sign up/in
2. From the dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**

### 4. Configure Environment Variables

**Backend** (`backend/.env`):
```env
# Copy from .env.example
cp .env.example .env
```

Edit `.env` with your actual values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_random_jwt_secret_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourStrongPassword123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- **Admin user** (use the email/password from your `.env`)
- **6 sample projects**
- **27 skills** across 5 categories
- **7 services**
- **4 testimonials**
- **2 experience entries**
- **1 education entry**
- **3 certifications**
- **4 social links**
- **7 site settings**

### 6. Run Both Projects

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# API running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Website running at http://localhost:3000
```

---

## 🌐 API Endpoints

All public GET routes serve portfolio data. POST/PUT/DELETE routes require JWT auth (admin only).

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login (returns JWT) |
| GET | `/api/auth/verify` | Verify token validity |

### Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/projects` | List / Create projects |
| GET/PUT/DELETE | `/api/projects/:id` | Single project CRUD |
| GET/POST | `/api/skills` | List / Create skills |
| GET/PUT/DELETE | `/api/skills/:id` | Single skill CRUD |
| GET/POST | `/api/services` | List / Create services |
| GET/PUT/DELETE | `/api/services/:id` | Single service CRUD |
| GET/POST | `/api/testimonials` | List / Create testimonials |
| GET/PUT/DELETE | `/api/testimonials/:id` | Single testimonial CRUD |
| GET/POST | `/api/experience` | List / Create experience |
| GET/PUT/DELETE | `/api/experience/:id` | Single experience CRUD |
| GET/POST | `/api/education` | List / Create education |
| GET/PUT/DELETE | `/api/education/:id` | Single education CRUD |
| GET/POST | `/api/certifications` | List / Create certifications |
| GET/PUT/DELETE | `/api/certifications/:id` | Single certification CRUD |
| GET/POST | `/api/social-links` | List / Create social links |
| GET/PUT/DELETE | `/api/social-links/:id` | Single social link CRUD |
| GET/PUT | `/api/settings` | Read / Update settings |
| POST | `/api/upload` | Upload image to Cloudinary |

---

## 🔐 Admin Dashboard

Access at: **http://localhost:3000/admin**

Login with the credentials from your `.env` file:
- Email: `admin@example.com`
- Password: `Admin@123` (or whatever you set)

### Dashboard Features
- **Dashboard** — Overview with stats counters
- **Projects** — CRUD with image upload, tags, categories
- **Skills** — Manage skills by category with percentage
- **Services** — Add/edit service cards with features
- **Testimonials** — Client testimonials with ratings
- **Experience** — Work history with responsibilities
- **Education** — Academic background
- **Certifications** — Certificates with verification links
- **Social Links** — Social media URLs
- **Settings** — Site-wide configuration

---

## 🚢 Deployment

### Backend — Deploy to Railway (Recommended)

1. Push backend to GitHub
2. Go to [Railway](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Add environment variables (copy from `.env`)
4. Railway auto-detects Node.js and runs `npm start`
5. Run `npm run seed` via Railway's shell once deployed

**Alternative:** Render, Fly.io, or Vercel (serverless). For Vercel, use `vercel.json` included in backend.

### Frontend — Deploy to Vercel

1. Push frontend to GitHub
2. Go to [Vercel](https://vercel.com) → **Add New Project** → Import your frontend repo
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api`
4. Deploy — Vercel auto-detects Next.js

---

## 🧪 Verifying Everything Works

1. Open `http://localhost:3000` — portfolio loads with data from API
2. Open `http://localhost:3000/admin` — login with admin credentials
3. Add a new project in admin → it appears on the live site immediately
4. Update a skill percentage → reflected instantly

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| State/Data | TanStack Query (React Query) v5 |
| Animations | Framer Motion |
| Icons | React Icons |
| Backend | Express.js, Node.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT + bcrypt |
| File Upload | Cloudinary |
| HTTP Client | Axios |
| Notifications | React Hot Toast |

---

## ❓ Troubleshooting

**CORS errors?**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- For production, update this to your deployed frontend URL

**"MongooseError: Operation buffering timed out"?**
- Check your `MONGODB_URI` connection string
- Verify network access in MongoDB Atlas (add `0.0.0.0/0` for dev)

**Images not uploading?**
- Verify Cloudinary credentials in `.env`
- Check Cloudinary quota (free tier: 25GB storage)

**Admin login fails?**
- Re-run `npm run seed` to create the admin user
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`

**Changes not reflecting?**
- React Query caches data for 5 minutes by default
- Hard refresh the page (Ctrl+Shift+R) or wait for refetch
