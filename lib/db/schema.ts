import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const actionStates = sqliteTable('action_states', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: text('owner_id').notNull(),
  actionId: text('action_id').notNull(),
  decision: text('decision').notNull(),
  note: text('note').notNull(),
  createdAt: text('created_at').notNull(),
});
export const rateEvents = sqliteTable('rate_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: text('owner_id').notNull(),
  kind: text('kind').notNull(),
  at: integer('at').notNull(),
});
