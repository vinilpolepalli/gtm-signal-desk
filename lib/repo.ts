import { desc, eq } from 'drizzle-orm';
import fs from 'node:fs';
import path from 'node:path';
import { getDb } from './db';
import { draftActions } from './engine';
import type { Account, ActionEvent, Decision, Signal } from './types';

type Pipeline = { note: string; accounts: Account[]; signals: Signal[] };

let cache: Pipeline | null = null;
export function pipeline(): Pipeline {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data/signals.json'), 'utf8')) as Pipeline;
  return cache;
}

export async function addDecision(ownerId: string, actionId: string, decision: Decision, note: string): Promise<void> {
  const p = pipeline();
  if (!draftActions(p.signals, p.accounts).some((d) => d.id === actionId)) throw new Error('unknown action');
  const db = await getDb();
  await db.orm.insert(db.t.actionStates).values({ ownerId, actionId, decision, note, createdAt: new Date().toISOString() });
}

export async function decisionLog(ownerId: string, limit = 50): Promise<ActionEvent[]> {
  const db = await getDb();
  const rows = await db.orm.select().from(db.t.actionStates).where(eq(db.t.actionStates.ownerId, ownerId)).orderBy(desc(db.t.actionStates.id)).limit(limit);
  return rows.map((r) => ({ actionId: r.actionId, decision: r.decision as Decision, note: r.note, at: r.createdAt }));
}

/** Full desk state: ranked drafts with the owner's latest decision, grouped context, throughput metrics. */
export async function board(ownerId: string) {
  const p = pipeline();
  const log = await decisionLog(ownerId);
  const latest: Record<string, ActionEvent> = {};
  for (const r of log) if (!(r.actionId in latest)) latest[r.actionId] = r;
  const drafts = draftActions(p.signals, p.accounts).map((d) => ({
    ...d,
    account: p.accounts.find((a) => a.id === d.accountId)!,
    signal: p.signals.find((s) => s.id === d.signalId)!,
    current: latest[d.id] ?? null,
  }));
  const openCount = drafts.filter((d) => !d.current).length;
  const approvedCount = drafts.filter((d) => d.current?.decision === 'approved').length;
  return {
    note: p.note,
    drafts,
    log: log.slice(0, 20),
    metrics: {
      signals: p.signals.length,
      accounts: p.accounts.length,
      drafted: drafts.length,
      open: openCount,
      approved: approvedCount,
      worked: drafts.length - openCount,
    },
  };
}
