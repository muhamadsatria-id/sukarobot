# AGENTS.md

## Layout — read this first

- The backend lives in `server/`: `server/src/index.js`, `server/src/routes/*`, `server/src/db/*`, run via `server/package.json`.
- The frontend lives in `client/`. Run backend first, then frontend.
- `client/` is a separate Vite + React 19 app with its own `package.json` and lockfile. The product is **Sukabumi Drive**, a daily car-rental storefront (lepas kunci / dengan driver). `App.jsx` renders `pages/Home.jsx`; the storefront and admin dashboard are in `src/components/` (modals use native `<dialog>`). API calls go through `src/lib/api.js`, which defaults to `http://localhost:5000` and can be overridden with `VITE_API_URL`. There is no router; admin mode is a state toggle in `Home.jsx`.
- Styling is Tailwind CSS v4 via `@tailwindcss/vite`, all utilities inline in JSX. Design tokens (colors, fonts, radii) live in the `@theme` block in `client/src/index.css`; there is no `App.css`.
- A root `.gitignore` now exists. `node_modules/` was historically tracked in Git; it is ignored going forward but may remain in the index until `git rm --cached` is run. Don't bulk-stage `node_modules` changes.

## Commands

Backend (from `server/`, port 5000):

```bash
cd server
npm run dev      # nodemon, watches src/ only
npm start        # plain node src/index.js
curl http://localhost:5000/api/health
```

Frontend (from `client/`):

```bash
npm run dev      # Vite
npm run lint     # oxlint (not eslint); config in client/.oxlintrc.json
npm run build    # vite build
```

- There is **no test suite**; both `npm test` scripts fail by design. Verify backend changes with `curl` against a running server.
- No typecheck step and no TypeScript.
- `client/vite.config.js` proxies `/api` and `/uploads` to `http://localhost:5000`, and runs Vite on port **3000**. Use relative API paths in the browser; `src/lib/api.js` still allows an absolute `VITE_API_URL` override.

## Backend specifics

- ESM (`"type": "module"`), Express 5, built-in `node:sqlite` (`DatabaseSync`). This requires **Node >= 22.5** (verified on Node 24). `mysql2` is a leftover unused dependency — the datastore is SQLite, not MySQL.
- `server/src/db/katalogwa.sqlite` is committed and seeded from `server/src/db/data.json` **only when tables are empty** on boot. Editing `data.json` will not change an existing DB; delete the `.sqlite` file to reseed (destructive).
- Seed admin: `admin@sukabumidrive.id` / `password123` (hashed on first seed). Useful for manual login testing.
- Uploads are written to `server/src/uploads/` by multer and served at `/uploads`; the directory is created when the product router loads. Product create/update accept multipart form data with optional `image` (file) or `imageurl` (string). Product records are cars: `transmission`, `seats`, `fuel`, `modelYear`, `driverFee`, `minRental`, plus `stockStatus` of `Tersedia` / `Disewa`. `GET /api/products` filters by `categoryId` (legacy `categryId` still accepted).
- Store settings include `operationalHours`, `instagram`, `rentalNote`, and `slug` in addition to name, phone, tagline, address, and currency.
- Global body parser also accepts `text/plain` JSON and coerces it, so Postman "raw text" bodies work. Routes generally accept partial bodies.
- API responses use the `{ success, data, message }` envelope.
- Auth is `Authorization: Bearer <jwt>` (24h expiry). `JWT_SECRET` has a hardcoded fallback in `server/src/middleware/auth.js`; set it in `.env` for anything real. `.env` is loaded with dotenv and is not committed.
- Both `/api/stores` and `/api/store` are mounted to the same router.
- Comments in backend code are Indonesian while API messages are English; keep that split.

## Known defects (don't copy these patterns)

- `POST /api/auth/register` returns no response and persists nothing; only `login` and `me` work.
