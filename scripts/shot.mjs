// Review screenshots over the Chrome DevTools Protocol (19 Sep 2026, About build). Unlike plain headless
// Chrome it can emulate 375 and scroll to a position, so sticky/scroll-driven sections and reveals show.
// Usage: node shot.mjs <url> <width> <height> <outprefix> <step>... where step = "sel@offset" (scroll so the
// element's top sits at -offset from the viewport top) or "y:1234" or "full" (full-page capture) or "js:<expr>".
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';

const [url, W, H, out, ...steps] = process.argv.slice(2);
const port = 9333 + Math.floor(Math.random() * 500);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`,
  `--user-data-dir=${os.tmpdir()}/reach-cdp-${port}`, 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); if (target) break; } catch {}
  await sleep(150);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const w = Number(W), h = Number(H);
await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
await send('Page.enable');
await send('Page.navigate', { url });
await sleep(3500);
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
let n = 0;
for (const step of steps.length ? steps : ['y:0']) {
  if (step.startsWith('js:')) { console.log(JSON.stringify(await evalJs(step.slice(3)))); continue; }
  let clip;
  if (step === 'full') {
    // Scroll through once so reveals fire, then capture the whole page
    const total = await evalJs('document.documentElement.scrollHeight');
    for (let y = 0; y < total; y += h / 2) { await evalJs(`scrollTo(0, ${y})`); await sleep(250); }
    await evalJs('scrollTo(0,0)'); await sleep(800);
    const full = await evalJs('document.documentElement.scrollHeight');
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: full, deviceScaleFactor: 1, mobile: w < 600 });
    await sleep(1200);
  } else if (step.startsWith('y:')) {
    await evalJs(`scrollTo(0, ${step.slice(2)})`); await sleep(1600);
  } else {
    const [sel, off = '0'] = step.split('@');
    await evalJs(`(()=>{const el=document.querySelector(${JSON.stringify(sel)}); scrollTo(0, el.getBoundingClientRect().top + scrollY - (${off}));})()`);
    await sleep(1600);
  }
  const shot = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip } : {}) });
  const file = `${out}-${n++}.png`;
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  console.log(file);
}
ws.close(); chrome.kill();
process.exit(0);
