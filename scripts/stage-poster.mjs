// Render the Model stage's hero frame straight from the WebGL canvas (no DOM overlays) and save stills as JPEGs.
// node scripts/stage-poster.mjs <url> <width> <height> <dpr> <quality> <out.jpg>[@<aspect>] …
// One render at that viewport; each still is a centre crop of the canvas at its full height, `@aspect` wide (width /
// height; none: the whole canvas). The stage frames its hero as one picture per band of screen shapes and crops it at
// the sides (src/scripts/reach-remote-stage.ts, HERO), so the crops are exactly what narrower stages of the band show.
// Use the page with ?poster (the scene held at time 0). The eight Reach Remote stills (docs/05 §2.32), one render per
// band:
//   U="http://localhost:4321/assets/reach-remote/?poster"; P=public/images/reach-remote-stage-poster
//   node scripts/stage-poster.mjs "$U" 2880 1200 1 0.7 $P-12x5.jpg $P-2x1.jpg@2 $P-9x5.jpg@1.8 $P-16x10.jpg@1.6
//   node scripts/stage-poster.mjs "$U" 853 640 2 0.7 $P-4x3.jpg
//   node scripts/stage-poster.mjs "$U" 640 640 2 0.7 $P-1x1.jpg
//   node scripts/stage-poster.mjs "$U" 512 640 2 0.7 $P-4x5.jpg
//   node scripts/stage-poster.mjs "$U" 384 640 2 0.7 $P-3x5.jpg
// The four narrower bands render at their edge shape, 640 tall, where the dots strip (under 900) leaves the stage 600
// tall: the widest stage each band can show (16/15 of its edge), so its still covers them all. Portrait bands get the
// lighter sea and sky, so they render with them. On the GPU (Metal, as Macs and iPhones draw it). One at a time:
// parallel headless WebGL runs stall.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
const [url, W, H, DPR, Q, ...outs] = process.argv.slice(2);
const port = 9333 + Math.floor(Math.random() * 500);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--hide-scrollbars', '--use-angle=metal', `--remote-debugging-port=${port}`, `--user-data-dir=${os.tmpdir()}/reach-poster-${port}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 60; i++) { try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); if (target) break; } catch {} await sleep(150); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const w = Number(W), h = Number(H);
await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, screenWidth: w, screenHeight: h, deviceScaleFactor: Number(DPR), mobile: w < 600 });
await send('Page.enable');
await send('Page.navigate', { url });
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result;
for (let i = 0; i < 80; i++) { const r = await evalJs(`!!(window.__rr && !document.querySelector('[data-stage]').classList.contains('is-loading') && __rr.holder.children.length > 2)`); if (r?.result?.value) break; await sleep(250); }
await sleep(5000);
await evalJs(`(() => { __rr.renderer.render(__rr.scene, __rr.camera); window.__still = document.createElement('canvas'); const src = __rr.renderer.domElement; __still.width = src.width; __still.height = src.height; __still.getContext('2d').drawImage(src, 0, 0); return [src.width, src.height]; })()`);
for (const o of outs) {
  const [file, aspect] = o.split('@');
  const res = await evalJs(`(() => { const s = __still; let cw = ${aspect ? `Math.round(s.height * ${Number(aspect)})` : 's.width'}; if ((s.width - cw) % 2) cw += 1; cw = Math.min(cw, s.width); const c = document.createElement('canvas'); c.width = cw; c.height = s.height; c.getContext('2d').drawImage(s, (s.width - cw) / 2, 0, cw, s.height, 0, 0, cw, s.height); return { size: [cw, s.height], of: [s.width, s.height], data: c.toDataURL('image/jpeg', ${Number(Q)}) }; })()`);
  const v = res.result.value;
  fs.writeFileSync(file, Buffer.from(v.data.split(',')[1], 'base64'));
  console.log(file, v.size, 'of', v.of, fs.statSync(file).size);
}
ws.close(); chrome.kill(); process.exit(0);
