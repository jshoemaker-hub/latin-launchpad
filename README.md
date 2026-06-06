# Latin Launchpad

A simple student-first Latin learning scaffold for grades 3–8.

## Live site
- Production: https://latin-launchpad.netlify.app
- Repository: https://github.com/jshoemaker-hub/latin-launchpad

## What’s included
- `index.html` — landing page, student signup, grade selection, lesson list, and dashboard
- `styles.css` — playful interface styles
- `app.js` — interactive lesson logic with guest progress, email profiles, and badges in localStorage
- `grammar-lessons.js` — reference-backed grammar quiz packs for grades 3–8
- `latin-stories.js` — Discover Latin story pairings, classroom cues, and illustration briefs
- `latin-story-integration.md` — teaching routine and illustration prompt bank

## How to use
1. Open `index.html` in your browser.
2. Continue as a guest or use Email login to create a local profile.
3. Enter a student name.
4. Pick a grade.
5. Choose a lesson, preview any story or grammar notes, and practice vocabulary or grammar.
6. View progress and account badges on the dashboard.

## Next steps
- Add more reference-backed grammar and reading lesson packs
- Add audio pronunciation and review mode
- Add teacher/parent accounts and lesson assignment
- Add server-backed email magic links for cross-device account sync

## Deployment
Netlify builds the site from `main` using `netlify.toml`. The build copies the runtime web files into `dist/` and publishes that folder.
