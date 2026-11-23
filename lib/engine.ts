import type { Account, Draft, Signal, SignalType } from './types';

const PLAYBOOK: Record<SignalType, { prospect: string; customer: string }> = {
  hiring: { prospect: 'Outbound: growth hiring', customer: 'Check-in: hiring surge' },
  funding: { prospect: 'Outbound: fresh funding', customer: 'Congrats + expansion touch' },
  'product-launch': { prospect: 'Outbound: launch timing', customer: 'Adoption: new line support' },
  'usage-drop': { prospect: 'Re-engagement nudge', customer: 'Save play: usage decline' },
  'contract-renewal': { prospect: 'Outbound: contract window', customer: 'Renewal motion' },
  expansion: { prospect: 'Outbound: new footprint', customer: 'Expansion play: new site' },
  'exec-change': { prospect: 'Outbound: new executive', customer: 'Relationship: new stakeholder' },
  'usage-spike': { prospect: 'Outbound: momentum', customer: 'Expansion play: usage spike' },
};

const TALK_TRACK: Record<SignalType, string> = {
  hiring: 'Hiring at this pace usually means the team is outgrowing its current workflow. Open with the roles they posted.',
  funding: 'Fresh capital means budget cycles reopen. Reference the round and tie value to what the round is funding.',
  'product-launch': 'A new line creates new operational load. Anchor on the launch and what breaks at 2x volume.',
  'usage-drop': 'A sustained seat decline is the strongest churn predictor we track. Call the champion before it compounds.',
  'contract-renewal': 'Start the renewal motion now: success metrics first, pricing second.',
  expansion: 'A second site doubles coordination cost. Position the workspace as the connective tissue.',
  'exec-change': 'New executives re-evaluate vendors in their first 90 days. Get in before the stack review starts.',
  'usage-spike': 'A 3x usage jump is the cleanest expansion signal there is. Bring a seat-growth proposal.',
};

/**
 * Deterministic rules, not ML: every priority point is listed in `reasons` and shown in the UI.
 */
export function draftActions(signals: Signal[], accounts: Account[]): Draft[] {
  const byId = new Map(accounts.map((a) => [a.id, a]));
  return signals.map((s) => {
    const acct = byId.get(s.accountId);
    if (!acct) return null;
    const reasons: string[] = [`signal strength ${s.strength}`];
    let priority = s.strength;
    const arrBoost = Math.min(15, Math.floor(acct.arr / 100000));
    if (arrBoost > 0) { priority += arrBoost; reasons.push(`${acct.arr.toLocaleString()} ARR adds ${arrBoost}`); }
    if (acct.stage === 'customer' && (s.type === 'usage-drop' || s.type === 'contract-renewal')) {
      priority += 10; reasons.push('at-risk revenue on a customer adds 10');
    }
    if (s.type === 'exec-change') { priority += 5; reasons.push('executive changes decay fast, adds 5'); }
    return {
      id: `act-${s.id}`,
      accountId: s.accountId,
      signalId: s.id,
      play: PLAYBOOK[s.type][acct.stage],
      talkTrack: TALK_TRACK[s.type],
      priority,
      reasons,
    } satisfies Draft;
  }).filter((d): d is Draft => d !== null)
    .sort((a, b) => b.priority - a.priority);
}
