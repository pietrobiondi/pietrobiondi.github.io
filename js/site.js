(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const themeButton = document.querySelector('.theme-toggle');
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const next = theme === 'dark' ? 'light' : 'dark';
    themeButton?.setAttribute('aria-label', `Switch to ${next} theme`);
    themeButton?.setAttribute('title', `Switch to ${next} theme`);
    try { localStorage.setItem('pb-theme', theme); } catch (error) { /* dark remains the safe default */ }
  };
  setTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const toggle = document.querySelector('.nav-toggle');
  const panel = document.querySelector('.nav-panel');
  const closeMenu = () => { panel?.removeAttribute('data-open'); toggle?.setAttribute('aria-expanded', 'false'); toggle?.querySelector('.sr-only').textContent = 'Open navigation'; };
  toggle?.addEventListener('click', () => {
    const isOpen = panel?.getAttribute('data-open') === 'true';
    if (isOpen) closeMenu(); else { panel?.setAttribute('data-open', 'true'); toggle.setAttribute('aria-expanded', 'true'); toggle.querySelector('.sr-only').textContent = 'Close navigation'; }
  });
  panel?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && panel?.getAttribute('data-open') === 'true') { closeMenu(); toggle?.focus(); } });

  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', link.getAttribute('href'));
  }));

  document.querySelectorAll('[data-disclosure]').forEach((button) => {
    const items = [...document.querySelectorAll(button.dataset.disclosure)];
    const original = button.textContent.replace(/\s*[↓↑]\s*$/, '').trim();
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      items.forEach((item) => item.classList.toggle('is-shown', !expanded));
      button.setAttribute('aria-expanded', String(!expanded));
      const label = expanded ? original : original.replace('Show all', 'Show less');
      button.innerHTML = `${label} <span aria-hidden="true">${expanded ? '↓' : '↑'}</span>`;
    });
  });

  const search = document.querySelector('#publication-search');
  const publications = [...document.querySelectorAll('[data-publication]')];
  const count = document.querySelector('#publication-count');
  const noResults = document.querySelector('.no-results');
  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase(); let matches = 0;
    publications.forEach((item) => { const match = item.textContent.toLowerCase().includes(query); item.hidden = !match; if (match) { matches += 1; item.classList.add('is-shown'); } });
    count.textContent = query ? `${matches} of ${publications.length} publications` : '';
    noResults.hidden = matches !== 0;
  });

  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const setCurrent = (id) => links.forEach((link) => link.toggleAttribute('aria-current', link.getAttribute('href') === `#${id}`));
  if ('IntersectionObserver' in window) {
    const navigationObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setCurrent(entry.target.id); }), { rootMargin: '-35% 0px -55%', threshold: 0 });
    sections.forEach((section) => navigationObserver.observe(section));
    if (!reduced) { const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .08 }); document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element)); }
  } else document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
