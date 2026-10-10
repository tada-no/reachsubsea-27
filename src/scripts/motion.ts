// Motion layer (17 Sep 2026): scroll reveal + count-up + pictogram loops (+ chart grow, charts before figures). One small vanilla file so
// it ports to the WordPress theme as-is. Blocks stay untouched: targets are picked by selector here.
// Purpose of each: reveal = bridges content in as you reach it (staggered so groups read in order);
// count-up = draws the eye to the key figures once; pictogram loops (18 Sep 2026) = each service
// pictogram acts out its subject once as its card settles, and again on hover. All are skipped or
// softened for reduced motion.

const REVEAL_TARGETS = [
  '.section-header',
  '.card-grid__item',
  '.sdg-goals__goal',
  '.comparison__labels',
  '.comparison__column',
  '.figures__tile',
  '.card-bento__item',
  '.statement__rail',
  '.feed-grid__item',
  '.stats-band__group',
  '.results-band__group',
  '.embed__frame',
  '.embed__mobile',
  '.newsroom__lead',
  '.newsroom__side > *',
  '.social-feed__item',
  '.accordion__header',
  '.accordion__list > *',
  '.cta-band__inner',
  '.figures__card',
].join(',');

const MAX_STAGGER = 6;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Charts lead, figures follow (7 Oct 2026, Ross, site-wide): where a chart ([data-grow]: bars, a ring) and counting
// figures are on screen together, the chart draws first and the figures (their group's rise and the count-up)
// start as it finishes, so the eye goes to the picture and then the numbers. A figure with no chart in view
// animates as before. A chart that is in view but not yet grown (it grows once nearly all in view) holds its
// figures for CHART_WAIT at most, so a half-scrolled chart never leaves them hidden.
const CHART_LEAD = 1000;
const CHART_WAIT = 1200;
const charts = [...document.querySelectorAll<HTMLElement>('[data-grow]')];
const chartState = new Map(charts.map((c) => [c, { grownAt: 0, waiters: [] as (() => void)[] }]));

function markGrown(chart: HTMLElement) {
  const state = chartState.get(chart);
  chart.classList.add('is-grown');
  if (!state || state.grownAt) return;
  state.grownAt = performance.now();
  state.waiters.splice(0).forEach((wake) => wake());
}

// Measured when asked (observer callbacks have no set order, so a flag kept by one could still be stale)
function onScreen(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
}

/** Runs `go` now, or once the charts on screen have had their lead. Figures inside or around a chart wait for nothing. */
function afterCharts(el: HTMLElement, go: () => void) {
  if (reduceMotion || el.closest('[data-grow]') || el.querySelector('[data-grow]')) return go();
  const leading = [...chartState.entries()].filter(([c, s]) => onScreen(c) || (s.grownAt && performance.now() - s.grownAt < CHART_LEAD));
  if (leading.length === 0) return go();
  const startAt = () => {
    const readyAt = Math.max(...leading.map(([, s]) => (s.grownAt || performance.now()) + CHART_LEAD));
    window.setTimeout(go, Math.max(0, readyAt - performance.now()));
  };
  const pending = leading.filter(([, s]) => !s.grownAt);
  if (pending.length === 0) return startAt();
  let started = false;
  const once = () => {
    if (started || pending.some(([, s]) => !s.grownAt)) return;
    started = true;
    startAt();
  };
  pending.forEach(([, s]) => s.waiters.push(once));
  window.setTimeout(() => {
    if (started) return;
    started = true;
    go();
  }, CHART_WAIT);
}

function initReveal() {
  const main = document.querySelector('main');
  if (!main || !('IntersectionObserver' in window)) return;

  const targets = [...main.querySelectorAll<HTMLElement>(REVEAL_TARGETS)];
  // Stagger index = position among revealed siblings, so each row/group cascades on its own.
  const counters = new Map<Element, number>();
  targets.forEach((el) => {
    const parent = el.parentElement!;
    const i = counters.get(parent) ?? 0;
    counters.set(parent, i + 1);
    el.style.setProperty('--reveal-i', String(Math.min(i, MAX_STAGGER)));
    el.setAttribute('data-reveal', '');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        const reveal = () => {
          el.classList.add('is-revealed');
          el.addEventListener('transitionend', () => el.classList.add('is-settled'), { once: true });
        };
        // A group of counting figures follows any chart on screen; everything else reveals at once
        if (el.querySelector('[data-count-up]')) afterCharts(el, reveal);
        else reveal();
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  targets.forEach((el) => observer.observe(el));
}

// Count-up: "500+" → 0…500 then the suffix; non-numeric values are left alone.
function initCountUp() {
  const values = [...document.querySelectorAll<HTMLElement>('[data-count-up]')];
  if (values.length === 0 || reduceMotion || !('IntersectionObserver' in window)) return;

  const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const DURATION = 1600;

  const parsed = values.flatMap((el) => {
    const match = (el.textContent ?? '').trim().match(/^(\D*)([\d.,\s]+)(.*)$/);
    if (!match) return [];
    const digits = match[2].trim();
    // Keep the figure's own format while it runs: decimals ("988.1") and thousands commas ("1,850").
    const decimals = (digits.split('.')[1] ?? '').length;
    const grouped = digits.includes(',');
    const target = Number(digits.replace(/[^\d.]/g, ''));
    if (!Number.isFinite(target)) return [];
    // A bare year ("2008") is a date, not a quantity: counting up to it reads as a glitch.
    if (!match[1] && !match[3] && target >= 1900 && target <= 2100) return [];
    // Nor is a ratio ("24/7"): "0/7 … 24/7" reads as a count of something else.
    if (match[3].startsWith('/')) return [];
    // Reserve the final width so neighbours never shift while the digits run.
    el.style.minWidth = `${el.getBoundingClientRect().width}px`;
    el.style.display = 'inline-block';
    const format = (v: number) =>
      grouped
        ? v.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : v.toFixed(decimals);
    const item = { el, prefix: match[1], target, suffix: match[3], final: el.textContent ?? '', format };
    el.textContent = `${item.prefix}${format(0)}${item.suffix}`;
    return [item];
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const item = parsed.find((p) => p.el === entry.target);
        if (!item) return;
        afterCharts(item.el, () => {
          const delay = Number(item.el.dataset.countUpDelay ?? 0);
          const start = performance.now() + delay;
          const tick = (now: number) => {
            const t = Math.min(Math.max((now - start) / DURATION, 0), 1);
            item.el.textContent = `${item.prefix}${item.format(item.target * easeOutExpo(t))}${item.suffix}`;
            if (t < 1) requestAnimationFrame(tick);
            else item.el.textContent = item.final;
          };
          requestAnimationFrame(tick);
        });
      });
    },
    { threshold: 0.6 },
  );
  parsed.forEach((item) => observer.observe(item.el));
}

// Pictogram loops: .pictogram--live SVGs (Pictogram.astro) carry tagged parts with keyframes that
// rest at 0% and 100%. Play = add .is-playing; the loop then runs whole cycles and stops at the
// first cycle boundary where nothing is asking for it (the reveal only asks for one cycle, hover asks
// for as long as the pointer stays). Hover is gated to fine pointers so a tap never fires it.
function initPictogramLoops() {
  const svgs = [...document.querySelectorAll<SVGSVGElement>('.pictogram--live')];
  if (svgs.length === 0 || reduceMotion || !('IntersectionObserver' in window)) return;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const loops = svgs.map((svg) => {
    const lead = svg.querySelector('.pg-lead');
    const card = svg.closest<HTMLElement>('.card, .card-grid__tile') ?? svg;
    const revealed = card.closest<HTMLElement>('[data-reveal]');
    let held = false; // hover / focus wants the loop to keep going

    const play = () => svg.classList.add('is-playing');
    svg.addEventListener('animationiteration', (e) => {
      if (e.target === lead && !held) svg.classList.remove('is-playing');
    });

    if (canHover) {
      card.addEventListener('mouseenter', () => ((held = true), play()));
      card.addEventListener('mouseleave', () => (held = false));
    }
    // Keyboard parity: a focused card link plays the same loop.
    card.addEventListener('focusin', () => ((held = true), play()));
    card.addEventListener('focusout', () => (held = false));

    // First play waits for the card's own reveal to settle, so the two motions never overlap.
    const playOnceSettled = () => {
      if (revealed && !revealed.classList.contains('is-settled')) {
        revealed.addEventListener('transitionend', play, { once: true });
      } else play();
    };
    return { card, playOnceSettled };
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        loops.find((l) => l.card === entry.target)?.playOnceSettled();
      });
    },
    { threshold: 0.5 },
  );
  loops.forEach((l) => observer.observe(l.card));
}

// Wipe (18 Sep 2026): photos marked [data-wipe] uncover from the right edge as they enter, a clip-path
// reveal (no fade) that reads as the image being drawn across. Hidden state only once JS runs.
function initWipe() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-wipe]')];
  if (els.length === 0 || reduceMotion || !('IntersectionObserver' in window)) return;
  // Observe the parent: a fully clipped element never reports as intersecting.
  const byParent = new Map<Element, HTMLElement>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        byParent.get(entry.target)?.classList.add('is-wiped');
      });
    },
    { threshold: 0.3 },
  );
  els.forEach((el) => {
    // Already on screen at load: leave it uncovered.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9 || !el.parentElement) return;
    el.classList.add('will-wipe');
    byParent.set(el.parentElement, el);
    observer.observe(el.parentElement);
  });
}

// Grow (6 Oct 2026): a chart marked [data-grow] gets .is-grown once it is (nearly) all in view, or at once if it is
// on screen at load, so the rise is seen rather than spent below the fold; its block's CSS rises the bars from the
// baseline. The hidden state is CSS (html.js), so reduced motion or no observer grows at once.
function initGrow() {
  if (charts.length === 0) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    charts.forEach(markGrown);
    return;
  }
  // A chart already on screen when the page loads (e.g. just under the hero) grows straight away, even if it is
  // only partly in view (Ross, 7 Oct 2026): waiting for 90% left it half-drawn until the reader scrolled. Two
  // frames first, so its hidden state paints and the growth is seen. Charts further down wait for 90%.
  const atLoad = charts.filter(onScreen);
  requestAnimationFrame(() => requestAnimationFrame(() => atLoad.forEach(markGrown)));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        markGrown(entry.target as HTMLElement);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.9 },
  );
  charts.filter((el) => !atLoad.includes(el)).forEach((el) => observer.observe(el));
}

initGrow();
initReveal();
initCountUp();
initWipe();
initPictogramLoops();
