// Favicon set from the brand icon (Reach-icon-600x600.svg: navy R, sage bars bleeding to the edges).
// Usage: node scripts/favicon.mjs [--full]   →  public/favicon.svg, public/favicon.ico (16 + 32 PNG
// entries), public/apple-touch-icon.png (180, navy tile). Default crops the 600 canvas to the 478 px
// square around the R (60 px of each bar still runs to the edge) so the mark reads at 16 px; --full
// keeps the whole canvas. The SVG follows the tab's colour scheme: navy R in light, white R in dark; bars stay sage.
import fs from 'node:fs';
import sharp from 'sharp';

const NAVY = '#282c59'; // --wp--preset--color--navy-800
const SAGE = '#6eaa8c'; // --wp--preset--color--sage-400
const R = 'M131,181.4v53h268.5v39.4H159.1c-15.6,0-28.1,12.6-28.1,28.1v117.2h69.5v-92.4h123.8l92.4,92.4h85.1l-92.4-92.4h31.5c15.6,0,28.1-12.6,28.1-28.1v-89.1c0-15.6-12.6-28.1-28.1-28.1L131,181.4L131,181.4z';
const BARS = 'M110.4,302c0-10.9,4-20.5,10.9-28.1H-0.2v53h110.6V302z M489.2,298.6c0,10.9-4,20.5-10.9,28.1h121.5v-53H489.2V298.6z';
const full = process.argv.includes('--full');
const box = full ? '0 0 600 600' : '61 61 478 478';

const svg = (rFill, tile) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}">${tile ? `<rect x="-10" y="-10" width="620" height="620" fill="${NAVY}"/>` : ''}<path fill="${rFill}" d="${R}"/><path fill="${SAGE}" d="${BARS}"/></svg>`;
const adaptive = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}"><style>.r{fill:${NAVY}}@media (prefers-color-scheme:dark){.r{fill:#fff}}</style><path class="r" d="${R}"/><path fill="${SAGE}" d="${BARS}"/></svg>`;

const png = (markup, size) => sharp(Buffer.from(markup), { density: 300 }).resize(size, size).png().toBuffer();
/** ICO container with PNG-compressed entries (every current browser reads these). */
function ico(entries) {
  const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
  let offset = 6 + 16 * entries.length; const dirs = []; const datas = [];
  for (const { size, data } of entries) {
    const d = Buffer.alloc(16); d[0] = size === 256 ? 0 : size; d[1] = size === 256 ? 0 : size; d[2] = 0; d[3] = 0;
    d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6); d.writeUInt32LE(data.length, 8); d.writeUInt32LE(offset, 12);
    dirs.push(d); datas.push(data); offset += data.length;
  }
  return Buffer.concat([header, ...dirs, ...datas]);
}

fs.writeFileSync('public/favicon.svg', adaptive);
fs.writeFileSync('public/favicon.ico', ico([{ size: 16, data: await png(svg(NAVY, false), 16) }, { size: 32, data: await png(svg(NAVY, false), 32) }]));
fs.writeFileSync('public/apple-touch-icon.png', await png(svg('#fff', true), 180));
console.log('wrote public/favicon.svg, public/favicon.ico, public/apple-touch-icon.png', full ? '(full canvas)' : '(478 crop)');

// Comparison sheet for review: both crops, bare and on a tile, at 16 / 32 / 64 / 180 on light and dark.
if (process.argv.includes('--sheet')) {
  const out = process.argv[process.argv.indexOf('--sheet') + 1];
  const variants = [['full · bare', '0 0 600 600', false], ['full · tile', '0 0 600 600', true], ['478 crop · bare', '61 61 478 478', false], ['478 crop · tile', '61 61 478 478', true]];
  const sizes = [16, 32, 64, 180]; const cell = 220, rowH = 240, labelW = 160;
  const composites = []; let y = 24;
  for (const [name, vb, tile] of variants) {
    const markup = (rFill) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${tile ? `<rect x="-10" y="-10" width="620" height="620" fill="${NAVY}"/>` : ''}<path fill="${rFill}" d="${R}"/><path fill="${SAGE}" d="${BARS}"/></svg>`;
    composites.push({ input: Buffer.from(`<svg width="${labelW}" height="40"><text x="0" y="28" font-family="Helvetica" font-size="18" fill="#222">${name}</text></svg>`), left: 16, top: y });
    let x = labelW + 16;
    for (const [bg, rFill] of [['#ffffff', tile ? '#fff' : NAVY], ['#202124', '#fff']]) {
      for (const s of sizes) {
        composites.push({ input: Buffer.from(`<svg width="${cell}" height="${rowH}"><rect width="${cell}" height="${rowH}" fill="${bg}"/></svg>`), left: x, top: y });
        const size = Math.min(s, 180); composites.push({ input: await png(markup(rFill), size), left: x + Math.round((cell - size) / 2), top: y + Math.round((rowH - size) / 2) });
        composites.push({ input: Buffer.from(`<svg width="60" height="20"><text x="0" y="14" font-family="Helvetica" font-size="12" fill="${bg === '#ffffff' ? '#666' : '#aaa'}">${s} px</text></svg>`), left: x + 8, top: y + 8 });
        x += cell + 8;
      }
    }
    y += rowH + 16;
  }
  await sharp({ create: { width: labelW + 16 + 8 * (cell + 8) + 16, height: y + 8, channels: 4, background: '#eeeeee' } }).composite(composites).png().toFile(out);
  console.log('sheet', out);
}
