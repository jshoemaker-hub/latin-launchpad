# Latin Launchpad

A simple student-first Latin learning scaffold for grades 3–8.

## Live site
- Production: https://latinlaunchpad.com
- Repository: https://github.com/jshoemaker-hub/latin-launchpad

## What’s included
- `index.html` — landing page, student signup, grade selection, lesson list, and dashboard
- `styles.css` — playful interface styles
- `app.js` — interactive lesson logic with pronunciation, review queues, guest progress, email profiles, and badges in localStorage
- `grammar-lessons.js` — reference-backed grammar quiz packs for grades 3–8
- `latin-stories.js` — Discover Latin story pairings, classroom cues, and illustration briefs
- `assets/seek-find/` — original Roman story artwork for the interactive picture-search activities
- `latin-story-integration.md` — teaching routine and illustration prompt bank

## How to use
1. Open `index.html` in your browser.
2. Continue as a guest or use Email login to create a local profile.
3. Enter a student name.
4. Pick a grade.
5. Choose a lesson, preview any story or grammar notes, meet the words, play its Seek & Find picture mission, then practice with a meaning quiz, picture match, or grammar.
6. View progress and account badges on the dashboard.

## Checks
Run the no-dependency smoke test before committing lesson-loop changes:

```bash
npm test
```

## Next steps
- Add more reference-backed grammar and reading lesson packs
- Add teacher/parent accounts and lesson assignment
- Add server-backed email magic links for cross-device account sync

## Deployment
Netlify builds the site from `main` using `netlify.toml`. The build copies the runtime web files into `dist/` and publishes that folder.

The contact form sends through a Netlify Function and Resend. Add these environment variables in Netlify before deploying, with access to the Functions scope:

- `RESEND_API_KEY`: a Resend API key with sending access
- `RESEND_FROM_EMAIL`: `Latin Launchpad <contact@send.latinlaunchpad.com>`
- `CONTACT_TO_EMAIL`: optional destination address; defaults to `jshoemakercb@yahoo.com`
