import SignalDesk from '@/components/SignalDesk';
import { board } from '@/lib/repo';
import { ownerId } from '@/lib/http';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const owner = await ownerId();
  const b = await board(owner);
  return (
    <main>
      <div className="mt-6 max-w-3xl">
        <h1 className="text-2xl font-semibold sm:text-3xl">Twelve signals came in this week. The desk drafted twelve actions.</h1>
        <p className="mt-2 text-sm text-mute">
          A fictional revenue team pipeline: every inbound signal becomes a drafted rep action with a rule-based priority and a talk track.
          Nothing goes out until a person approves it in the queue. Your decisions persist in the demo database under your anonymous cookie. {b.note}
        </p>
      </div>
      <SignalDesk initial={b} />
    </main>
  );
}
