export type Account = { id: string; name: string; industry: string; employees: number; arr: number; stage: 'prospect' | 'customer'; owner: string };
export type SignalType = 'hiring' | 'funding' | 'product-launch' | 'usage-drop' | 'contract-renewal' | 'expansion' | 'exec-change' | 'usage-spike';
export type Signal = { id: string; accountId: string; type: SignalType; detail: string; strength: number; at: string };
export type Draft = {
  id: string; accountId: string; signalId: string; play: string; talkTrack: string;
  priority: number; reasons: string[];
};
export type Decision = 'approved' | 'snoozed' | 'dismissed';
export type ActionEvent = { actionId: string; decision: Decision; note: string; at: string };
