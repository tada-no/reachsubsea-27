// Reach Subsea 2027: Figma build helpers for file HAvCQCXzWNFOKQ1AZxqNTX.
// Paste at the top of a use_figma script (plain JS, top-level await is fine).
// Rule: every fill, stroke, padding, gap, radius and text style binds to an existing
// Phase 1 variable or style. Fixed geometry (control heights, icon boxes, stroke widths) is the only raw value.

const PAGE_COMPONENTS = '12:24';

const V = {
  bg: { default: 'VariableID:8:22', tint: 'VariableID:8:23', accentSubtle: 'VariableID:8:24', disabled: 'VariableID:8:25', overlay: 'VariableID:8:26', errorSubtle: 'VariableID:8:27', successSubtle: 'VariableID:8:28' },
  text: { primary: 'VariableID:8:29', secondary: 'VariableID:8:30', accent: 'VariableID:8:31', disabled: 'VariableID:8:32', onOverlay: 'VariableID:8:33', error: 'VariableID:8:34', success: 'VariableID:8:35' },
  border: { subtle: 'VariableID:8:36', default: 'VariableID:8:37', strong: 'VariableID:8:38', accent: 'VariableID:8:39', focus: 'VariableID:8:40', error: 'VariableID:8:41' },
  icon: { primary: 'VariableID:8:42', accent: 'VariableID:8:43' },
  action: {
    primary: { bg: 'VariableID:8:44', bgHover: 'VariableID:8:45', fg: 'VariableID:8:46' },
    secondary: { bg: 'VariableID:8:47', bgHover: 'VariableID:8:48', fg: 'VariableID:8:49' },
    outline: { border: 'VariableID:8:50', fg: 'VariableID:8:51', bgHover: 'VariableID:8:52' },
  },
  space: { 0: 'VariableID:9:22', 4: 'VariableID:9:23', 8: 'VariableID:9:24', 12: 'VariableID:9:25', 16: 'VariableID:9:26', 24: 'VariableID:9:27', 32: 'VariableID:9:28', 40: 'VariableID:9:29', 48: 'VariableID:9:30', 56: 'VariableID:9:31', 64: 'VariableID:9:32', 72: 'VariableID:9:33', 80: 'VariableID:9:34', 96: 'VariableID:9:35', 112: 'VariableID:9:36', 128: 'VariableID:9:37', 160: 'VariableID:9:38' },
  radius: { none: 'VariableID:9:39', sm: 'VariableID:9:40', md: 'VariableID:9:41', lg: 'VariableID:9:42', xl: 'VariableID:9:43', full: 'VariableID:9:44' },
  layout: { sectionSm: 'VariableID:9:45', sectionMd: 'VariableID:9:46', sectionLg: 'VariableID:9:47', stackXs: 'VariableID:9:48', stackSm: 'VariableID:9:49', stackMd: 'VariableID:9:50', stackLg: 'VariableID:9:51', stackXl: 'VariableID:9:52', gridMargin: 'VariableID:9:53', gridGutter: 'VariableID:9:54', containerWide: 'VariableID:9:56', containerContent: 'VariableID:9:57' },
};
const COLL = { color: 'VariableCollectionId:7:23', layout: 'VariableCollectionId:7:26', type: 'VariableCollectionId:7:27' };
const MODE = { light: '7:1', navy: '7:2', layoutDesktop: '7:5', layoutMobile: '7:6', typeDesktop: '7:7', typeMobile: '7:8' };

// Tabler Outline icon components (docs/extract/figma-icons-ledger.json). Glyph = the stroked vector inside.
const ICON = {
  'arrow-right': '23:26', 'arrow-left': '23:37', 'arrow-up-right': '23:47', 'arrow-down': '23:58', 'chevron-down': '23:67', 'chevron-up': '23:74', 'chevron-left': '23:81', 'chevron-right': '23:88',
  plus: '23:96', minus: '24:33', x: '24:41', check: '24:50', 'menu-2': '24:59', search: '24:69', 'adjustments-horizontal': '24:86', home: '24:97', dots: '24:108',
  download: '24:119', 'file-text': '25:46', 'file-type-pdf': '25:60', 'player-play': '25:69', share: '25:80', maximize: '25:92', photo: '25:104',
  'map-pin': '25:114', phone: '25:123', mail: '25:131', calendar: '26:56', clock: '26:66', world: '26:79', user: '26:89', users: '26:101', building: '26:117',
  'info-circle': '26:128', 'alert-circle': '26:139', 'circle-check': '26:149', 'brand-linkedin': '27:64', 'brand-facebook': '27:73', 'brand-instagram': '27:82', 'brand-youtube': '27:92',
  ship: '27:104', anchor: '27:114', submarine: '27:125', drone: '27:142', crane: '27:154', gauge: '28:72', 'ruler-measure': '28:89', leaf: '28:99', certificate: '28:113', briefcase: '28:125', 'chart-line': '28:135', lock: '28:146',
};

const _var = {};
async function vr(id) { return _var[id] || (_var[id] = await figma.variables.getVariableByIdAsync(id)); }
async function paint(id) { return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', await vr(id)); }
async function setFill(node, id) { node.fills = id ? [await paint(id)] : []; }
async function setStroke(node, id, weight = 1, align = 'INSIDE') { node.strokes = [await paint(id)]; node.strokeWeight = weight; node.strokeAlign = align; }
async function bind(node, field, id) { node.setBoundVariable(field, await vr(id)); }
async function setGap(node, id) { await bind(node, 'itemSpacing', id); }
async function setPadding(node, { x, y, top, right, bottom, left }) {
  const map = { paddingTop: top ?? y, paddingBottom: bottom ?? y, paddingLeft: left ?? x, paddingRight: right ?? x };
  for (const [field, id] of Object.entries(map)) if (id) await bind(node, field, id);
}
async function setRadius(node, id) { for (const f of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) await bind(node, f, id); }
async function setMode(node, collectionId, modeId) { node.setExplicitVariableModeForCollection(await figma.variables.getVariableCollectionByIdAsync(collectionId), modeId); }

let _textStyles, _effectStyles;
async function textStyle(name) { _textStyles = _textStyles || await figma.getLocalTextStylesAsync(); const s = _textStyles.find(s => s.name === name); if (!s) throw new Error('Missing text style ' + name); return s; }
async function effectStyle(name) { _effectStyles = _effectStyles || await figma.getLocalEffectStylesAsync(); const s = _effectStyles.find(s => s.name === name); if (!s) throw new Error('Missing effect style ' + name); return s; }
async function loadInter() { await Promise.all(['Regular', 'Medium', 'Bold'].map(style => figma.loadFontAsync({ family: 'Inter', style }))); }

// Text node with a text style and a bound colour. Wrap later with wrapText(node, width) once it's parented.
async function makeText(chars, style, colorId, name) {
  const t = figma.createText();
  await t.setTextStyleIdAsync((await textStyle(style)).id);
  t.characters = chars;
  await setFill(t, colorId);
  if (name) t.name = name;
  return t;
}
function wrapText(t, width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height); }

// Focus ring = CSS `outline: 2px solid var(border/focus); outline-offset: 2px`.
// Drawn as an absolute child frame 4px larger on every side with a 2px inside stroke.
// (Spread drop shadows bound to variables did not render, so don't use effects for this.)
// Call AFTER the node's children are appended, so the width is final. radiusId = the node's own radius token.
// offsetX/offsetY = distance of the ring's outer edge from the node (default 4 = 2px gap + 2px ring).
// Text-only nodes with no side padding (Link, Menu link) use offsetX 8 so the ring doesn't touch the label.
async function focusRing(node, radiusId, offsetX = 4, offsetY = 4) {
  node.clipsContent = false;
  const ring = figma.createFrame();
  ring.name = 'Focus ring';
  node.appendChild(ring);
  ring.layoutPositioning = 'ABSOLUTE';
  ring.resize(node.width + offsetX * 2, node.height + offsetY * 2);
  ring.x = -offsetX; ring.y = -offsetY;
  ring.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
  ring.fills = [];
  await setStroke(ring, V.border.focus, 2, 'INSIDE');
  if (radiusId) await setRadius(ring, radiusId);
  return ring;
}

// Icon instance at a size, with its Glyph stroke re-bound to a colour role.
async function iconInstance(name, size, colorId, layerName = 'Icon') {
  const comp = await figma.getNodeByIdAsync(ICON[name]);
  const inst = comp.createInstance();
  inst.resize(size, size);
  inst.name = layerName;
  if (colorId) await recolorIcon(inst, colorId);
  return inst;
}
async function recolorIcon(inst, colorId) {
  const p = await paint(colorId);
  for (const g of inst.findAll(n => n.name === 'Glyph')) { if (g.strokes.length) g.strokes = [p]; if (g.fills.length) g.fills = [p]; }
}

// Parse "Style=Primary, Size=Medium" into { Style: 'Primary', Size: 'Medium' }.
function variantProps(node) { return Object.fromEntries(node.name.split(', ').map(s => s.split('='))); }

// Lay out a component set on a grid. colOf/rowOf map variant props to indices.
async function gridVariants(set, colOf, rowOf, gap = 24, pad = 32) {
  const kids = set.children.map(c => ({ c, p: variantProps(c) }));
  const colW = {}, rowH = {};
  for (const k of kids) { const ci = colOf(k.p), ri = rowOf(k.p); colW[ci] = Math.max(colW[ci] || 0, k.c.width); rowH[ri] = Math.max(rowH[ri] || 0, k.c.height); }
  const xs = {}, ys = {};
  let x = pad; for (const i of Object.keys(colW).map(Number).sort((a, b) => a - b)) { xs[i] = x; x += colW[i] + gap; }
  let y = pad; for (const i of Object.keys(rowH).map(Number).sort((a, b) => a - b)) { ys[i] = y; y += rowH[i] + gap; }
  for (const k of kids) { k.c.x = xs[colOf(k.p)]; k.c.y = ys[rowOf(k.p)]; }
  set.resizeWithoutConstraints(x - gap + pad, y - gap + pad);
  await setFill(set, V.bg.default);
  await setStroke(set, V.border.subtle, 1);
  await setRadius(set, V.radius.md);
}

// Documentation frame, matching the Foundations page: stacked in one column at x=0, 160px below the lowest frame.
async function docFrame({ name, eyebrow = 'Components', title, description }) {
  const page = figma.currentPage;
  let bottom = -160;
  for (const c of page.children) bottom = Math.max(bottom, c.y + c.height);
  const frame = figma.createAutoLayout('VERTICAL', { name });
  page.appendChild(frame);
  frame.x = 0; frame.y = bottom + 160;
  frame.minWidth = 1440;
  await setPadding(frame, { x: V.space[64], y: V.space[64] });
  await setGap(frame, V.layout.stackLg);
  await setFill(frame, V.bg.default);
  const header = figma.createAutoLayout('VERTICAL', { name: 'Header' });
  frame.appendChild(header);
  await setGap(header, V.layout.stackSm);
  header.fills = [];
  const e = await makeText(eyebrow, 'UI/Eyebrow', V.text.accent, 'Eyebrow');
  const t = await makeText(title, 'Heading/H2', V.text.primary, 'Title');
  const d = await makeText(description, 'Body/Body', V.text.secondary, 'Description');
  header.appendChild(e); header.appendChild(t); header.appendChild(d);
  wrapText(d, 880);
  return { frame, header };
}

// Labelled row/column inside a doc frame (for Light/Navy previews, examples, notes).
async function docGroup(parent, label, dir = 'HORIZONTAL', gapId = V.space[24]) {
  const wrap = figma.createAutoLayout('VERTICAL', { name: 'Group/' + label });
  parent.appendChild(wrap);
  wrap.fills = [];
  await setGap(wrap, V.space[16]);
  wrap.appendChild(await makeText(label, 'Body/Caption', V.text.secondary, 'Label'));
  const row = figma.createAutoLayout(dir, { name: 'Content' });
  wrap.appendChild(row);
  row.fills = [];
  await setGap(row, gapId);
  return { wrap, row };
}

// ---------------------------------------------------------------------------
// Phase 3 Blocks (docs/05-blocks-spec.md, IDs in docs/extract/figma-blocks-ledger.json)
// Blocks page docFrame: docFrame({ name: 'Blocks / <Name>', eyebrow: 'Blocks · <group>', ... }) after
// `await figma.setCurrentPageAsync(await figma.getNodeByIdAsync(PAGE_BLOCKS))`.
// ---------------------------------------------------------------------------
const PAGE_BLOCKS = '12:25';
ICON.quote = '137:2717'; // added in Phase 3 for the Statement block

// Phase 2 components used inside blocks (sets unless noted).
const COMP = {
  logo: '54:29', button: '56:177', iconButton: '63:210', link: '68:326', badge: '87:249', eyebrow: '89:268', stat: '90:284',
  metaItem: '91:286' /* component */, filterChip: '92:337', breadcrumb: '93:366', accordionItem: '98:412', subnavItem: '101:448', subnav: '102:460',
  card: '103:1110', cardPreset: { Service: '113:672', Asset: '113:718', Project: '114:724', News: '114:772', Event: '114:809', Person: '115:801', Document: '115:844', Office: '115:889' },
};
// Phase 3 shared parts.
const PART = {
  sectionHeader: '130:68', mediaFrame: '131:100', specRow: '131:128' /* component */, numberedItem: '132:116', milestone: '132:207',
  dialog: '133:259', logoTile: '136:252', consent: '136:361',
};

// Variant of a set by its exact name, e.g. await variantOf(COMP.link, 'Action=File, Size=Small, State=Default').
async function variantOf(setId, name) {
  const set = await figma.getNodeByIdAsync(setId);
  const v = set.type === 'COMPONENT_SET' ? set.children.find(c => c.name === name) : set;
  if (!v) throw new Error(`No variant "${name}" in ${set.name}`);
  return v;
}
// Property key by name, read from the SET (never from a variant), e.g. propKey(linkSet, 'Label') → 'Label#68:0'.
function propKey(set, name) {
  const k = Object.keys(set.componentPropertyDefinitions).find(k => k.split('#')[0] === name);
  if (!k) throw new Error(`No property "${name}" on ${set.name}`);
  return k;
}
// Style a component set frame like every other set (white, subtle border, radius/md).
async function styleSet(set) { await setFill(set, V.bg.default); await setStroke(set, V.border.subtle, 1); await setRadius(set, V.radius.md); }
// Section-width preview surface for doc examples: kind = 'Light' | 'Tint' | 'Navy'.
async function surface(parent, kind, width = 1440, dir = 'VERTICAL') {
  const s = figma.createAutoLayout(dir, { name: 'Surface/' + kind });
  parent.appendChild(s);
  s.resize(width, 100);
  if (dir === 'VERTICAL') { s.counterAxisSizingMode = 'FIXED'; s.primaryAxisSizingMode = 'AUTO'; } else { s.primaryAxisSizingMode = 'FIXED'; s.counterAxisSizingMode = 'AUTO'; }
  await setPadding(s, { x: V.layout.gridMargin, y: V.space[64] });
  await setMode(s, COLL.color, kind === 'Navy' ? MODE.navy : MODE.light);
  await setFill(s, kind === 'Tint' ? V.bg.tint : V.bg.default);
  return s;
}
// Bottom- or top-only 1px rule on an auto-layout frame (call after setStroke).
function edgeStroke(node, edge = 'bottom') { node.strokeTopWeight = edge === 'top' ? 1 : 0; node.strokeBottomWeight = edge === 'bottom' ? 1 : 0; node.strokeLeftWeight = 0; node.strokeRightWeight = 0; }

// Block component skeleton: fixed width (1440 Desktop / 375 Mobile), hug height, bg/default, grid/margin sides,
// section/md top and bottom, stack/xl gap, Mobile modes on Mobile.
async function blockVariant(parent, name, breakpoint, dir = 'VERTICAL') {
  const c = figma.createComponent();
  parent.appendChild(c);
  c.name = name;
  c.layoutMode = dir;
  c.resize(breakpoint === 'Mobile' ? 375 : 1440, 100);
  if (dir === 'VERTICAL') { c.counterAxisSizingMode = 'FIXED'; c.primaryAxisSizingMode = 'AUTO'; } else { c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'AUTO'; }
  await setFill(c, V.bg.default);
  await setPadding(c, { x: V.layout.gridMargin, y: V.layout.sectionMd });
  await setGap(c, V.layout.stackXl);
  if (breakpoint === 'Mobile') { await setMode(c, COLL.layout, MODE.layoutMobile); await setMode(c, COLL.type, MODE.typeMobile); }
  return c;
}
// Phase 3 gotchas (details in the blocks ledger notes):
// - Media frame height follows width (lockAspectRatio). Resize an instance's WIDTH only; nested height overrides are ignored.
// - TEXT properties share their default across variants; set per-instance text with setProperties after creating instances.
// - After an INSTANCE_SWAP on an icon, re-run recolorIcon().
// - Stat (90:284) Label/Note texts are FIXED 192 wide. Inside a narrower or wider slot, set each Stat instance's TEXT
//   children to textAutoResize = 'HEIGHT' then layoutSizingHorizontal = 'FILL' (instance override; works).
// - Hidden nested instances have no children until their Show… boolean is on: setProperties first, then findAll.
// - Block sets are named 'Block/<Name>'; shared parts keep plain names (Section header, Media frame…).
