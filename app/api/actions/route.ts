import { ownerId, rateHit, readJson, tooMany, json } from '@/lib/http';
import { parseActionBody } from '@/lib/validate';
import { addDecision } from '@/lib/repo';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const owner = await ownerId();
  const body = await readJson(req);
  if (!body.ok) return body.res;
  const input = parseActionBody(body.body);
  if (!input) return json({ error: 'Provide actionId, decision (approved|snoozed|dismissed), and an optional note' }, 400);
  const lim = await rateHit(owner, 'actions', 120);
  if (!lim.ok) return tooMany(lim.retryAfter);
  try {
    await addDecision(owner, input.actionId, input.decision, input.note);
  } catch {
    return json({ error: 'Unknown action' }, 404);
  }
  return json({ ok: true });
}
