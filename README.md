# 📝 Notes App

A personal notes application with folder organization, image support, and full-text search. Built with React + TypeScript on the frontend and Node.js + MongoDB on the backend, deployed as a monorepo on Vercel.

## Features

- **Authentication** — Single-password login with JWT session management
- **Folders** — Color-coded folders to organize your notes
- **Notes** — Rich content, up to 5 images per note, tags, and pinning
- **Search** — Search across all notes and folders; filter by tags

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Bootstrap 5, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Multer |
| Deployment | Vercel (serverless API + SPA) |

## Project Structure

```
noteapp/
├── api/
│   └── index.js          # Vercel serverless entry point
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js          # Express app (serverless-compatible)
│   ├── .env               # Your secrets (not committed)
│   └── .env.example       # Template — copy this to .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── services/
│   ├── .env               # React env vars (not committed)
│   └── .env.example       # Template — copy this to .env
├── vercel.json            # Vercel routing config
└── package.json           # Root scripts (concurrently)
```

## Local Development

### Prerequisites

- Node.js v16+
- MongoDB running locally (or a MongoDB Atlas URI)

### Setup

```bash
# 1. Clone
git clone https://github.com/lochan87/<repo-name>.git
cd noteapp

# 2. Install all dependencies
npm run install-all

# 3. Configure environment variables
cp backend/.env.example backend/.env     # then fill in your values
cp frontend/.env.example frontend/.env  # defaults work for local dev

# 4. Start both servers
npm run dev
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000

### Environment Variables

**`backend/.env`**

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Backend port (default: `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens (min 32 chars) |
| `SPECIAL_PASSWORD` | The app login password |
| `FRONTEND_URL` | Allowed CORS origin |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | API base URL — set to `http://localhost:5000` locally, leave empty in production |
| `HOST` | Dev server host (set to `0.0.0.0` for LAN access) |

## Deployment (Vercel)

This repo is pre-configured for Vercel:

- `vercel.json` routes `/api/*` to the serverless function (`api/index.js`)
- All other routes serve the React SPA from `frontend/build`
- In production, the frontend and backend share the same domain — no CORS needed

```bash
# Push to GitHub — Vercel auto-deploys on push
git push origin main
```

Set the following in your Vercel project's **Environment Variables** dashboard:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
SPECIAL_PASSWORD=...
NODE_ENV=production
```

Leave `REACT_APP_API_URL` **empty** in production (relative `/api` calls work automatically).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start backend + frontend concurrently |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run build` | Build frontend for production |
| `npm run install-all` | Install deps in root, backend, and frontend |

---

Made with ❤️ by Lochan
