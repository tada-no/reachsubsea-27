// Motion layer (17 Sep 2026): scroll reveal + count-up + pictogram loops. One small vanilla file so
// it ports to the WordPress theme as-is. Blocks stay untouched: targets are picked by selector here.
// Purpose of each: reveal = bridges content in as you reach it (staggered so groups read in order);
// count-up = draws the eye to the key figures once; pictogram loops (18 Sep 2026) = each service
// pictogram acts out its subject once as its card settles, and again on hover. All are skipped or
// softened for reduced motion.

const REVEAL_TARGETS = [
  '.section-header',
  '.card-grid__item',
  '.feed-grid__item',
  '.stats-band__group',
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
        el.classList.add('is-revealed');
        el.addEventListener('transitionend', () => el.classList.add('is-settled'), { once: true });
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

initReveal();
initCountUp();
initWipe();
initPictogramLoops();
