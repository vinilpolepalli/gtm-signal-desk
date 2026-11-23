export const SQLITE_DDL = [
`CREATE TABLE IF NOT EXISTS action_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id TEXT NOT NULL,
  action_id TEXT NOT NULL,
  decision TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL
)`,
`CREATE TABLE IF NOT EXISTS rate_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  at INTEGER NOT NULL
)`,
];

export const PG_DDL = [
`CREATE TABLE IF NOT EXISTS action_states (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL,
  action_id TEXT NOT NULL,
  decision TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL
)`,
`CREATE TABLE IF NOT EXISTS rate_events (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  at BIGINT NOT NULL
)`,
`ALTER TABLE rate_events ALTER COLUMN at TYPE BIGINT`,
`CREATE INDEX IF NOT EXISTS rate_idx ON rate_events (owner_id, kind, at)`,
];
