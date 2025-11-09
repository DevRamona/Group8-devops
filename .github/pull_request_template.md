Title: Migrate backend to MongoDB, add auth, Tailwind UI, and structure cleanup

Summary
- Switch backend from MySQL/Sequelize to MongoDB/Mongoose
- Implement JWT auth (login/register), middleware, and protected routes
- Add Tailwind CSS; rebuild Login/Sign Up UI and responsive layout
- Make `/dashboard` the homepage; remove left sidebar
- Normalize API to use `/api` via Vite proxy; static assets served via absolute path
- Clean repo structure; remove duplicate root frontend/backend folders

Scope of changes
- Backend
  - package.json: add mongoose, remove mysql2/sequelize usage
  - src/config/db.ts: new `connectToDatabase` with Mongoose
  - src/models/User.ts: Mongoose schema (name, email unique, password, role, etc.)
  - src/routes/auth.ts: register/login using bcrypt + JWT
  - src/middleware/auth.ts: bearer token verification
  - src/server.ts: connect to Mongo, mount `/api/auth`, 404/error handlers
  - env: use `MONGO_URI` and `JWT_SECRET`
- Frontend
  - Tailwind setup: tailwind.config.js, postcss.config.js, `@tailwind` in `src/index.css`
  - Login.tsx/Register.tsx: Tailwind-based responsive forms, redirects to `/dashboard`
  - App.tsx: `AuthProvider`, Protected routes, `/dashboard` homepage, sidebar removed
  - Dashboard.tsx: uses existing `FarmerList` as main content
  - vite.config.ts: dev proxy `/api` → `http://localhost:5000`

Screenshots/Recordings (optional)
- Login (mobile/desktop)
- Register (mobile/desktop)
- Dashboard

Migration notes
- .env changes (backend):
  - MONGO_URI=mongodb://127.0.0.1:27017/farmsafe_db
  - JWT_SECRET=change_me
  - PORT=5000
  - NODE_ENV=development
- Data: users will now be stored in MongoDB (`users` collection). No SQL migration.

Testing checklist
- Backend
  - [ ] `npm run dev` connects to Mongo (or Atlas) without errors
  - [ ] `POST /api/auth/register` creates a user (unique email)
  - [ ] `POST /api/auth/login` returns a valid JWT
  - [ ] Protected route with `authenticate` middleware rejects missing/invalid tokens
- Frontend
  - [ ] Login succeeds and redirects to `/dashboard`
  - [ ] Register succeeds and redirects to `/dashboard`
  - [ ] `/dashboard` and `/farmer/:id` are inaccessible without auth
  - [ ] Responsive layout works on mobile and desktop

Backward compatibility
- Breaks MySQL/Sequelize runtime; MongoDB is now required. Dev can switch MONGO_URI to Atlas or local Mongo.

Deployment notes
- Ensure environment contains `MONGO_URI` and `JWT_SECRET`
- Start sequence:
  - Backend: `npm run dev` (or build/start)
  - Frontend: `npm run dev`

Risks & mitigations
- Auth tokens: ensure `JWT_SECRET` is set in all environments
- CORS: currently permissive in dev; tighten before prod
- Images served from `backend/src/pictures`; consider moving to `public/` or CDN later

Linked issues/PRs
- Fix branch for folder structure and auth/UI overhaul

Checklist (author)
- [ ] Updated README or docs where needed
- [ ] Added/updated env example values
- [ ] Manually tested auth flow end-to-end

Reviewer notes
- Focus on Mongoose model, auth flows, and Tailwind responsiveness

