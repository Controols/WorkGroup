/* ============================================================
   precopy — the pre-flight check for a manual folder copy.

   Deployment here is a manual copy of a whole site folder onto the
   host (CLAUDE.md open work #10, kept deliberately). A copy publishes
   whatever is in the folder at that moment, from whatever branch
   happens to be checked out. That is what caused the four-day logo
   drift in #17.

   This does not copy anything. It answers one question: "is this
   folder safe to publish right now?"

       npm run precopy                      # linen-works (default)
       npm run precopy -- cleaning-works
       npm run precopy -- --skip-sweep      # faster re-check

   Exit code 0 = safe to copy. Non-zero = do not copy.
   ============================================================ */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITES = ['linen-works', 'cleaning-works', 'works-group'];

/* linenworks.dk is live and indexed, and main carries a Danish-first flip
   whose copy has never been read by a native speaker (open work #19). The
   next copy of this folder publishes it. */
const LIVE_SITES = ['linen-works'];

const argv = process.argv.slice(2);
const site = argv.find((a) => !a.startsWith('-')) || 'linen-works';
const skipSweep = argv.includes('--skip-sweep');
const ackDanish = argv.includes('--ack-danish');

const results = [];
const add = (level, label, detail) => results.push({ level, label, detail });

function git(cmd) {
  return execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function human(bytes) {
  return bytes >= 1024 * 1024
    ? (bytes / 1024 / 1024).toFixed(1) + ' MB'
    : Math.round(bytes / 1024) + ' KB';
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/* ---------- 0. the folder exists ---------- */

if (!SITES.includes(site)) {
  console.error(`Unknown site "${site}". Expected one of: ${SITES.join(', ')}`);
  process.exit(2);
}
const siteDir = path.join(ROOT, site);
if (!fs.existsSync(siteDir)) {
  console.error(`Folder not found: ${siteDir}`);
  process.exit(2);
}

console.log(`\n  precopy — ${site}\n  ${'-'.repeat(52)}`);

/* ---------- 1. on main ---------- */

const branch = git('rev-parse --abbrev-ref HEAD');
if (branch === 'main') add('OK', 'On main');
else add('FAIL', `On branch "${branch}", not main`,
  'Copying from a feature-branch checkout is what caused the drift in #17.');

/* ---------- 2. nothing uncommitted in this folder ---------- */

/* untracked entries ("??") are check 3's job — don't report them twice */
const dirty = git(`status --porcelain -- ${site}`)
  .split('\n').filter(Boolean).filter((l) => !l.startsWith('??'));
if (!dirty.length) add('OK', 'No uncommitted changes in the folder');
else add('FAIL', `${dirty.length} uncommitted change(s) in ${site}/`,
  dirty.map((l) => '  ' + l).join('\n') +
  '\nThe repo would not record what you are about to publish.');

/* ---------- 3. nothing untracked that would be swept up ---------- */

const untracked = git(`ls-files --others --exclude-standard -- ${site}`)
  .split('\n').filter(Boolean);
if (!untracked.length) add('OK', 'No untracked files in the folder');
else add('FAIL', `${untracked.length} untracked file(s) would be published`,
  untracked.map((f) => `  ${f}  (${human(fs.statSync(path.join(ROOT, f)).size)})`).join('\n') +
  '\nA copy publishes the entire folder. Move scratch files out first.');

/* ---------- 4. in sync with origin ---------- */

try {
  git('fetch --quiet origin main');
  const behind = Number(git('rev-list --count HEAD..origin/main'));
  const ahead = Number(git('rev-list --count origin/main..HEAD'));
  if (behind > 0) add('WARN', `Local main is ${behind} commit(s) behind origin/main`,
    'Someone else has pushed. Pull before copying, or you publish stale work.');
  else if (ahead > 0) add('OK', `In sync (${ahead} local commit(s) not yet pushed)`);
  else add('OK', 'In sync with origin/main');
} catch {
  add('WARN', 'Could not reach origin', 'Skipped the sync check.');
}

/* ---------- 5. the sweep ---------- */

if (skipSweep) {
  add('WARN', 'Sweep skipped (--skip-sweep)', 'Responsive and console checks did not run.');
} else {
  try {
    execSync(`npx playwright test -g ${site} --reporter=line`,
      { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
    add('OK', 'Sweep passed');
  } catch (e) {
    const out = (e.stdout || '') + (e.stderr || '');
    const failed = out.split('\n').filter((l) => /^\s+\d+\) /.test(l));
    add('FAIL', 'Sweep failed',
      (failed.length ? failed.join('\n') : out.split('\n').slice(-15).join('\n')) +
      '\nRun `npm run sweep` for the full report.');
  }
}

/* ---------- 6. what would actually be published ---------- */

const files = walk(siteDir);
const bytes = files.reduce((n, f) => n + fs.statSync(f).size, 0);
add('INFO', `${files.length} files, ${human(bytes)} would be copied`);

/* unreferenced assets — dead weight a whole-folder copy uploads anyway */
const markup = files.filter((f) => /\.(html|css|js)$/i.test(f))
  .map((f) => fs.readFileSync(f, 'utf8')).join('\n');
const assets = files.filter((f) => /\.(jpg|jpeg|png|webp|svg|gif|avif|ico|pdf|zip)$/i.test(f));
const orphans = assets.filter((f) => !markup.includes(path.basename(f)));
if (orphans.length) {
  const waste = orphans.reduce((n, f) => n + fs.statSync(f).size, 0);
  add('WARN', `${orphans.length} unreferenced asset(s), ${human(waste)}`,
    orphans.map((f) => `  ${path.relative(ROOT, f)}  (${human(fs.statSync(f).size)})`).join('\n') +
    '\nNo page requests these. Kept on purpose as stock (CLAUDE.md Assets) — but a\nwhole-folder copy uploads them.');
}

/* ---------- 7. the check no script can make ---------- */

if (LIVE_SITES.includes(site)) {
  if (ackDanish) add('OK', 'Danish copy confirmed read (--ack-danish)');
  else add('FAIL', 'Danish copy not confirmed',
    `${site} is LIVE and indexed, and main is Danish-first with copy that has never\n` +
    'been read by a native speaker (open work #19). This is the one thing no check\n' +
    'can verify. Read it, then re-run with --ack-danish.');
}

/* ---------- report ---------- */

const pad = (s) => `[${s}]`.padEnd(7);
for (const r of results) {
  console.log(`  ${pad(r.level)} ${r.label}`);
  if (r.detail) console.log(r.detail.split('\n').map((l) => '          ' + l).join('\n'));
}

const failures = results.filter((r) => r.level === 'FAIL');
console.log(`  ${'-'.repeat(52)}`);
if (failures.length) {
  console.log(`  DO NOT COPY — ${failures.length} check(s) failed.\n`);
  process.exit(1);
}
console.log(`  SAFE TO COPY\n  Source: ${siteDir}\n`);
