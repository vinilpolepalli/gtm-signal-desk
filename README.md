# GTM Signal Desk

Independent demo: triage inbound account signals in a fictional revenue pipeline into drafted rep actions with rule-based priorities and an approval queue, the signal-to-action workflow a go-to-market platform automates.

- Rule-based signal triage with transparent priority reasons; no ML, no black box
- Drafted rep actions (email, call, task) held in an approval queue before they count as done
- Real persisted state per anonymous browser cookie: approvals, dismissals, notes
- Sample accounts and signals are fictional; seeded demo data, not real companies or people

Stack: Next.js 15, drizzle-orm, SQLite locally, Postgres (Neon) in production via DATABASE_URL.

## Run

```
npm install
npm run dev        # http://localhost:3000
npm test           # engine unit tests
npm run typecheck
BASE_URL=http://localhost:3000 npm run e2e   # with the dev server running
```

## Deployment

Production deploys run on Vercel from the main branch, with the database on Neon Postgres connected through the Vercel integration.

Demo built by Vinil Polepalli. Not affiliated with or endorsed by Nex.
