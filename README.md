# Go Business – Referral Dashboard

A fully featured, production-ready referral management dashboard built with **React + Vite**.

---

## Live Demo

>https://go-business-dashboard-seven.vercel.app/login
 Deploy to Vercel (see instructions below).

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router DOM v6 | Client-side routing |
| js-cookie | JWT cookie management |
| CSS Modules | Scoped component styles |
| Fetch API | HTTP requests (no Axios) |

---

## Project Structure

```
go-business-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── Footer.jsx / Footer.module.css
│   │   ├── Navbar.jsx / Navbar.module.css
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx / LoginPage.module.css
│   │   ├── DashboardPage.jsx / DashboardPage.module.css
│   │   ├── ReferralDetailPage.jsx / ReferralDetailPage.module.css
│   │   └── NotFoundPage.jsx / NotFoundPage.module.css
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vercel.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for Production

```bash
npm run build
```

---

## Deployment on Vercel

1. Push this folder to a GitHub repository.
2. Import the repo in [vercel.com](https://vercel.com).
3. Set the **Root Directory** to `go-business-dashboard` (or leave blank if it is already at the repo root).
4. Framework preset: **Vite**.
5. Click **Deploy** — the `vercel.json` rewrite rule handles SPA routing automatically.

---

## Test Credentials

```
Email:    admin@example.com
Password: admin123
```

---

## Feature Checklist

- [x] Login page at `/login` with brand, tagline, accessible form
- [x] POST to auth endpoint; token stored in `jwt_token` cookie
- [x] Always-enabled Sign in button (API error governs proceed/stay)
- [x] ProtectedRoute using `Cookies.get('jwt_token')`
- [x] Authenticated users visiting `/login` redirected to `/`
- [x] `BrowserRouter` wraps `<Routes>` inside `App.jsx`; `main.jsx` renders `<App />` only
- [x] `*` route is public (not wrapped in ProtectedRoute)
- [x] Dashboard: Overview metrics grid
- [x] Dashboard: Service Summary with exact column labels
- [x] Dashboard: Share Referral with Copy buttons for link and code
- [x] Dashboard: All Referrals table (Name, Service, Date YYYY/MM/DD, Profit USD no decimals)
- [x] Search with debounced API call (`?search=`)
- [x] Sort select with "Newest first" (desc) default and "Oldest first" (asc)
- [x] Client-side pagination: 10 rows per page, Previous / Next / page numbers
- [x] Footer showing `Showing <from>–<to> of <total> entries` with en-dash
- [x] Row click navigates to `/referral/:id`
- [x] Referral Details page fetches `?id=<id>`, shows partner info in `<dl>`
- [x] Handles `data` as row object, as `data.referrals` array, or as `data.referral`
- [x] "Referral not found" fallback on 404 / missing data
- [x] Not Found page: 404, "Page not found", Back to dashboard
- [x] Navbar: Go Business brand, Home link, Log out button (clears cookie → `/login`)
- [x] Footer: Go Business, About, Privacy links, © 2024 Go Business
- [x] All referrals requests include `Authorization: Bearer <jwt_token>`
- [x] `vercel.json` rewrite rule for SPA routing

---

## Assumptions & Notes

1. **`BrowserRouter` placement** — The spec explicitly states `BrowserRouter` must wrap `<Routes>` inside `App.jsx` so `main.jsx` renders only `<App />`. This is implemented as required.
2. **Always-enabled Sign in** — The button is never `disabled` based on field state; only temporarily disabled during the async POST to prevent double-submission.
3. **Referral detail data shape** — The spec notes the detail endpoint may return the row as `data` directly, inside `data.referrals`, or as `data.referral`. All three shapes are handled.
4. **Pagination** — Fully client-side: the API returns the complete filtered/sorted list; the app slices it into pages of 10.
5. **Search debounce** — A 350 ms debounce prevents an API call on every keystroke.
6. **`/dashboard/referrals`** — Treated as an optional alias that redirects to `/` (the main dashboard).
7. **Footer links** — `About` and `Privacy` use placeholder `href="#about"` and `href="#privacy"` per spec permission ("href placeholders are fine").
8. **Google Fonts** — Loaded via `<link>` in `index.html` for Inter font. No build-time font dependency.
