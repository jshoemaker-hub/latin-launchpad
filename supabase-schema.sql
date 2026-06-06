-- Latin Launchpad — Supabase schema
-- Run this in the Supabase SQL Editor (supabase.com → project → SQL Editor)

-- 1. Profiles (one row per email user)
CREATE TABLE IF NOT EXISTS user_profiles (
  email        TEXT PRIMARY KEY,
  student_name TEXT DEFAULT '',
  grade        INT,
  points       INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lesson progress (one row per email + lesson)
CREATE TABLE IF NOT EXISTS lesson_progress (
  email        TEXT REFERENCES user_profiles(email) ON DELETE CASCADE,
  lesson_id    TEXT,
  score        INT DEFAULT 0,
  max_score    INT DEFAULT 0,
  last_score   INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (email, lesson_id)
);

-- 3. Words mastered
CREATE TABLE IF NOT EXISTS words_mastered (
  email       TEXT REFERENCES user_profiles(email) ON DELETE CASCADE,
  word        TEXT,
  mastered_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (email, word)
);

-- 4. Badges earned
CREATE TABLE IF NOT EXISTS badges (
  email     TEXT REFERENCES user_profiles(email) ON DELETE CASCADE,
  badge_id  TEXT,
  earned_at TIMESTAMPTZ,
  PRIMARY KEY (email, badge_id)
);

-- Enable Row Level Security
ALTER TABLE user_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE words_mastered  ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges          ENABLE ROW LEVEL SECURITY;

-- Allow anonymous (public) read/write — appropriate for a kids' learning app
CREATE POLICY "anon_all" ON user_profiles   FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON lesson_progress FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON words_mastered  FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON badges          FOR ALL TO anon USING (true) WITH CHECK (true);
