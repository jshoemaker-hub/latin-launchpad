# Latin Learning Lesson Framework

## Goal
Build a repeatable lesson framework for grades 3–8 that turns Latin vocabulary into a playable, confidence-building learning experience.

## Framework principles
- **Short, grade-appropriate lessons**: 5–10 words per lesson, concrete vocabulary first.
- **Playful interaction**: one core game per lesson with instant feedback.
- **Clear progress**: each lesson includes completion, score, and mastery updates.
- **Multiple learning styles**: vocabulary presentation, meaning practice, and visual/audio reinforcement.
- **Reward momentum**: points, stars, and lesson badges for motivation.

## Lesson anatomy
Each lesson should contain:
1. **Introduction**
   - title and grade level
   - learning goal
   - short explanation of what the student will do
2. **Word set**
   - 5–8 words for MVP
   - image or emoji, Latin word, English meaning
3. **Practice game**
   - matching, flashcards, or quiz
   - instant feedback on each answer
4. **Review / recap**
   - correct answer summary
   - confidence meter or progress badge
5. **Completion reward**
   - points earned
   - lesson completion toggle
   - next lesson suggestion

## Core learning loop
- Present vocabulary in a friendly format
- Practice through game interaction
- Celebrate successes and correct mistakes
- Update the dashboard with mastery

## Grade bands and launch content
### Grade 3–5: lower elementary
- strong emphasis on everyday nouns and simple verbs
- concrete vocabulary students can picture or act out
- minimal text, more visuals
- sample words:
  - puella — girl
  - puer — boy
  - familia — family
  - casa — house
  - aqua — water
  - amicus — friend
  - canis — dog
  - sedet — sits

### Grade 6–8: upper middle
- include slightly richer verbs, simple phrases, and school-related nouns
- build on prior vocabulary with word families and grammar hints
- sample words:
  - magister — teacher
  - discipulus — student
  - liber — book
  - scribo — I write
  - ambulat — walks
  - currit — runs
  - agricola — farmer
  - clamat — shouts

## MVP game formats
### 1. Match the picture
- show a Latin word and 3 images or English words
- student selects the correct meaning or picture
- good for grades 3–5

### 2. Drag-and-drop pairs
- pair Latin words with English meanings or pictures
- supports visual learners and kinesthetic interaction

### 3. Flashcard quiz
- show Latin word on one side, ask for meaning
- student reveals the answer and marks "know it" or "need practice"
- good for self-paced mastery

## Progress tracking model
- `lessonCompleted` boolean
- `score` / `maxScore`
- `wordsMastered` count
- `lessonsCompleted` per grade band
- `points` and `badges`
- `streak` for daily learning

## Sample lesson: Grade 3 vocabulary pack
### Lesson 1: Welcome to Latin
- Words:
  1. puella — girl
  2. puer — boy
  3. casa — house
  4. aqua — water
  5. canis — dog

- Activity: Match each Latin word with the correct picture or English meaning.
- Feedback:
  - correct: "Great! puella means girl."
  - incorrect: "Almost there! puella is girl, not dog."
- Reward: 5 points per correct answer, badge for 5/5

## Sample lesson: Grade 6 vocabulary pack
### Lesson 1: School and action verbs
- Words:
  1. magister — teacher
  2. discipulus — student
  3. liber — book
  4. scribo — I write
  5. ambulat — walks

- Activity: Choose the English meaning for each word, then review the Latin sentence.
- Feedback:
  - correct: "Yes! scribo means I write."
  - incorrect: "Try again — scribo is I write, not he walks."
- Reward: 5 points per correct answer, badge for lesson complete

## Lesson framework for expansion
### Next lesson types
- **Sentence builder**: assemble a simple Latin sentence from word tiles
- **Audio practice**: listen to Latin words and choose the meaning
- **Memory match**: card matching game for Latin and English pairs

### Future extensions
- teacher-assigned lessons and class progress
- parent/teacher dashboard
- adaptive review: words repeated when incorrect
- multi-sensory content: audio pronunciation, animated characters

## Implementation notes
- Start with static content for MVP; no curriculum editor needed initially.
- Build lessons from JSON data so new packs can be added quickly.
- Keep the UI bright, simple, and age-appropriate.
- Use friendly encouragement language like "Nice work!" and "You're getting better."
