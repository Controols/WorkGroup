/* ============================================================
   CleaningWorks — price calculator
   Loaded only on pages that use it (index.html, niveauer.html).

   The hero form drives three things at once: its own 3-column
   output, the Basis/Standard/Total comparison table (live price
   row + column highlight) and the mobile fallback cards.

   ⚠️ PLACEHOLDER PRICING MODEL. The figures below are invented.
   Replace `computePrices()` with the real pricing logic before
   this page is visible to anyone outside the company.

   Regression check — kontor, 1.200 m², 5 dage/uge:
     Basis 5.400 kr. · Standard 9.800 kr. · Total 15.200 kr.
   ============================================================ */

/* ---------- state ---------- */
let typeF = 1;          // 1 kontor · 1.15 produktion · 1.3 klinik
let m2 = 1200;
let days = 5;           // 1–7 dage/uge
let selectedLevel = 'standard';
let locked = false;     // true once the visitor clicks a level directly

/* interpolated from the brief's anchors (1 dag ×0.45, 3 dage ×0.72, 5 dage ×1),
   extended to 7 days on the same slope as the 3→5 segment */
const freqTable = [0.45, 0.585, 0.72, 0.86, 1, 1.14, 1.28];

function round100(n){ return Math.round(n / 100) * 100; }

function bandForDays(d){
  if(d <= 2) return 'basis';
  if(d <= 5) return 'standard';
  return 'total';
}

function computePrices(){
  const raw = (900 + m2 * 7.4) * typeF * freqTable[days - 1];
  return {
    basis: round100(raw * 0.55),
    standard: round100(raw),
    total: round100(raw * 1.55)
  };
}

/* ---------- formatting ---------- */
/* Anything the calculator prints is formatted here, not translated
   through the T object — see the note in js/i18n.js. */
function calcLang(){
  return document.documentElement.lang === 'en' ? 'en' : 'da';
}
function fmt(n){
  return calcLang() === 'da' ? n.toLocaleString('da-DK') : n.toLocaleString('en-GB');
}
function money(n){
  return calcLang() === 'da' ? fmt(n) + ' kr.' : 'DKK ' + fmt(n);
}
function daysLabel(d){
  if(calcLang() === 'da') return d === 1 ? '1 dag/uge' : fmt(d) + ' dage/uge';
  return d === 1 ? '1 day/week' : fmt(d) + ' days/week';
}
function typeLabelText(){
  const b = document.querySelector('#segType button[aria-pressed="true"]');
  return b ? b.textContent.trim() : '';
}
function levelLabelText(level){
  const b = document.querySelector('.calc-level[data-level="' + level + '"] .lvl-name');
  return b ? b.textContent.trim() : level;
}

/* ---------- render ---------- */
function render(){
  if(!document.getElementById('segType')) return;   /* page has no calculator */

  const prices = computePrices();
  const band = bandForDays(days);
  if(!locked) selectedLevel = band;

  const m2v = document.getElementById('m2v');
  const freqv = document.getElementById('freqv');
  if(m2v) m2v.textContent = fmt(m2) + ' m²';
  if(freqv) freqv.textContent = daysLabel(days);

  /* hero calculator: 3-column output */
  document.querySelectorAll('.calc-level').forEach(btn => {
    const lvl = btn.dataset.level;
    const price = prices[lvl];
    const perM2 = price / m2;
    btn.querySelector('[data-out="amt"]').textContent = money(price);
    btn.querySelector('[data-out="sub"]').textContent = calcLang() === 'da'
      ? '≈ ' + perM2.toFixed(1).replace('.', ',') + ' kr./m²'
      : '≈ DKK ' + perM2.toFixed(1) + '/m²';
    btn.classList.toggle('is-recommended', lvl === band);
    btn.classList.toggle('is-selected', lvl === selectedLevel);
    btn.setAttribute('aria-pressed', String(lvl === selectedLevel));
  });

  /* full comparison table: column highlight + live price row */
  document.querySelectorAll('#levelsTable [data-level]').forEach(cell => {
    cell.classList.toggle('is-selected', cell.dataset.level === selectedLevel);
  });
  document.querySelectorAll('#levelsTable .price-row [data-level]').forEach(cell => {
    const out = cell.querySelector('[data-out="tbl"]');
    if(out) out.textContent = money(prices[cell.dataset.level]);
  });

  /* mobile fallback cards */
  document.querySelectorAll('.level-card').forEach(card => {
    const lvl = card.dataset.level;
    card.querySelector('[data-out="lc"]').textContent = money(prices[lvl]);
    card.classList.toggle('is-recommended', lvl === band);
    card.classList.toggle('is-selected', lvl === selectedLevel);
    card.setAttribute('aria-pressed', String(lvl === selectedLevel));
  });

  /* summary line */
  const lvlLabel = levelLabelText(selectedLevel);
  const typeLabel = typeLabelText().toLowerCase();
  const priceTxt = money(prices[selectedLevel]);
  const summary = document.getElementById('calcSummary');
  if(summary){
    summary.textContent = calcLang() === 'da'
      ? lvlLabel + ', ' + typeLabel + ', ' + fmt(m2) + ' m², ' + daysLabel(days) + ' — ca. ' + priceTxt + '/md.'
      : lvlLabel + ', ' + typeLabel + ', ' + fmt(m2) + ' m², ' + daysLabel(days) + ' — approx. ' + priceTxt + '/mo.';
  }

  /* table caption, tied back to the calculator inputs */
  const note = document.getElementById('lvlNote');
  if(note){
    note.textContent = calcLang() === 'da'
      ? 'Beregnet for ' + typeLabel + ', ' + fmt(m2) + ' m², ' + daysLabel(days) + ' — juster i beregneren ovenfor.'
      : 'Calculated for ' + typeLabel + ', ' + fmt(m2) + ' m², ' + daysLabel(days) + ' — adjust the calculator above.';
  }

  /* carries the visitor's choice into the contact form, where one exists */
  const carry = document.getElementById('calcCarry');
  if(carry){
    carry.value = lvlLabel + ' · ' + typeLabel + ' · ' + fmt(m2) + ' m² · ' + daysLabel(days) + ' · ' + priceTxt + '/md.';
  }
}

/* ---------- inputs ---------- */
function segInit(id, setter){
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('click', e => {
    const b = e.target.closest('button'); if(!b) return;
    [...el.querySelectorAll('button')].forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    setter(parseFloat(b.dataset.v));
    render();
  });
}
segInit('segType', v => typeF = v);

const m2Input = document.getElementById('m2');
if(m2Input) m2Input.addEventListener('input', e => { m2 = +e.target.value; render(); });

const freqInput = document.getElementById('freq');
if(freqInput) freqInput.addEventListener('input', e => { days = +e.target.value; render(); });

/* clicking a level (hero output or the table's mobile cards) selects it explicitly */
document.querySelectorAll('.calc-level, .level-card').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedLevel = btn.dataset.level;
    locked = true;
    render();
  });
});

/* site.js calls this at the end of setLang() so the numbers reformat */
window.calcRender = render;

render();
