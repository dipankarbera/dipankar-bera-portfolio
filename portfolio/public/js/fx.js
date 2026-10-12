/* Interactive layer: typing, cursor, tilt, counters, and filters */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* ---------- 1. Cursor + spotlight + hero parallax ---------- */
  if (fine) {
    const dot = $('#curDot'), ring = $('#curRing'), spot = $('#spot');
    let x = 0, y = 0, rx = 0, ry = 0, started = false;
    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      dot.style.left = x + 'px'; dot.style.top = y + 'px';
      spot.style.setProperty('--sx', x + 'px'); spot.style.setProperty('--sy', y + 'px');
      if (!started) { started = true; rx = x; ry = y; dot.classList.add('show'); ring.classList.add('show'); }
    }, { passive: true });
    document.addEventListener('pointerleave', () => { dot.classList.remove('show'); ring.classList.remove('show'); started = false; });
    (function loop() { rx += (x - rx) * .18; ry += (y - ry) * .18; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(loop); })();
    document.addEventListener('pointerover', e => ring.classList.toggle('hot', !!e.target.closest('a,button,input,textarea,.avatar,.card,.chip--btn')));

  }

  /* ---------- 2. Card tilt + glare (event delegation: works on rendered cards) ---------- */
  if (fine && !reduce) {
    const SEL = '.card,.honor,.skill,.exp,.focus article,.stats div';
    let raf = 0, cur = null;
    document.addEventListener('pointermove', e => {
      const el = e.target.closest(SEL);
      if (cur && cur !== el) { cur.classList.remove('is-hover'); cur.style.removeProperty('--rx'); cur.style.removeProperty('--ry'); }
      cur = el;
      if (!el) return;
      el.classList.add('tilt', 'is-hover');
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const b = el.getBoundingClientRect(), px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
        el.style.setProperty('--ry', ((px - .5) * 8).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((.5 - py) * 8).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (px * 100) + '%'); el.style.setProperty('--my', (py * 100) + '%');
      });
    }, { passive: true });
    document.addEventListener('pointerleave', () => { if (cur) cur.classList.remove('is-hover'); cur = null; });
  }

  /* ---------- 3. Counters, progress bar, back-to-top ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.count, pre = el.dataset.prefix || '', t0 = performance.now();
    const step = t => { const p = Math.min((t - t0) / 1200, 1); el.textContent = pre + Math.round((1 - Math.pow(1 - p, 3)) * to); if (p < 1) requestAnimationFrame(step); };
    reduce ? el.textContent = pre + to : requestAnimationFrame(step);
    io.unobserve(el);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => io.observe(el));

  const bar = $('#progress'), top = $('#toTop');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    top.classList.toggle('show', scrollY > 700);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* ---------- 4. Project filter + "click a skill" filter ---------- */
  const state = { cat: 'all', skill: null, skillLabel: null, search: '' };
  const grid = $('#projectsGrid'), empty = $('#projEmpty'), note = $('#skillNote'), noteText = $('#skillNoteText');
  function applyFilters() {
    const cards = $$('.card', grid);
    let shown = 0;
    cards.forEach(c => {
      const okCat = state.cat === 'all' || c.dataset.cat === state.cat;
      const stack = (c.dataset.stack || '').split('|');
      const mentions = ` ${(c.dataset.mentions || '').replace(/[^a-z0-9+#.]+/g, ' ')} `;
      const skillPhrase = state.skill ? state.skill.replace(/[^a-z0-9+#.]+/g, ' ').trim() : '';
      const okSkill = !state.skill || stack.includes(state.skill) || mentions.includes(` ${skillPhrase} `);
      const okSearch = !state.search || (c.dataset.search || '').includes(state.search);
      c.hidden = !(okCat && okSkill && okSearch); if (!c.hidden) shown++;
    });
    $$('.fbtn').forEach(b => {
      const active = b.dataset.filter === state.cat;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    $$('.chip--btn').forEach(b => {
      const active = b.dataset.skill === state.skill;
      b.classList.toggle('on', active);
      b.setAttribute('aria-pressed', String(active));
    });
    note.hidden = !state.skill;
    if (state.skill) noteText.textContent = `Showing projects that use “${state.skillLabel}”`;
    empty.hidden = shown > 0 || !cards.length;
    if (!empty.hidden) empty.textContent = state.skill
      ? `No listed project documents using “${state.skillLabel}”. Clear the skill filter to see all projects.`
      : state.search ? 'No projects match this search.' : 'No projects in this category yet.';
  }
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('.fbtn'); if (!b) return;
    state.cat = b.dataset.filter; applyFilters();
  });
  $('#projectSearch').addEventListener('input', e => {
    state.search = e.target.value.trim().toLowerCase();
    applyFilters();
  });
  $('#skillClear').addEventListener('click', () => { state.skill = null; applyFilters(); });
  document.addEventListener('click', e => {
    const c = e.target.closest('.chip--btn'); if (!c) return;
    state.skill = state.skill === c.dataset.skill ? null : c.dataset.skill;
    state.skillLabel = state.skill ? c.textContent.trim() : null;
    state.cat = 'all'; applyFilters();
    if (state.skill) $('#projects').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  document.addEventListener('portfolio:rendered', applyFilters);

})();
