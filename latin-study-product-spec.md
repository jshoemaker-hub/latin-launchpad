# Latin Learning Site Product Spec

## Vision
A student-first Latin learning website for classical school students in grades 3–8. The platform makes Latin vocabulary fun with grade-appropriate lessons, play-based practice, and a clear progress dashboard.

## Primary user
- Individual student in grades 3–8
- Goal: learn Latin vocabulary without it feeling boring
- Secondary future users: parent or teacher for monitoring progress

## Problem
Latin feels abstract and boring for elementary/middle school students.
Students need a playful, clear path that fits their grade level, gives immediate feedback, and shows growth.

## MVP success criteria
A student can:
1. sign up
2. choose their grade level
3. launch a vocabulary lesson
4. play one interactive game
5. see progress on a dashboard

A successful first release feels:
- engaging and low-friction for kids
- clearly grade-appropriate
- rewarding after each lesson
- easy to use in a home or school setting

## Core MVP features

### 1. Student onboarding
- simple sign-up flow (name, email/password or username)
- grade level selection: 3, 4, 5, 6, 7, 8
- welcoming landing page with quick explanation

### 2. Grade-appropriate vocabulary lessons
- content split by grade bands:
  - lower elementary 3–5
  - upper middle 6–8
- launch with one vocabulary lesson pack
- 10–12 words per pack
- focus on concrete, memorable words
- example sets:
  - grade 3: familia, puella, amicus, casa, aqua
  - grade 4: pater, mater, magister, silva, equus
  - grade 5: librum, scribo, amo, ambulare, canis
  - grade 6+: more complex verbs/nouns and simple phrases

### 3. Fun learning style
- one interactive game format for MVP:
  - flash-card matching
  - drag-and-drop vocabulary to picture
  - word meaning quiz with instant feedback
- add encouraging microcopy and sound/animation cues
- keep sessions short: 5–7 minutes to match attention spans

### 4. Progress dashboard
- lesson completion progress
- vocabulary mastery score
- streak or level progress bar
- earned stars/points/badges
- simple summary of current level and next lesson

## Product flow
1. Landing page
2. Student sign-up / login
3. Grade selection
4. Lesson selection
5. Game-based practice
6. Results + feedback
7. Progress dashboard

## Sample user story
_As a 5th grader, I want to pick my grade level and play a Latin vocabulary game so I can remember key words and feel proud when I complete a lesson._

## Recommended site structure
- `/` — home / welcome
- `/signup` — create student account
- `/login` — login
- `/grade` — choose grade level
- `/lessons` — available lesson packs
- `/lesson/:id` — interactive vocabulary lesson
- `/dashboard` — progress summary

## Data model (simple MVP)
- Student: id, name, grade, email, password hash, points, streak
- Lesson: id, grade, title, words[]
- Word: latin, english, image, example
- Attempt: studentId, lessonId, score, completedAt
- Progress: mastery per word, lessonsCompleted

## Lesson framework
Each lesson should include:
- introduction to a small set of words
- one core game or activity
- instant feedback for correct/wrong answers
- a short summary and reward at the end

### Example lesson flow
1. Present 5 vocabulary words with images
2. Practice in game mode
3. Show score and correct answers
4. Mark the lesson complete
5. Award a badge or points

## Metrics for early success
- student signup conversion
- lesson completion rate
- time spent in lessons
- percentage of correct answers over time
- daily or weekly return rate (streak)

## Next development steps
1. define the first lesson pack and word list
2. design UI wireframes for onboarding, lesson, and dashboard
3. build the initial web scaffold
4. implement signup, grade choice, and one lesson game
5. add progress tracking and dashboard

## Notes
- Start narrow: one strong lesson format is better than many weak ones.
- Make the dashboard simple and rewarding.
- Use images and clear visuals to make Latin feel concrete.
- Keep content school-friendly and age-appropriate.
