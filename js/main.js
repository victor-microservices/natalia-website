/**
 * Natália Vicente — Nail Designer
 * Main script: mobile navigation with focus management.
 */
(function () {
  'use strict';

  const body     = document.body;
  const toggle   = document.querySelector('[data-nav-toggle]');
  const drawer   = document.querySelector('[data-nav-drawer]');
  const backdrop = document.querySelector('[data-nav-backdrop]');

  if (!toggle || !drawer || !backdrop) return;

  const drawerLinks  = drawer.querySelectorAll('a');
  const focusableSel = 'a[href], button:not([disabled])';
  let lastFocused    = null;

  function openNav() {
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    body.classList.add('no-scroll');
    const first = drawer.querySelector(focusableSel);
    if (first) first.focus();
  }

  function closeNav() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('no-scroll');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  // Keep focus inside the drawer while it is open.
  function trapFocus(e) {
    if (e.key !== 'Tab' || !isOpen()) return;
    const focusables = drawer.querySelectorAll(focusableSel);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener('click', () => (isOpen() ? closeNav() : openNav()));
  backdrop.addEventListener('click', closeNav);
  drawerLinks.forEach((link) => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeNav();
    trapFocus(e);
  });

  // Close drawer if viewport crosses the desktop breakpoint.
  window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
    if (e.matches && isOpen()) closeNav();
  });
})();

/**
 * Love letters carousel — one testimonial at a time, scroll-snap + dots + arrows.
 */
(function () {
  'use strict';

  const root = document.querySelector('[data-love-carousel]');
  if (!root) return;

  const track  = root.querySelector('[data-love-track]');
  const prev   = root.querySelector('[data-love-prev]');
  const next   = root.querySelector('[data-love-next]');
  const dotsEl = root.querySelector('[data-love-dots]');
  if (!track || !prev || !next || !dotsEl) return;

  const slides = Array.from(track.querySelectorAll('.shot'));
  if (slides.length === 0) return;

  // Build dots (plain buttons — role=tab would conflict with carousel semantics)
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
    b.addEventListener('click', () => scrollToIndex(i));
    dotsEl.appendChild(b);
    return b;
  });

  let currentIndex = 0;

  function scrollToIndex(i) {
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    slides[clamped].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  function updateActive() {
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closest = 0;
    let minDist = Infinity;
    slides.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < minDist) { minDist = d; closest = i; }
    });
    if (closest !== currentIndex) currentIndex = closest;
    dots.forEach((d, i) => d.setAttribute('aria-current', i === currentIndex ? 'true' : 'false'));
    prev.disabled = currentIndex === 0;
    next.disabled = currentIndex === slides.length - 1;
  }

  prev.addEventListener('click', () => scrollToIndex(currentIndex - 1));
  next.addEventListener('click', () => scrollToIndex(currentIndex + 1));

  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); scrollToIndex(currentIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollToIndex(currentIndex + 1); }
  });

  let scrollRaf = 0;
  track.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      updateActive();
    });
  });

  window.addEventListener('resize', updateActive);
  updateActive();
})();
