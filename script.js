/* =====================================================================
   HYPER INU ($HI) - CONFIG
   Fill these in at launch. Everything on the page updates automatically.
   CA:    the $HI token contract on Ethereum (0x + 40 hex chars). '0xe78f1b67c3c5d7e8c9836061621f8e0ca914d16a' until live.
   X:     full URL to the X profile, e.g. 'https://x.com/hyperinu'   ('' = shows "Soon")
   TG:    full URL to the Telegram group, e.g. 'https://t.me/hyperinu' ('' = shows "Soon")
   CHAIN: DexScreener chain slug.
   ===================================================================== */
const CONFIG = {
  CA: '0xe78f1b67c3c5d7e8c9836061621f8e0ca914d16a',
  X: 'https://x.com/hyper_inu_x',
  TG: 'https://t.me/hyper_inu',
  CHAIN: 'ethereum'
};

(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const CA_RE = /^0x[a-fA-F0-9]{40}$/;
  const caValid = CA_RE.test(CONFIG.CA);
  const caOrTBA = caValid ? CONFIG.CA : '0xe78f1b67c3c5d7e8c9836061621f8e0ca914d16a';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const narrow = () => innerWidth <= 900;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGSAP && !reduce;
  if (!motion) document.documentElement.classList.add('static');

  /* ---------- links ---------- */
  const LINKS = {
    buy: 'https://app.uniswap.org/swap?chain=mainnet&outputCurrency=' + caOrTBA,
    chart: 'https://dexscreener.com/' + CONFIG.CHAIN + '/' + caOrTBA,
    x: CONFIG.X, tg: CONFIG.TG
  };
  $$('[data-link]').forEach(a => {
    const k = a.dataset.link, url = LINKS[k];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    else {
      a.classList.add('disabled'); a.setAttribute('aria-disabled', 'true'); a.removeAttribute('href');
      a.title = 'Coming soon';
      const lbl = a.querySelector('[data-label]');
      if (lbl) lbl.textContent += ' Soon';
      else { const s = document.createElement('span'); s.className = 'soon-tag mono'; s.textContent = 'Soon'; if (!a.classList.contains('icon-btn')) a.appendChild(s); }
      a.addEventListener('click', e => { e.preventDefault(); toast((k === 'x' ? 'X' : 'Telegram') + ' link coming soon'); });
    }
  });
  $$('[data-ca]').forEach(el => el.textContent = caOrTBA);

  /* ---------- toast + copy ---------- */
  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2200); }
  function fallbackCopy(txt) {
    const ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
    document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); return ok;
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    if (!caValid) { toast('CA is 0xe78f1b67c3c5d7e8c9836061621f8e0ca914d16a - announced at launch on official channels'); return; }
    let ok = false;
    try { if (navigator.clipboard && isSecureContext) { await navigator.clipboard.writeText(CONFIG.CA); ok = true; } } catch (e) {}
    if (!ok) ok = fallbackCopy(CONFIG.CA);
    toast(ok ? 'CA copied. Verify before you swap.' : 'Copy failed - select the address manually');
  }));

  /* ---------- chart ---------- */
  if (caValid) {
    $('#dexFrame').src = 'https://dexscreener.com/' + CONFIG.CHAIN + '/' + CONFIG.CA + '?embed=1&theme=dark&trades=0&info=0';
    $('#chartOverlay').classList.add('off');
  }

  /* ---------- gallery data ---------- */
  const MEMES = [
    ['meme01', 'Rocket to the ETH moon'], ['meme02', 'Bears left in the dust'], ['meme03', 'Coffee and green candles'],
    ['meme04', 'Winning the dog race'], ['meme05', 'gm from the hilltop'], ['meme06', 'Diamond paws'],
    ['meme07', 'Surfing the green candle'], ['meme08', 'DJ at the neon rave'], ['meme09', 'HI flag on the moon'], ['meme10', 'Sleeping on a pile of ETH']
  ];
  const track = $('#galTrack');
  const loopCopies = (narrow() && !reduce) ? 2 : 1;
  for (let c = 0; c < loopCopies; c++) MEMES.forEach(([f, cap], i) => {
    const b = document.createElement('button'); b.className = 'card'; b.dataset.i = i;
    b.setAttribute('aria-label', 'Open meme: ' + cap); if (c) { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); }
    b.innerHTML = '<span class="blur"></span><span class="inner"><img src="assets/img/' + f + '-sm.webp" alt="' + cap + '" loading="lazy" decoding="async" width="480" height="480"></span><span class="tag">#' + String(i + 1).padStart(2, '0') + ' ' + cap.toUpperCase() + '</span><span class="shadow"></span>';
    track.appendChild(b);
  });
  const cards = $$('.card', track);

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'); let cur = 0, lastFocus;
  function openLB(i) { cur = (i + MEMES.length) % MEMES.length; lbImg.src = 'assets/img/' + MEMES[cur][0] + '.webp'; lbImg.alt = MEMES[cur][1]; lbCap.textContent = String(cur + 1).padStart(2, '0') + ' / 10  ' + MEMES[cur][1].toUpperCase(); if (lb.hidden) { lastFocus = document.activeElement; lb.hidden = false; $('.lb-close').focus(); } }
  function closeLB() { lb.hidden = true; lastFocus && lastFocus.focus(); }
  cards.forEach(c => c.addEventListener('click', () => { if (!c.dataset.dragged) openLB(+c.dataset.i); }));
  $('.lb-close').onclick = closeLB; $('.lb-nav.prev').onclick = () => openLB(cur - 1); $('.lb-nav.next').onclick = () => openLB(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') closeLB(); if (e.key === 'ArrowLeft') openLB(cur - 1); if (e.key === 'ArrowRight') openLB(cur + 1); });

  /* ---------- visibility helper (pause offscreen loops) ---------- */
  const vis = new Map();
  const io = new IntersectionObserver(es => es.forEach(e => vis.set(e.target, e.isIntersecting)), { rootMargin: '100px' });
  const watch = el => { vis.set(el, true); io.observe(el); return () => vis.get(el) && !document.hidden; };

  /* ---------- warp starfield ---------- */
  const cv = $('#warp'), ctx = cv.getContext('2d'); let W, H, stars = [], warpBoost = 0;
  function sizeCv() { const d = Math.min(devicePixelRatio || 1, 2); W = cv.width = innerWidth * d; H = cv.height = innerHeight * d; }
  sizeCv(); addEventListener('resize', sizeCv);
  const N = narrow() ? 140 : 320;
  for (let i = 0; i < N; i++) stars.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() });
  function drawStars(dt) {
    ctx.fillStyle = 'rgba(3,6,12,0.35)'; ctx.fillRect(0, 0, W, H);
    const sp = (0.08 + warpBoost) * dt, cx = W / 2, cy = H / 2;
    for (const s of stars) {
      const pz = s.z; s.z -= sp; if (s.z <= 0.02) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; continue; }
      const x = cx + s.x / s.z * cx, y = cy + s.y / s.z * cy, px = cx + s.x / pz * cx, py = cy + s.y / pz * cy;
      ctx.strokeStyle = 'rgba(' + (s.z < .3 ? '200,255,250' : '47,243,224') + ',' + (1 - s.z) + ')'; ctx.lineWidth = (1 - s.z) * 2.2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
    }
    warpBoost *= 0.94;
  }
  if (reduce) { ctx.fillStyle = '#03060c'; ctx.fillRect(0, 0, W, H); for (const s of stars) { ctx.fillStyle = 'rgba(47,243,224,' + (1 - s.z) + ')'; ctx.fillRect(W / 2 + s.x / (s.z + .5) * W / 2, H / 2 + s.y / (s.z + .5) * H / 2, 2, 2); } }

  /* ---------- preloader ---------- */
  const plBar = $('#plBar'), plNum = $('#plNum'); let pct = 0;
  const imgs = $$('img').filter(i => i.loading !== 'lazy'); let loaded = 0;
  imgs.forEach(i => { if (i.complete) loaded++; else { i.addEventListener('load', () => loaded++); i.addEventListener('error', () => loaded++); } });
  const plStart = performance.now();
  function plTick() {
    const target = Math.min(100, (loaded / Math.max(1, imgs.length)) * 100, (performance.now() - plStart) / 14);
    pct += (target - pct) * 0.15; if (target >= 100 && pct > 99.4) pct = 100;
    plNum.textContent = String(Math.round(pct)).padStart(3, '0'); plBar.style.strokeDashoffset = 553 * (1 - pct / 100);
    if (pct >= 100 || performance.now() - plStart > 5000) finishLoad(); else requestAnimationFrame(plTick);
  }
  let done = false;
  function finishLoad() { if (done) return; done = true; plNum.textContent = '100'; plBar.style.strokeDashoffset = 0; setTimeout(() => { document.body.classList.remove('loading'); intro(); }, reduce ? 0 : 250); }
  reduce ? finishLoad() : requestAnimationFrame(plTick);

  /* ---------- split title ---------- */
  $$('.title .split').forEach(s => { const t = s.textContent; s.textContent = ''; [...t].forEach(ch => { const c = document.createElement('span'); c.className = 'ch'; c.textContent = ch; c.setAttribute('aria-hidden', 'true'); s.appendChild(c); }); });
  $$('.words').forEach(h => { h.innerHTML = h.textContent.trim().split(/\s+/).map(w => '<span class="w">' + w + '</span>').join(' '); });

  function intro() {
    if (!motion) return;
    gsap.from('.title .ch', { rotateX: -100, yPercent: 60, opacity: 0, duration: 1, stagger: .05, ease: 'back.out(2)', transformPerspective: 600 });
    gsap.from('.hero-copy .kicker, .sub, .hero-copy .cta-row, .hero-copy .ca-box', { y: 30, opacity: 0, stagger: .1, delay: .35, duration: .8, ease: 'power3.out' });
    gsap.from('.hero-dog', { scale: .4, opacity: 0, x: 200, duration: 1.3, ease: 'expo.out' });
    gsap.from('.portal', { scale: 0, rotate: -180, duration: 1.4, ease: 'expo.out' });
    warpBoost = 0.6;
  }

  /* ---------- nav hide-on-scroll ---------- */
  let lastY = scrollY; const nav = $('#nav');
  addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('hide', y > lastY && y > 200); lastY = y; }, { passive: true });

  /* ---------- custom cursor ---------- */
  if (!touch && !reduce) {
    document.body.classList.add('has-cursor'); const cu = $('.cursor'); let mx = -100, my = -100, cx2 = -100, cy2 = -100;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseover', e => cu.classList.toggle('big', !!e.target.closest('a,button,.card')));
    (function cl() { cx2 += (mx - cx2) * .22; cy2 += (my - cy2) * .22; cu.style.transform = 'translate(' + cx2 + 'px,' + cy2 + 'px)'; requestAnimationFrame(cl); })();
    // hero mouse parallax
    const layers = $$('.layer');
    addEventListener('mousemove', e => { const dx = e.clientX / innerWidth - .5, dy = e.clientY / innerHeight - .5; layers.forEach(l => { const d = +l.dataset.depth; l.style.translate = (dx * 40 * d) + 'px ' + (dy * 30 * d) + 'px'; }); });
    // drag/tilt tokenomics card
    const tk = $('#tkCard');
    tk.addEventListener('mousemove', e => { const r = tk.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; tk.style.transform = 'perspective(900px) rotateY(' + x * 10 + 'deg) rotateX(' + (-y * 10) + 'deg)'; });
    tk.addEventListener('mouseleave', () => tk.style.transform = '');
  }

  /* ---------- main loop ---------- */
  const galPin = $('.gal-pin'), galOn = watch(galPin), heroOn = watch($('.hero'));
  const raceDog = $('#raceDog'), paws = $('#paws'), viewport = $('.gal-viewport');
  let t = 0, galVel = 0, galProg = 0, lastPaw = 0, lastDogX = 0;
  const PAW = '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="16" rx="5" ry="4.2"/><circle cx="5.5" cy="10" r="2.3"/><circle cx="9.5" cy="6" r="2.3"/><circle cx="14.5" cy="6" r="2.3"/><circle cx="18.5" cy="10" r="2.3"/></svg>';
  function placeDog(px) {
    raceDog.style.transform = 'translateX(' + px + 'px) translateY(' + (Math.abs(Math.sin(t * 9)) * -10) + 'px)';
    if (Math.abs(px - lastPaw) > 46 && !reduce) {
      lastPaw = px; const p = document.createElement('span'); p.className = 'paw';
      p.style.left = (px + 10) + 'px'; p.style.bottom = (px / 46 % 2 < 1 ? 22 : 34) + 'px'; p.innerHTML = PAW; paws.appendChild(p); setTimeout(() => p.remove(), 1600);
    }
    lastDogX = px;
  }
  function bobCards(intensity) {
    const amp = (narrow() ? 8 : 16) * intensity, rot = (narrow() ? 2 : 3.5) * intensity;
    const blur = Math.min(1, Math.abs(galVel) / 1.5);
    for (let i = 0; i < cards.length; i++) {
      const ph = t * 8 + i * 1.15, y = -Math.abs(Math.sin(ph)) * amp * 1.6 + amp * .4, r = Math.cos(ph) * rot;
      cards[i].style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0) rotate(' + r.toFixed(2) + 'deg) skewX(' + (-galVel * 4).toFixed(2) + 'deg)';
      cards[i].style.setProperty('--blur', blur.toFixed(2));
    }
  }
  // mobile auto-gallop marquee
  let touching = false, autoX = 0, dragMoved = 0;
  const mobileMarquee = () => narrow() && !reduce;
  viewport.addEventListener('pointerdown', () => { touching = true; dragMoved = 0; }, { passive: true });
  viewport.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  const release = () => { setTimeout(() => { touching = false; autoX = viewport.scrollLeft; }, 600); };
  viewport.addEventListener('pointerup', release); viewport.addEventListener('touchend', release, { passive: true });
  let prevSL = 0;
  let lastT = performance.now();
  function loop(now) {
    const dt = Math.min(3, (now - lastT) / 16.67); lastT = now;
    if (!document.hidden && !reduce) {
      drawStars(dt);
      if (galOn()) {
        t += 0.016 * dt * (1 + Math.min(2, Math.abs(galVel)));
        if (mobileMarquee()) {
          const half = track.scrollWidth / 2;
          if (!touching) { autoX += 1.4 * dt; if (autoX >= half) autoX -= half; viewport.scrollLeft = autoX; }
          else if (viewport.scrollLeft >= half) { viewport.scrollLeft -= half; }
          galVel = (viewport.scrollLeft - prevSL) / 10; prevSL = viewport.scrollLeft;
          galProg = (viewport.scrollLeft % half) / half;
        }
        bobCards(1);
        const raceW = raceDog.parentElement.clientWidth - raceDog.clientWidth - 40;
        placeDog(Math.max(0, galProg * raceW));
        galVel *= 0.9;
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ---------- GSAP scenes ---------- */
  if (!motion) { $$('.dpose').forEach(p => p.style.opacity = p.classList.contains('p3') ? 1 : 0); $('#meterVal').textContent = 'HYPER'; $('#meterState').textContent = 'WARP'; $('#meterBar').style.width = '100%'; $$('.drive-steps span').forEach(s => s.classList.add('on')); return; }

  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!touch && !narrow() && window.Lenis) {
    lenis = new Lenis({ lerp: .1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -10 }); } }));
  }
  const damp = narrow() || touch ? .5 : 1;
  addEventListener('scroll', () => { warpBoost = Math.min(.5, warpBoost + .02 * damp); }, { passive: true });

  // hero pinned parallax
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=' + (narrow() ? 40 : 70) + '%', scrub: true, pin: '.hero-pin', pinSpacing: true } })
    .to('.hero-word', { scale: 1.6, opacity: .2, ease: 'none' }, 0)
    .to('.hero-dog', { yPercent: -30 * damp, xPercent: 20 * damp, scale: 1.15, ease: 'none' }, 0)
    .to('.portal', { scale: 1.4, opacity: .4, ease: 'none' }, 0)
    .to('.hero-side.l', { y: -160, ease: 'none' }, 0).to('.hero-side.r', { y: -260, ease: 'none' }, 0)
    .to('.hero-copy', { y: -60 * damp, opacity: .3, ease: 'none' }, 0);

  // Hyper Drive scene
  const mv = $('#meterVal'), mb = $('#meterBar'), ms = $('#meterState'), steps = $$('.drive-steps span');
  gsap.timeline({ scrollTrigger: { trigger: '.drive', start: 'top top', end: '+=' + (narrow() ? 120 : 200) + '%', scrub: .6, pin: '.drive-pin',
    onUpdate: st => {
      const p = st.progress; mb.style.width = (p * 100) + '%';
      mv.textContent = p > .9 ? 'HYPER' : Math.round(p * 1000 / .9) + '';
      ms.textContent = p < .33 ? 'IDLE' : p < .66 ? 'ACCELERATING' : p < .9 ? 'ENTERING PORTAL' : 'WARP';
      steps.forEach((s, i) => s.classList.toggle('on', p >= i * .33)); warpBoost = Math.max(warpBoost, p * .5 * damp);
    } } })
    .to('.p1', { opacity: 0, x: -80, duration: .3 }, .25)
    .fromTo('.p2', { opacity: 0, x: -200, scale: .8 }, { opacity: 1, x: 0, scale: 1, duration: .3 }, .25)
    .to('.p2', { opacity: 0, x: 200, duration: .3 }, .6)
    .fromTo('.p3', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1.2, duration: .35 }, .6)
    .to('.drive-ring', { scale: 2.6, rotate: 120, duration: 1, ease: 'power2.in' }, 0)
    .to('.drive-tunnel', { opacity: 1, rotate: 90, duration: .8 }, .2);

  // word reveal
  gsap.to('.words .w', { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top 75%', end: 'top 15%', scrub: true } });
  gsap.from('.glass,.step,.pill', { y: 40, opacity: 0, stagger: .06, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: '.about-grid', start: 'top 85%' } });

  // Gallery: desktop pinned horizontal race
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': function () {
      const dist = () => track.scrollWidth - innerWidth + innerWidth * .1;
      const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top top', end: () => '+=' + dist(), pin: '.gal-pin', scrub: .8, invalidateOnRefresh: true,
        onUpdate: st => { galProg = st.progress; galVel = gsap.utils.clamp(-3, 3, st.getVelocity() / 900); warpBoost = Math.max(warpBoost, Math.abs(galVel) * .15); } } });
      return () => tw.kill();
    }
  });

  // How-to progress dog
  const pd = $('#progDog'), pf = $('#progFill');
  ScrollTrigger.create({ trigger: '.steps', start: 'top 85%', end: 'bottom 50%', scrub: true, onUpdate: st => { pf.style.width = st.progress * 100 + '%'; pd.style.transform = 'translateX(' + (st.progress * (pd.parentElement.clientWidth - 80)) + 'px)'; } });
  addEventListener('load', () => ScrollTrigger.refresh());
})();
