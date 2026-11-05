# 🚀 Sanity Management Production Deployment Guide

This project is structured into two clean directories:
- **`server/`**: Express + Socket.IO + MongoDB Atlas (Deploy on **Render**)
- **`client/`**: React + Vite + Tailwind CSS (Deploy on **Vercel**)

---

## 1. Backend Deployment on Render (`server/`)

### Steps:
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure the following service settings:
   - **Name**: `sanity-management-backend` (or your preferred name)
   - **Region**: Choose the closest region to your users (e.g., `Singapore` or `Frankfurt`)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Health Check Path**: `/health`

4. Add the **Environment Variables** in Render:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `5000` | Port for Express server |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | `your_long_random_secret_key` | Secret key for JWT authentication |
   | `CLIENT_URL` | `https://your-frontend.vercel.app` | Your Vercel frontend URL (set after deploying frontend) |
   | `ADMIN_EMAIL` | `admin@swachh.gov.in` | Primary Admin user email |
   | `ADMIN_PASSWORD` | `admin123` | Primary Admin user password |

5. Click **Create Web Service**.
6. Once deployed, Render will provide your public backend URL, e.g.:
   `https://sanity-management-backend.onrender.com`

---

## 2. Frontend Deployment on Vercel (`client/`)

### Steps:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
2. Import your Git repository.
3. In **Project Configuration**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. In **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://swachh-smart-backend.onrender.com/api` |
   | `VITE_WS_URL` | `https://swachh-smart-backend.onrender.com` |

   *(Replace `https://swachh-smart-backend.onrender.com` with your actual Render service URL).*

5. Click **Deploy**.
6. Copy your production Vercel URL (e.g. `https://swachh-smart.vercel.app`) and update the `CLIENT_URL` environment variable on Render.

---

## 3. Production Admin Login & First Steps

The database starts clean without mock facilities, complaints, or test staff:
- **Admin Email**: `admin@swachh.gov.in`
- **Admin Password**: `admin123`
- **Portal URL**: `https://your-frontend.vercel.app/login/admin`

### After Logging In as Admin:
1. Go to **Admin Console** → **Register New Complex**.
2. Add your city's public restroom centers with blocks/cabins and GPS coordinates.
3. Click **Create Municipal Lead** to register zonal ward officers.
4. Allot toilet centers to the respective Ward Leads.
5. Ward Leads can then register Field Sanitation Workers and allocate duty centers.
6. Citizens can register self-service accounts or scan toilet QR placards to submit live cleanliness ratings.

---

## 4. Maintenance & Resetting Data

If you ever need to reset the database back to clean production state (keeping only the admin user):
```bash
cd server
npm run purge
```

