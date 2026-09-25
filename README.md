# Latin Launchpad

A simple student-first Latin learning scaffold for grades 3–8.

## Live site
- Production: https://latinlaunchpad.com
- Repository: https://github.com/jshoemaker-hub/latin-launchpad

## What’s included
- `index.html` — landing page, optional account access, year selection, lesson list, study tools, and dashboard
- `styles.css` — playful interface styles
- `app.js` — interactive lesson logic with pronunciation, review queues, guest progress, email profiles, and badges in localStorage
- `grammar-lessons.js` — reference-backed grammar quiz packs for grades 3–8
- `latin-stories.js` — Discover Latin story pairings, classroom cues, and illustration briefs
- `assets/seek-find/` — original Roman story artwork for the interactive picture-search activities
- `latin-story-integration.md` — teaching routine and illustration prompt bank

## How to use
1. Open `index.html` in your browser.
2. Select **Start learning** to use guest mode without entering a name, or use **Email login** for a synced account.
3. Pick a curriculum year.
4. Choose a lesson, or launch a randomized 10-minute flashcard session for any year from Home.
5. Preview story or grammar notes, meet the words, and practice with the available games and quizzes.
6. View locally saved progress and badges on the dashboard.

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
