// Motion layer (17 Sep 2026): scroll reveal + count-up. One small vanilla file so it ports to the
// WordPress theme as-is. Blocks stay untouched: targets are picked by selector here.
// Purpose of each: reveal = bridges content in as you reach it (staggered so groups read in order);
// count-up = draws the eye to the key figures once. Both are skipped or softened for reduced motion.

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
    const target = Number(match[2].replace(/[^\d]/g, ''));
    if (!Number.isFinite(target)) return [];
    // A bare year ("2008") is a date, not a quantity: counting up to it reads as a glitch.
    if (!match[1] && !match[3] && target >= 1900 && target <= 2100) return [];
    // Reserve the final width so neighbours never shift while the digits run.
    el.style.minWidth = `${el.getBoundingClientRect().width}px`;
    el.style.display = 'inline-block';
    const item = { el, prefix: match[1], target, suffix: match[3], final: el.textContent ?? '' };
    el.textContent = `${item.prefix}0${item.suffix}`;
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
          item.el.textContent = `${item.prefix}${Math.round(item.target * easeOutExpo(t))}${item.suffix}`;
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

initReveal();
initCountUp();
