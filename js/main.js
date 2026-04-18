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
