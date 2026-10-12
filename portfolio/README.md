# Dipankar Bera — Portfolio

HTML + CSS + vanilla JS front end, tiny dependency-free Node.js server.

## Run
    node server.js        # or: npm start
    open http://localhost:3000

Needs Node 18+. No `npm install` required.

## Edit your content
- `data/portfolio.json` — skills, projects, honors, experience, certificates, and reference repository data
- `public/index.html` — hero text, about, contact info
- The résumé is served from `public/DIPANKAR_BERA_RESUME.pdf`; the site checks for this file and explains the path if it is missing.
- Add real project URLs using the `github` and `demo` fields. Placeholder `#` links are not presented as working links.

## Contact form
POST `/api/contact` validates input, rate-limits (5 per 10 min per IP) and saves to `data/messages.json`. This is local server storage only; it does not email messages. Configure a mail provider in the server before advertising email delivery. The contact section also provides a direct `mailto:` fallback.

## Responsive behaviour
- < 700px: single column, bottom tab bar, hamburger drawer
- 700–1023px: 2-column grids
- ≥ 1024px: top navigation, split hero, 2–3 column grids

## Deploy
Render, Railway or Fly.io: build command none, start command `node server.js` (uses `PORT` env var).

## Profile photo
The hero loads `public/profile_1.png` directly. Replace that image or update its `src` in `public/index.html` to change the portrait.

## Interactive features
Focus-area chips, cursor ring + spotlight, 3D card tilt, animated counters, scroll progress bar, project category filters,
project search, and skill-based project filtering.
