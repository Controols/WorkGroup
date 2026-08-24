/* ============================================================
   CleaningWorks — shared site script
   Loaded on every page: language toggle, mobile menu.
   Expects js/i18n.js to have defined window.I18N first.
   ============================================================ */

/* ---------- language ---------- */
/* Danish lives in the HTML and is captured on load. English lives in
   js/i18n.js, keyed by page. Keys may contain inline HTML (<b>, <span
   class="serif">) — that is intentional, so innerHTML is the right sink
   here: every value is authored in this repo, none comes from a visitor. */
(function(){
  const page = document.body.dataset.page || '';
  const T = Object.assign({}, (window.I18N && window.I18N.common) || {},
                              (window.I18N && window.I18N[page]) || {});

  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const DA = new Map(nodes.map(n => [n, n.innerHTML]));

  function setLang(l){
    nodes.forEach(n => {
      const key = n.dataset.i18n;
      n.innerHTML = l === 'en' ? (T[key] ?? DA.get(n)) : DA.get(n);
    });
    document.documentElement.lang = l;
    document.querySelectorAll('.lang button').forEach(b =>
      b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    try{ localStorage.setItem('cw-lang', l); }catch(e){ /* private mode */ }
    if(typeof window.calcRender === 'function') window.calcRender();
  }

  document.querySelectorAll('.lang button').forEach(b =>
    b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* remember the choice across pages — the site is one language switch,
     not two sites, so the selection has to survive navigation */
  let saved = null;
  try{ saved = localStorage.getItem('cw-lang'); }catch(e){ /* ignore */ }
  if(saved === 'en') setLang('en');

  /* ---- key-parity check (§5) ----
     Every data-i18n key in the HTML must exist in T, and no T key may be
     unused. Logs to the console in local development only; silent in
     production so a content typo never shows up in a visitor's console. */
  const isLocal = ['localhost','127.0.0.1',''].includes(location.hostname);
  if(isLocal){
    const used = new Set(nodes.map(n => n.dataset.i18n));
    const missing = [...used].filter(k => !(k in T));
    const unused  = Object.keys(T).filter(k => !used.has(k));
    if(missing.length) console.error('[i18n] keys used in HTML but missing from T:', missing);
    if(unused.length)  console.warn('[i18n] keys in T but unused on this page:', unused);
    if(!missing.length && !unused.length) console.log('[i18n] ' + page + ': ' + used.size + ' keys, 1:1 ✓');
  }
})();

/* ---------- mobile menu ---------- */
(function(){
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if(!burgerBtn || !mobileNav) return;

  function close(){
    mobileNav.classList.remove('open');
    burgerBtn.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  burgerBtn.addEventListener('click', () => {
    const open = !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', open);
    burgerBtn.classList.toggle('is-open', open);
    burgerBtn.setAttribute('aria-expanded', String(open));
  });

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  window.addEventListener('resize', () => {
    if(window.innerWidth > 980 && mobileNav.classList.contains('open')) close();
  });

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && mobileNav.classList.contains('open')){
      close();
      burgerBtn.focus();
    }
  });
})();
