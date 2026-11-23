const base = process.env.BASE_URL ?? 'http://localhost:3000';
const jar: string[] = [];
async function call(path: string, init?: RequestInit) {
  const res = await fetch(base + path, { ...init, headers: { ...(init?.headers ?? {}), cookie: jar.join('; '), 'content-type': 'application/json' } });
  for (const c of res.headers.getSetCookie?.() ?? []) jar.push(c.split(';')[0]);
  return res;
}
const home = await call('/');
if (home.status !== 200) throw new Error(`home ${home.status}`);
const html = await home.text();
if (!html.includes('Twelve signals')) throw new Error('home missing heading');
if (!html.includes('Renewal motion')) throw new Error('drafts missing');
const act = await call('/api/actions', { method: 'POST', body: JSON.stringify({ actionId: 'act-sig-06', decision: 'approved', note: 'call A. Rivera this week' }) });
if (act.status !== 200) throw new Error(`action ${act.status}: ${await act.text()}`);
const bad = await call('/api/actions', { method: 'POST', body: JSON.stringify({ actionId: 'act-sig-06', decision: 'maybe' }) });
if (bad.status !== 400) throw new Error(`expected 400, got ${bad.status}`);
const nf = await call('/api/actions', { method: 'POST', body: JSON.stringify({ actionId: 'act-nope', decision: 'approved' }) });
if (nf.status !== 404) throw new Error(`expected 404, got ${nf.status}`);
const home2 = await call('/');
const html2 = await home2.text();
if (!html2.includes('call A. Rivera this week')) throw new Error('note not persisted');
console.log('e2e pass');
