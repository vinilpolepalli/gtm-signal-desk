import type { Decision } from './types';

export function parseActionBody(body: unknown): { actionId: string; decision: Decision; note: string } | null {
  if (typeof body !== 'object' || body === null) return null;
  const b = body as Record<string, unknown>;
  if (typeof b.actionId !== 'string' || b.actionId.length > 80) return null;
  const decisions: Decision[] = ['approved', 'snoozed', 'dismissed'];
  if (!decisions.includes(b.decision as Decision)) return null;
  const note = typeof b.note === 'string' ? b.note.slice(0, 500) : '';
  return { actionId: b.actionId, decision: b.decision as Decision, note };
}
