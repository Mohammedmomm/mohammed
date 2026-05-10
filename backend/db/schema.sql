-- Smart Health Tools Database Schema
-- Run: psql -U your_user -d your_db -f schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  phone         VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calculator_history (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  calculator_type VARCHAR(10) NOT NULL CHECK (calculator_type IN ('age', 'bmi')),
  input_data      JSONB NOT NULL,
  result_data     JSONB NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email        ON users(email);
CREATE INDEX IF NOT EXISTS idx_history_user_id    ON calculator_history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON calculator_history(created_at DESC);
