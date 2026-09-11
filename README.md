# CampusFlow 🎓

> **Campus Opportunity Tracker** — Browse, save, and track internships, hackathons, scholarships, and more.  
> Built for the **12-Hour Frontend Hackathon** by **Team Pixel-End**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://campusflow.vercel.app)
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![Supabase](https://img.shields.io/badge/Supabase-cloud-3ECF8E?logo=supabase)](https://supabase.com)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Browse Opportunities** | Discover internships, hackathons, scholarships, fellowships, and grants |
| **Search & Filter** | Real-time search + category filter + sort by deadline |
| **View Details** | Full detail modal with description, stipend, tags, and deadline |
| **Save Opportunities** | Bookmark opportunities to your personal Saved list |
| **Track Applications** | Track status: Saved → Applied → Interview → Offered → Rejected |
| **Add Opportunity** | Admin/power users can publish new opportunities |
| **Multi-User Cloud** | Per-student data isolation via Supabase RLS (Row Level Security) |
| **Demo Mode** | Works without Supabase — falls back to built-in seed data |

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/campusflow.git
cd campusflow

# 2. Install
npm install

# 3. (Optional) Add Supabase credentials
cp .env.example .env.local
# Edit .env.local with your Supabase URL and anon key

# 4. Run dev server
npm run dev
```

App runs at **http://localhost:5173**

---

## 🔧 Environment Variables

Create `.env.local` (never commit this file):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> Without these, the app runs in **demo mode** with built-in seed data. All features still work.

---

## 🗄️ Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run [`supabase_schema.sql`](./supabase_schema.sql)
3. Copy your **Project URL** and **anon key** from Settings → API into `.env.local`

---

## 📦 Tech Stack

- **React 19** + **Vite 8**
- **Lucide React** icons
- **Supabase** (PostgreSQL + Auth + RLS)
- **Vanilla CSS** with glassmorphism design
- **Vercel** deployment

---

## 🏗️ Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Navbar.jsx
│   ├── OpportunityCard.jsx
│   ├── OpportunityModal.jsx
│   ├── AddOpportunityModal.jsx
│   ├── AuthModal.jsx
│   ├── DirectApplicationModal.jsx
│   ├── SearchBar.jsx
│   └── StatusBadge.jsx
├── pages/             # Route-level pages
│   ├── Discover.jsx
│   ├── Tracker.jsx
│   └── AdminDashboard.jsx
├── hooks/
│   └── useOpportunities.js
├── services/          # Supabase API layer
│   ├── supabase.js
│   ├── auth.js
│   ├── opportunities.js
│   └── user_data.js
├── utils/
│   └── formatters.js
└── App.jsx
```

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repository
3. Add environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Vite and builds correctly

The [`vercel.json`](./vercel.json) handles SPA routing automatically.

---

## 👥 Team

**Team Pixel-End** | 12-Hour Frontend Hackathon 2026
