(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const iconPaths = {
    Code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    'Core Subjects': '<path d="M12 4a3 3 0 0 0-5.7 1.3A3.5 3.5 0 0 0 5 12a3.5 3.5 0 0 0 2 6.7A3 3 0 0 0 12 20V4Zm0 0a3 3 0 0 1 5.7 1.3A3.5 3.5 0 0 1 19 12a3.5 3.5 0 0 1-2 6.7A3 3 0 0 1 12 20"/>',
    'Programming & Development': '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    Cybersecurity: '<path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
    'AI and Machine Learning': '<path d="M12 4a3 3 0 0 0-5.7 1.3A3.5 3.5 0 0 0 5 12a3.5 3.5 0 0 0 2 6.7A3 3 0 0 0 12 20V4Zm0 0a3 3 0 0 1 5.7 1.3A3.5 3.5 0 0 1 19 12a3.5 3.5 0 0 1-2 6.7A3 3 0 0 1 12 20"/>',
    'Blockchain and Web3': '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.6 8-4.6M12 12v9"/>',
    'Tools and Platforms': '<path d="M14.5 6.5a5 5 0 0 0-6.8 6.8L3 18l3 3 4.7-4.7a5 5 0 0 0 6.8-6.8L14 13l-3-3 3.5-3.5Z"/>',
    DSA: '<circle cx="12" cy="5" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M12 7v4M12 11 6 16M12 11l6 5"/>',
    OOP: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/><path d="M14 7h4v4M10 17H6v-4"/>',
    DBMS: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
    'Digital Electronics': '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4m-6 12v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/>',
    'Artificial Intelligence & Machine Learning': '<path d="M12 4a3 3 0 0 0-5.7 1.3A3.5 3.5 0 0 0 5 12a3.5 3.5 0 0 0 2 6.7A3 3 0 0 0 12 20V4Zm0 0a3 3 0 0 1 5.7 1.3A3.5 3.5 0 0 1 19 12a3.5 3.5 0 0 1-2 6.7A3 3 0 0 1 12 20"/>',
    'OS Concepts': '<rect x="4" y="4" width="16" height="6" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/><path d="M7 7h.01M7 17h.01m4-10h6m-6 10h6"/>',
    Python: '<path d="M12 3H8a3 3 0 0 0-3 3v4h8V7h5V6a3 3 0 0 0-3-3h-3Z"/><path d="M12 21h4a3 3 0 0 0 3-3v-4h-8v3H6v1a3 3 0 0 0 3 3h3Z"/><circle cx="9" cy="6" r=".6"/><circle cx="15" cy="18" r=".6"/>',
    SQL: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
    Java: '<path d="M8 18h8l-1 3H9l-1-3Zm1-3h6l1 3H8l1-3Zm3-12c2 2-2 3 0 5m3-4c2 2-2 3 0 5M7 15h10"/>',
    C: '<path d="M18.5 7.5a8 8 0 1 0 0 9"/>',
    MATLAB: '<path d="M4 20V11m5 9V5m5 15v-7m5 7V3M2 20h20"/>'
  };
  const iconSvg = (name, className) => `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconPaths[name] || iconPaths.Code}</svg>`;
  const chips = (a, btn = false, withIcons = false) => `<div class="chips">${a.map(t => btn
    ? `<button type="button" class="chip chip--btn" data-skill="${esc(t.toLowerCase())}" aria-pressed="false" title="Show projects using ${esc(t)}">${withIcons ? iconSvg(t, 'skill-icon') : ''}<span>${esc(t)}</span></button>`
    : `<span class="chip">${esc(t)}</span>`).join('')}</div>`;
  const externalLink = (url, label) => /^https?:\/\//i.test(url || '')
    ? `<a class="action-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>` : '';

  const revealObserver = matchMedia('(prefers-reduced-motion: reduce)').matches ? null : new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  $$('.sec').forEach(section => {
    if (!revealObserver) return;
    section.classList.add('reveal-ready');
    revealObserver.observe(section);
  });

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Mobile drawer ---------- */
  const burger = $('#burger'), drawer = $('#drawer');
  const setMenu = open => {
    drawer.hidden = !open;
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) drawer.querySelector('a').focus();
  };
  burger.addEventListener('click', () => setMenu(drawer.hidden));
  drawer.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !drawer.hidden) { setMenu(false); burger.focus(); }
  });
  matchMedia('(min-width:1200px)').addEventListener('change', e => e.matches && setMenu(false));

  /* ---------- Render content from the Node API ---------- */
  function render(d) {
    const s = d.skills;
    $('#skillsGrid').innerHTML = [
      ['Core Subjects', 'foundations', s.subjects, false, 'Core Subjects', 'skill--icon-chips', true],
      ['Programming & Development', 'languages', s.core, false, 'Programming & Development', 'skill--icon-tiles', true],
      ['Cybersecurity', 'specialization', s.cyber.filter(x => !['Ethereum Analytics', 'Smart Contract Audit'].includes(x)), true, 'Cybersecurity', '', false],
      ['AI and Machine Learning', '', s.ml, false, 'AI and Machine Learning', '', false],
      ['Blockchain and Web3', '', s.cyber.filter(x => ['Ethereum Analytics', 'Smart Contract Audit'].includes(x)), false, 'Blockchain and Web3', '', false],
      ['Tools and Platforms', '', [...s.data, ...s.platforms], false, 'Tools and Platforms', '', false]
    ].map(([t, m, a, hl, iconName, layout, withIcons]) => `<article class="skill ${hl ? 'skill--hl' : ''} ${layout}"><h3>${iconSvg(iconName, 'skill__heading-icon')}<span class="skill__title">${esc(t)}</span><span class="skill__meta">${esc(m)}</span></h3>${chips(a, true, withIcons)}</article>`).join('');

    $('#projectsGrid').innerHTML = d.projects.map((p, i) => `
      <article class="card" data-cat="${esc(p.cat || '')}" data-stack="${esc(p.stack.join('|').toLowerCase())}" data-mentions="${esc([p.domain, p.description].join(' ').toLowerCase())}" data-search="${esc([p.title, p.domain, p.status, p.period, p.description, ...p.stack].join(' ').toLowerCase())}">
        <div class="card__top"><span>${esc(p.period)}</span><span class="badge">● ${esc(p.status)}</span></div>
        <span class="domain">${esc(p.domain)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        ${chips(p.stack)}
        <div class="card__actions"><button class="card__link project-details" type="button" data-project="${i}">View details</button>${externalLink(p.github || (p.link !== '#' ? p.link : ''), 'GitHub')}${externalLink(p.demo, 'Live demo')}</div>
      </article>`).join('');

    $('#honorsGrid').innerHTML = d.honors.map(h => `<article class="honor"><span class="tag">${esc(h.tag)}</span><h3>${esc(h.title)}</h3><p>${esc(h.text)}</p></article>`).join('');

    const e = d.experience;
    $('#expCard').innerHTML = `<article class="exp"><h3>${esc(e.role)}</h3><span class="org">${esc(e.org)} · ${esc(e.period)}</span><p>${esc(e.text)}</p></article>`;
    $('#certsList').innerHTML = d.certs.map(c => `<li>${esc(c.title)}<small>${esc(c.meta)}</small></li>`).join('');
    $('#leadGrid').innerHTML = d.leadership.map(l => `<article><span>${esc(l.label)}</span><h4>${esc(l.title)}</h4><p>${esc(l.text)}</p></article>`).join('');
    const dialog = $('#projectDialog'), dialogContent = $('#projectDialogContent');
    $('#projectsGrid').addEventListener('click', event => {
      const button = event.target.closest('.project-details');
      if (!button) return;
      const project = d.projects[Number(button.dataset.project)];
      if (!project) return;
      const links = [externalLink(project.github || (project.link !== '#' ? project.link : ''), 'Open repository'), externalLink(project.demo, 'Open live demo')].filter(Boolean).join('');
      const missing = '<p class="detail-missing">Not documented in the current project data.</p>';
      dialogContent.innerHTML = `<span class="domain">${esc(project.domain)}</span><h2 id="projectDialogTitle">${esc(project.title)}</h2><p class="detail-meta">${esc(project.period)} · ${esc(project.status)}</p>
        <section class="detail-section"><h3>Overview</h3><p>${esc(project.description)}</p></section>
        <section class="detail-section"><h3>Technologies</h3>${chips(project.stack)}</section>
        <div class="detail-grid">
          <section class="detail-section"><h3>Problem and objectives</h3>${missing}</section>
          <section class="detail-section"><h3>Architecture and workflow</h3>${missing}</section>
          <section class="detail-section"><h3>Technical contribution</h3>${missing}</section>
          <section class="detail-section"><h3>Results and limitations</h3>${missing}</section>
          <section class="detail-section"><h3>Repository and demo</h3>${links || '<p class="detail-missing">No repository or demo URL provided.</p>'}</section>
        </div>`;
      dialog.showModal();
      $('#projectDialogClose').focus();
    });
    $('#projectDialogClose').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    observeSections();
    document.dispatchEvent(new Event('portfolio:rendered'));
  }

  fetch('/api/portfolio').then(r => r.json()).then(render).catch(() => {
    $('#projectsGrid').innerHTML = '<p class="muted">Could not load content. Start the server with <code>npm start</code>.</p>';
  });

  /* ---------- Scroll-spy for top nav + tab bar ---------- */
  let io;
  function observeSections() {
    io && io.disconnect();
    const links = $$('.nav a, .drawer nav a, .tabbar a');
    const marker = Math.round(innerHeight * .4);
    const bottomMargin = Math.max(0, innerHeight - marker - 1);
    io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        // group sections that have no tab of their own under the nearest tab
        const tabId = { about: 'home', achievements: 'projects', code: 'projects' }[id] || id;
        links.forEach(a => {
          const h = a.getAttribute('href').slice(1);
          const active = h === id || (!!a.dataset.tab && a.dataset.tab === tabId);
          a.classList.toggle('active', active);
          if (active && h === id) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: `-${marker}px 0px -${bottomMargin}px 0px` });
    $$('main section[id]').forEach(s => io.observe(s));
  }
  addEventListener('resize', observeSections, { passive: true });
  observeSections();

  /* ---------- Contact form → Node API ---------- */
  const form = $('#contactForm'), msg = $('#formMsg'), btn = $('#sendBtn');
  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    msg.className = 'form__msg'; msg.textContent = '';
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Saving…';
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      form.reset(); msg.classList.add('ok'); msg.textContent = 'Message saved on this server. It has not been emailed.';
    } catch (err) {
      msg.classList.add('err'); msg.textContent = err.message || 'Could not send. Try again or email directly.';
    } finally { btn.disabled = false; btn.removeAttribute('aria-busy'); btn.textContent = 'Send message'; }
  });

  /* ---------- Resume availability + copy email ---------- */
  const resumeStatus = $('#resumeStatus');
  const showResumePlaceholder = () => {
    $$('.resume-link').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      resumeStatus.textContent = 'Resume not found. Check public/DIPANKAR_BERA_RESUME.pdf.';
      resumeStatus.focus();
    }));
    $$('.resume-link').forEach(link => link.setAttribute('aria-describedby', 'resumeStatus'));
  };
  fetch('DIPANKAR_BERA_RESUME.pdf', { method: 'HEAD' }).then(response => {
    if (!response.ok) showResumePlaceholder();
  }).catch(showResumePlaceholder);
  $('#copyEmail').addEventListener('click', async () => {
    const email = $('#contactEmail').textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      $('#copyStatus').textContent = 'Email copied';
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = email;
      fallback.setAttribute('readonly', '');
      fallback.style.position = 'fixed';
      fallback.style.opacity = '0';
      document.body.append(fallback);
      fallback.select();
      const copied = document.execCommand('copy');
      fallback.remove();
      $('#copyStatus').textContent = copied ? 'Email copied' : `Copy unavailable. Select ${email}`;
    }
  });

  /* ---------- Hero visual: rotating 3D node network (vanilla canvas) ---------- */
  const cv = $('#net'), ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let W, H, dpr, nodes = [], rotX = .3, rotY = 0, tx = 0, ty = 0, hover = false, mouse = { x: 0, y: 0 };

  function build() {
    nodes = [];
    // shell of points on a sphere + inner core points
    const N = W < 500 ? 70 : 110;
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - 2 * (i + .5) / N), th = Math.PI * (1 + Math.sqrt(5)) * i;
      nodes.push({ x: Math.cos(th) * Math.sin(phi), y: Math.sin(th) * Math.sin(phi), z: Math.cos(phi), c: i % 7 === 0 ? 1 : 0, r: 1 });
    }
    for (let i = 0; i < 16; i++) {
      const a = Math.random() * 6.28, b = Math.acos(2 * Math.random() - 1), r = .35 * Math.random() + .1;
      nodes.push({ x: r * Math.sin(b) * Math.cos(a), y: r * Math.sin(b) * Math.sin(a), z: r * Math.cos(b), c: 2, r: 1 });
    }
  }
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const b = cv.getBoundingClientRect(); W = b.width; H = b.height;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }
  const COL = ['105,215,230', '155,183,199', '155,219,189'];
  function frame() {
    ctx.clearRect(0, 0, W, H);
    rotY += hover ? 0.0015 : 0.004;
    rotX += (tx - rotX) * .05; const ry = rotY + ty;
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * .36, cr = Math.cos(ry), sr = Math.sin(ry), cX = Math.cos(rotX), sX = Math.sin(rotX);
    const P = nodes.map(n => {
      let x = n.x * cr + n.z * sr, z = -n.x * sr + n.z * cr, y = n.y * cX - z * sX; z = n.y * sX + z * cX;
      const f = 2.4 / (2.4 - z);
      return { sx: cx + x * R * f, sy: cy + y * R * f, z, f, c: n.c };
    });
    let links = 0;
    ctx.lineWidth = 1;
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const dx = P[i].sx - P[j].sx, dy = P[i].sy - P[j].sy, d = dx * dx + dy * dy, max = (R * .42) ** 2;
      if (d < max) {
        links++;
        const a = (1 - d / max) * .35 * ((P[i].z + P[j].z + 2) / 4 + .3);
        ctx.strokeStyle = `rgba(${COL[P[i].c === 2 || P[j].c === 2 ? 1 : 0]},${a})`;
        ctx.beginPath(); ctx.moveTo(P[i].sx, P[i].sy); ctx.lineTo(P[j].sx, P[j].sy); ctx.stroke();
      }
    }
    P.sort((a, b) => a.z - b.z).forEach(p => {
      let r = (p.c ? 2.6 : 1.8) * p.f;
      if (hover) { const d = Math.hypot(p.sx - mouse.x, p.sy - mouse.y); if (d < 60) r *= 1 + (60 - d) / 40; }
      ctx.fillStyle = `rgba(${COL[p.c]},${.35 + .65 * (p.z + 1) / 2})`;
      ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, 6.283); ctx.fill();
    });
    if (!reduce) requestAnimationFrame(frame);
  }
  const move = (x, y) => { const b = cv.getBoundingClientRect(); mouse = { x: x - b.left, y: y - b.top }; tx = .3 + ((mouse.y / b.height) - .5) * .8; ty = ((mouse.x / b.width) - .5) * .8; hover = true; };
  cv.addEventListener('pointermove', e => move(e.clientX, e.clientY));
  cv.addEventListener('pointerleave', () => { hover = false; tx = .3; ty = 0; });
  new ResizeObserver(resize).observe(cv);
  resize(); frame();
})();
