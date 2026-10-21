# StayEase — Accommodation Booking Platform
- **Live demo:** https://stayease-wine.vercel.app
- **API:** https://stayease-9epa.onrender.com/api/health

StayEase is a full-stack, Airbnb-inspired accommodation booking platform built as a portfolio project. It is an original design and codebase — it does not use Airbnb's branding, logo, or copyrighted assets.

## 1. Project Overview

Guests can search stays, filter results, view rich property pages, book dates with server-validated availability, manage their trips, leave reviews, and keep a wishlist. Hosts can list properties, manage bookings, and view earnings. Admins can moderate users, listings, and bookings from a dedicated dashboard.

## 2. Features

- JWT authentication with role-based access (guest / host / admin)
- Search by destination, dates, and guest count
- Filters: price range, property type, bedrooms, bathrooms, amenities
- Property details page with image gallery, amenities, host info, reviews
- Server-side booking validation: no double bookings, no past dates, guest-limit enforcement
- User dashboard (My Trips) with cancellation
- Host dashboard: create/edit/delete listings, view reservations and estimated earnings
- Reviews restricted to guests who actually booked the listing
- Wishlist / favorites
- Admin dashboard: platform stats, user/listing/booking management
- Cloudinary-backed image uploads (no images stored in MongoDB)
- Responsive UI, loading/empty/error states, toast notifications

## 3. Tech Stack

**Frontend:** React 18, Vite, React Router, Tailwind CSS, Axios, React Hook Form, react-hot-toast, lucide-react
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Multer + Cloudinary
**Database:** MongoDB Atlas
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database), Cloudinary (images)

## 4. Architecture

```
Browser (React SPA on Vercel)
        │  Axios (JSON over HTTPS, JWT in Authorization header)
        ▼
Express REST API (Render)
        │  Mongoose
        ▼
MongoDB Atlas
        │
        └── Image uploads proxied to Cloudinary via Multer
```

The frontend never talks to MongoDB or Cloudinary directly — everything goes through the Express API, which validates and authorizes every request.

## 5. Folder Structure

```
StayEase/
├── backend/
│   ├── config/          # db.js, cloudinary.js
│   ├── controllers/     # business logic per resource
│   ├── middleware/      # auth (JWT + role checks), error handler
│   ├── models/          # User, Listing, Booking, Review, Wishlist
│   ├── routes/          # Express routers
│   ├── utils/           # generateToken, Cloudinary upload config
│   ├── seed/seed.js     # demo data seeder
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ListingCard, SearchBar, Filters, etc.
│   │   ├── pages/        # route-level pages
│   │   ├── layouts/      # MainLayout, HostLayout, AdminLayout
│   │   ├── context/      # AuthContext
│   │   ├── services/     # axios instance
│   │   ├── utils/        # formatting helpers, shared constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## 6. Prerequisites (Windows 11)

Install:
- **Node.js LTS** (v18+): https://nodejs.org
- **Git**: https://git-scm.com
- **VS Code**: https://code.visualstudio.com
- A free **MongoDB Atlas** account: https://www.mongodb.com/cloud/atlas
- A free **Cloudinary** account: https://cloudinary.com

Verify installs in PowerShell or Command Prompt:
```
node -v
npm -v
git --version
```

## 7. Installation & Local Setup

Open the project folder in VS Code, then use the integrated terminal.

### Backend

```
cd backend
npm install
copy .env.example .env
```
Now open `.env` and fill in your real values (see section 8).

```
npm run seed
npm run dev
```
The API runs at `http://localhost:5000`. Visit `http://localhost:5000/api/health` to confirm it's running.

### Frontend

Open a second terminal:
```
cd frontend
npm install
copy .env.example .env
npm run dev
```
The app runs at `http://localhost:5173`.

## 8. Environment Variables

**backend/.env**
| Variable | Description |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `PORT` | Port for the API (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin, used for CORS (e.g. `http://localhost:5173`) |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

Never commit `.env` files — they're already excluded via `.gitignore`.

## 9. MongoDB Atlas Setup

1. Create a free cluster at https://cloud.mongodb.com.
2. Under **Database Access**, create a user with a username and password.
3. Under **Network Access**, add your IP (or `0.0.0.0/0` for development/demo purposes).
4. Click **Connect → Drivers**, copy the connection string, and paste it into `MONGODB_URI` in `backend/.env`, replacing `<username>`, `<password>`, and the database name (`stayease`).

## 10. Cloudinary Setup

1. Sign up at https://cloudinary.com.
2. From the dashboard, copy your **Cloud name**, **API Key**, and **API Secret**.
3. Paste them into `backend/.env`.

Uploaded listing photos are stored on Cloudinary and referenced by URL in MongoDB — never stored as binary data in the database.

## 11. Seed Data

From `backend/`:
```
npm run seed
```
This creates 5 demo users and 6 sample listings with placeholder images (via picsum.photos), plus a past booking with a review and an upcoming booking, so every feature has real data to show immediately.

   Demo guest and host accounts (password `password123`):
| Role | Email |
|---|---|
| Admin | Private (credentials not shared publicly) |
| Host | ava.host@stayease.demo |
| Host | liam.host@stayease.demo |
| Guest | maya.guest@stayease.demo |
| Guest | sam.guest@stayease.demo |

To wipe all data: `npm run seed:destroy`

## 12. Running Backend & Frontend

- Backend dev server: `cd backend && npm run dev` (nodemon, auto-restarts)
- Frontend dev server: `cd frontend && npm run dev` (Vite, hot reload)

## 13. API Overview

```
AUTH
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/become-host

LISTINGS
GET    /api/listings                 (search + filters via query params)
GET    /api/listings/:id
GET    /api/listings/:id/availability
GET    /api/listings/host/mine       (host)
POST   /api/listings                 (host)
PUT    /api/listings/:id             (owning host / admin)
DELETE /api/listings/:id             (owning host / admin)

BOOKINGS
POST   /api/bookings
GET    /api/bookings/my
GET    /api/bookings/host            (host)
PUT    /api/bookings/:id/cancel

REVIEWS
GET    /api/listings/:id/reviews
POST   /api/listings/:id/reviews
DELETE /api/reviews/:id

WISHLIST
GET    /api/wishlist
POST   /api/wishlist/:listingId
DELETE /api/wishlist/:listingId

USERS
GET    /api/users/me
PUT    /api/users/me

UPLOADS
POST   /api/uploads                  (host / admin, multipart/form-data, field name "images")

ADMIN  (admin only)
GET    /api/admin/stats
GET    /api/admin/users
GET    /api/admin/listings
DELETE /api/admin/listings/:id
GET    /api/admin/bookings
```

## 14. GitHub Setup

From the `StayEase/` root:
```
git init
git add .
git commit -m "Initial commit: StayEase full-stack booking platform"
git branch -M main
git remote add origin https://github.com/<your-username>/stayease.git
git push -u origin main
```

## 15. Render Deployment (Backend)

1. Push the repo to GitHub (above).
2. On https://render.com, click **New → Web Service** and connect your repo.
3. Set **Root Directory** to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (same as `backend/.env`) in the Render dashboard — set `CLIENT_URL` to your future Vercel URL.
7. Deploy. Note the resulting URL, e.g. `https://stayease-api.onrender.com`.

## 16. Vercel Deployment (Frontend)

1. On https://vercel.com, click **Add New → Project** and import the repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Vite.
4. Add environment variable `VITE_API_URL` = `https://stayease-api.onrender.com/api` (your Render URL + `/api`).
5. Deploy.
6. Back in Render, update `CLIENT_URL` to your Vercel URL (e.g. `https://stayease.vercel.app`) and redeploy the backend so CORS allows it.

## 17. Known Limitations

- No real payment gateway is integrated — booking confirmation is simulated. This is intentional for a portfolio project; see Future Improvements.
- The map/location feature is not included in this version; the address is shown as text on the listing page.
- Email notifications (booking confirmations, etc.) are not implemented.
- Render's free tier spins down when idle, so the first request after inactivity can be slow.

## 18. Future Improvements

- Integrate a real payment provider (e.g. Stripe) for actual checkout
- Add an interactive map (e.g. Mapbox or Google Maps) on the listing page
- Add email notifications via a transactional email service
- Add pagination controls and infinite scroll on the listings page
- Add messaging between guests and hosts

## 19. Testing Checklist

- [ ] Register a new guest account
- [ ] Register a new host account
- [ ] Log in / log out
- [ ] Search listings by destination and dates
- [ ] Apply and clear filters
- [ ] View a listing's details, gallery, and reviews
- [ ] Book a listing with valid dates
- [ ] Attempt to book overlapping dates on the same listing (should fail)
- [ ] Cancel an upcoming booking from My Trips
- [ ] Leave a review on a listing you've booked
- [ ] Add/remove a listing from the wishlist
- [ ] Create, edit, and delete a listing as a host
- [ ] Upload images to a listing
- [ ] View host dashboard stats and reservations
- [ ] Log in as admin and view/manage users, listings, and bookings
- [ ] Confirm a guest cannot access `/host` routes and a non-admin cannot access `/admin` routes

---

### Interview Explanation (60–90 seconds)

"StayEase is a full-stack accommodation booking platform I built to demonstrate end-to-end product engineering — similar in spirit to Airbnb, but an original build. The frontend is a React + Vite single-page app styled with Tailwind, and it talks to an Express REST API over HTTPS using Axios, sending a JWT in the Authorization header on every authenticated request. The backend uses MongoDB with Mongoose models for users, listings, bookings, reviews, and wishlists, and passwords are hashed with bcrypt before storage. Role-based middleware restricts host and admin routes so a guest can never create a listing or reach the admin dashboard. The part I'm most proud of is the booking logic: availability is never trusted from the frontend — every booking request re-checks the database for overlapping confirmed bookings on that listing before confirming, which prevents double-booking even under concurrent requests. Images are uploaded via Multer straight to Cloudinary rather than stored in MongoDB, keeping the database lean. For deployment, the frontend is on Vercel, the backend on Render, and MongoDB Atlas hosts the data — the two apps only talk to each other over their public HTTPS URLs, configured through environment variables so nothing is hardcoded."
