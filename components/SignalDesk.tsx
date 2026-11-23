'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Panel, btn2 } from './ui';
import { fmtDate, money } from '@/lib/format';
import type { Account, ActionEvent, Decision, Draft, Signal } from '@/lib/types';

export type DraftRow = Draft & { account: Account; signal: Signal; current: ActionEvent | null };
export type DeskState = {
  note: string;
  drafts: DraftRow[];
  log: ActionEvent[];
  metrics: { signals: number; accounts: number; drafted: number; open: number; approved: number; worked: number };
};

const DECISIONS: { id: Decision; label: string }[] = [
  { id: 'approved', label: 'Approve' },
  { id: 'snoozed', label: 'Snooze' },
  { id: 'dismissed', label: 'Dismiss' },
];

export default function SignalDesk({ initial }: { initial: DeskState }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<Record<string, string>>({});

  const decide = (actionId: string, decision: Decision) =>
    start(async () => {
      setErr(null);
      const res = await fetch('/api/actions', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ actionId, decision, note: note[actionId] ?? '' }),
      });
      if (!res.ok) { setErr((await res.json().catch(() => ({}))).error ?? `Request failed (${res.status})`); return; }
      router.refresh();
    });

  const m = initial.metrics;

  return (
    <div className="mt-6 grid gap-4 pb-10 lg:grid-cols-3">
      {err && <div className="rounded-card border border-red-200 bg-red-50 p-3 text-sm text-red-800 lg:col-span-3">{err}</div>}

      <div className="lg:col-span-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {([['signals in', m.signals], ['accounts', m.accounts], ['actions drafted', m.drafted], ['open', m.open], ['approved', m.approved], ['worked', m.worked]] as const).map(([k, v]) => (
          <div key={k} className="rounded-card border border-line bg-white p-3 text-center">
            <div className="text-xl font-semibold tabular-nums text-ink">{v}</div>
            <div className="text-xs text-mute">{k}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4 lg:col-span-2">
        {initial.drafts.map((d) => (
          <Panel key={d.id} title={d.play} right={<span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">priority {d.priority}</span>}>
            <div className="text-xs text-mute">
              {d.account.name} | {d.account.industry} | {d.account.stage}{d.account.arr > 0 ? ` | ${money(d.account.arr)} ARR` : ''} | owner: {d.account.owner}
            </div>
            <div className="mt-1 text-sm text-ink">Signal: {d.signal.detail} <span className="text-mute">({fmtDate(d.signal.at)})</span></div>
            <div className="mt-1 text-sm text-mute">{d.talkTrack}</div>
            <div className="mt-1 text-[11px] text-mute">Priority from: {d.reasons.join('; ')}</div>
            {d.current && (
              <div className="mt-2 rounded-ctl bg-line/40 px-3 py-1.5 text-xs text-ink">
                Your latest decision: <span className="font-medium">{d.current.decision}</span> ({fmtDate(d.current.at)}){d.current.note ? ` - ${d.current.note}` : ''}
              </div>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input value={note[d.id] ?? ''} onChange={(ev) => setNote((n) => ({ ...n, [d.id]: ev.target.value }))}
                placeholder="optional note" className="w-44 rounded-ctl border border-line bg-white px-2 py-1.5 text-xs text-ink" />
              {DECISIONS.map((x) => (
                <button key={x.id} disabled={pending} className={btn2} onClick={() => decide(d.id, x.id)}>{x.label}</button>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Decision log">
        {initial.log.length === 0 ? (
          <p className="text-sm text-mute">No decisions yet. Approve, snooze or dismiss an action and it appears here with its timestamp.</p>
        ) : (
          <ul className="space-y-2">
            {initial.log.map((r, i) => {
              const d = initial.drafts.find((x) => x.id === r.actionId);
              return (
                <li key={i} className="text-sm">
                  <div className="text-ink"><span className="font-medium">{r.decision}</span> on {d ? d.play : r.actionId}</div>
                  <div className="text-xs text-mute">{d?.account.name} | {fmtDate(r.at)}{r.note ? ` - ${r.note}` : ''}</div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
