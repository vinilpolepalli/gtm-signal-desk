import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { draftActions } from '../lib/engine.ts';
import type { Account, Signal } from '../lib/types.ts';

const p = JSON.parse(readFileSync(new URL('../data/signals.json', import.meta.url), 'utf8')) as { accounts: Account[]; signals: Signal[] };
const drafts = draftActions(p.signals, p.accounts);
assert.equal(drafts.length, p.signals.length, 'one draft per signal');
for (let i = 1; i < drafts.length; i++) assert.ok(drafts[i - 1].priority >= drafts[i].priority, 'sorted by priority');
const ids = new Set(drafts.map((d) => d.id));
assert.equal(ids.size, drafts.length, 'unique action ids');
// Renewal on a $900k customer beats a weak prospect signal
const renewal = drafts.find((d) => d.signalId === 'sig-06')!;
assert.equal(renewal.play, 'Renewal motion');
assert.equal(renewal.priority, 88 + 9 + 10, `priority math, got ${renewal.priority}`);
// Funding on a prospect gets prospect play and no at-risk boost
const funding = drafts.find((d) => d.signalId === 'sig-02')!;
assert.equal(funding.play, 'Outbound: fresh funding');
assert.equal(funding.priority, 91, `prospect no ARR boost, got ${funding.priority}`);
// Exec change decay bonus applied
const exec = drafts.find((d) => d.signalId === 'sig-09')!;
assert.ok(exec.reasons.some((r) => r.includes('decay')), 'exec decay reason');
// Every draft lists its reasons
assert.ok(drafts.every((d) => d.reasons.length >= 1), 'reasons present');
console.log('engine tests pass');
