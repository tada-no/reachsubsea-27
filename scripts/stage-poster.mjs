// Render the Model stage's hero frame straight from the WebGL canvas (no DOM overlays) and save it as a JPEG.
// node scripts/stage-poster.mjs <url> <width> <height> <dpr> <outW> <quality> <out.jpg>
// Use the page with ?poster (the scene held at time 0). The six Reach Remote stills (docs/05 §2.32):
//   U="http://localhost:4321/assets/reach-remote/?poster"
//   node scripts/stage-poster.mjs "$U" 1600 1200 1 1600 0.7 public/images/reach-remote-stage-poster-4x3.jpg
//   node scripts/stage-poster.mjs "$U" 1920 1200 1 1920 0.7 public/images/reach-remote-stage-poster-16x10.jpg
//   node scripts/stage-poster.mjs "$U" 2160 1200 1 2160 0.7 public/images/reach-remote-stage-poster-9x5.jpg
//   node scripts/stage-poster.mjs "$U" 2400 1200 1 2400 0.7 public/images/reach-remote-stage-poster-2x1.jpg
//   node scripts/stage-poster.mjs "$U" 2880 1200 1 2880 0.7 public/images/reach-remote-stage-poster-12x5.jpg
//   node scripts/stage-poster.mjs "$U" 400 1000 2 800 0.7 public/images/reach-remote-stage-poster-phone.jpg
// One at a time: parallel headless WebGL runs stall.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
const [url, W, H, DPR, OUTW, Q, out] = process.argv.slice(2);
const port = 9333 + Math.floor(Math.random() * 500);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--hide-scrollbars', '--enable-unsafe-swiftshader', `--remote-debugging-port=${port}`, `--user-data-dir=${os.tmpdir()}/reach-poster-${port}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 60; i++) { try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); if (target) break; } catch {} await sleep(150); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const w = Number(W), h = Number(H);
await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: Number(DPR), mobile: w < 600 });
await send('Page.enable');
await send('Page.navigate', { url });
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result;
for (let i = 0; i < 80; i++) { const r = await evalJs(`!!(window.__rr && !document.querySelector('[data-stage]').classList.contains('is-loading') && __rr.holder.children.length > 2)`); if (r?.result?.value) break; await sleep(250); }
await sleep(5000);
const res = await evalJs(`(() => { const r = __rr.renderer; r.render(__rr.scene, __rr.camera); const src = r.domElement; const ow = ${Number(OUTW)}; const oh = Math.round(src.height * ow / src.width); const c = document.createElement('canvas'); c.width = ow; c.height = oh; const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(src, 0, 0, ow, oh); return { size: [src.width, src.height, ow, oh], data: c.toDataURL('image/jpeg', ${Number(Q)}) }; })()`);
const v = res.result.value;
fs.writeFileSync(out, Buffer.from(v.data.split(',')[1], 'base64'));
console.log(out, v.size, fs.statSync(out).size);
ws.close(); chrome.kill(); process.exit(0);
