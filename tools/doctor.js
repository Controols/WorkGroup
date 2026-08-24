/* ============================================================
   doctor — what is actually installed on THIS machine, right now.

   CLAUDE.md used to answer this with a hand-written table listing
   what each machine had. That is the pattern this repo keeps getting
   burned by: the ~745 KB unreferenced-assets figure was wrong until
   precopy measured it, the Assets section described Concept D art
   three weeks after it was replaced, and the brand description called
   Linen Works a uniforms brand until it needed a HISTORY NOTE to
   unwind. A table asserts; it never notices it has gone stale.

   So this measures instead. Run it on any machine and it reports the
   truth about that machine, including which of the deliberately
   untracked asset folders are reachable and what their absence blocks.

       npm run doctor
       npm run doctor -- --assets "D:\shared\works-assets"

   It installs nothing, copies nothing, and has no credentials.

   ⚠️ It CANNOT sync the asset folders. Logo/ (14 MB of print PDFs) and
   the Desktop stock/text folders are gitignored on purpose, so git will
   never carry them between machines. Moving them needs a real channel —
   a shared drive or the owner copying the folder. All doctor can do is
   tell you they are missing and what that costs you.

   Exit code 0 = this machine can run the harness. Non-zero = it cannot.
   ============================================================ */

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const argv = process.argv.slice(2);
const extraAssetRoots = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--assets' && argv[i + 1]) extraAssetRoots.push(argv[++i]);
}

const results = [];
const add = (level, label, detail) => results.push({ level, label, detail });
const fixes = [];

function run(cmd) {
  try {
    return execSync(cmd, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 15000,
    }).trim();
  } catch {
    return null;
  }
}

/* Resolve a command on PATH without executing it. Executing is not safe
   here: on Windows, `python` is often a 0-byte Store stub that launches
   the Microsoft Store rather than printing a version. */
function which(cmd) {
  const out = run(`${process.platform === 'win32' ? 'where' : 'which'} ${cmd}`);
  return out ? out.split('\n')[0].trim() : null;
}

function firstLine(s) {
  return s ? s.split('\n')[0].trim() : null;
}

function human(bytes) {
  return bytes >= 1024 * 1024
    ? (bytes / 1024 / 1024).toFixed(1) + ' MB'
    : Math.round(bytes / 1024) + ' KB';
}

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function measure(dir) {
  const files = walk(dir);
  return {
    files: files.length,
    bytes: files.reduce((n, f) => {
      try {
        return n + fs.statSync(f).size;
      } catch {
        return n;
      }
    }, 0),
  };
}

/* ---------- 0. which machine is this? ---------- */

console.log(`\n  doctor — ${os.userInfo().username}@${os.hostname()}`);
console.log(`  ${os.type()} ${os.release()}  ·  repo at ${ROOT}`);
console.log(`  ${'-'.repeat(60)}`);

/* ---------- 1. the runtime running this script ---------- */

/* node and npm cannot be reported as missing here — doctor runs under node,
   via npm. If PATH has not been refreshed after installing Node, `npm run
   doctor` does not start at all, which is why CLAUDE.md keeps the bootstrap
   winget lines rather than deferring everything to this script. */
add('OK', `Node ${process.version}`, which('node') || '');
const npmV = firstLine(run('npm --version'));
if (npmV) add('OK', `npm ${npmV}`);

/* ---------- 2. everything else on PATH ---------- */

const TOOLS = [
  {
    cmd: 'git',
    label: 'Git',
    required: true,
    versionArgs: '--version',
    blocks: 'commits, precopy and the sweep — nothing here works without it',
    install: 'winget install --id Git.Git',
  },
  {
    cmd: 'magick',
    label: 'ImageMagick',
    required: false,
    versionArgs: '--version',
    blocks: 'all image work: resize, re-export, WebP, the deferred foto-band.jpg pass',
    install: 'winget install --id ImageMagick.ImageMagick',
  },
  {
    cmd: 'gh',
    label: 'GitHub CLI',
    required: false,
    versionArgs: '--version',
    blocks: 'PR and issue work (plain `git push` still works — credentials are cached)',
    install: 'winget install --id GitHub.cli',
  },
  {
    cmd: 'code',
    label: 'VS Code',
    required: false,
    versionArgs: '--version',
    blocks: 'nothing — `npm run serve` covers previewing',
    install: 'winget install --id Microsoft.VisualStudioCode',
  },
];

for (const t of TOOLS) {
  const where = which(t.cmd);
  if (where) {
    const v = firstLine(run(`${t.cmd} ${t.versionArgs}`)) || '(version unavailable)';
    add('OK', `${t.label} — ${v}`, where);
  } else {
    add(t.required ? 'FAIL' : 'WARN', `${t.label} not installed`, `Blocks: ${t.blocks}`);
    fixes.push(t.install);
  }
}

/* ---------- 3. the Python stub trap ---------- */

/* Neither machine has real Python, but `python.exe`, `py.exe` and
   `python3.exe` DO resolve on PATH as Windows App Execution Aliases. That is
   worse than being absent: a presence check passes and the command then
   launches the Microsoft Store instead of running anything.

   Detecting them is fiddly, and how depends on the tool asking:
     - PowerShell  Get-Item .Length  -> 0
     - Node        fs.statSync       -> throws EACCES
     - Node        fs.lstatSync      -> a ~108-byte symlink (reparse point)
   A real interpreter stats cleanly, so "stat throws EACCES" is the reliable
   signature here. Never conclude anything from `which` alone.

   Note the explicit `unknown` bucket. The first version of this check had
   only stub/real, so an entry that threw fell into neither and printed
   NOTHING — a silent gap in the script whose whole job is removing them. */
const pythons = ['python', 'py', 'python3']
  .map((c) => ({ cmd: c, at: which(c) }))
  .filter((x) => x.at);

if (!pythons.length) {
  add('INFO', 'No Python on PATH', 'Expected. Node is the scripting language here.');
} else {
  const classified = pythons.map((x) => {
    try {
      const size = fs.statSync(x.at).size;
      return { ...x, kind: size === 0 ? 'stub' : 'real', note: `${size} bytes` };
    } catch (e) {
      if (e.code === 'EACCES') {
        let note = 'stat EACCES';
        try {
          const l = fs.lstatSync(x.at);
          if (l.isSymbolicLink()) note = `reparse point, ${l.size} bytes via lstat`;
        } catch {}
        return { ...x, kind: 'stub', note };
      }
      return { ...x, kind: 'unknown', note: `stat failed: ${e.code}` };
    }
  });

  const bucket = (k) => classified.filter((x) => x.kind === k);
  const list = (xs) => xs.map((x) => `  ${x.cmd} -> ${x.at}  (${x.note})`).join('\n');

  if (bucket('stub').length) {
    add('WARN',
      `${bucket('stub').length} Python command(s) on PATH are Store aliases, not interpreters`,
      list(bucket('stub')) +
        '\nThese resolve and then do nothing useful. Do not write tooling that assumes\n' +
        'Python; a presence check passes and the script still fails.');
  }
  if (bucket('real').length) {
    add('INFO', `${bucket('real').length} real Python interpreter(s) found`,
      list(bucket('real')) +
        '\nCLAUDE.md assumes there is none. Still prefer Node for new tooling.');
  }
  if (bucket('unknown').length) {
    add('WARN', `${bucket('unknown').length} Python command(s) could not be classified`,
      list(bucket('unknown')) + '\nTreat as unavailable until checked by hand.');
  }
}

/* ---------- 4. the harness itself ---------- */

const nodeModules = path.join(ROOT, 'node_modules');
const playwrightPkg = path.join(nodeModules, '@playwright', 'test', 'package.json');

if (!fs.existsSync(nodeModules)) {
  add('FAIL', 'node_modules/ missing', 'node_modules is not committed. Run: npm install');
  fixes.push('npm install');
} else if (!fs.existsSync(playwrightPkg)) {
  add('FAIL', '@playwright/test not installed', 'Run: npm install');
  fixes.push('npm install');
} else {
  let v = '';
  try {
    v = JSON.parse(fs.readFileSync(playwrightPkg, 'utf8')).version;
  } catch {}
  add('OK', `@playwright/test ${v}`);
}

/* The browser binaries live outside the repo and are a separate download
   from `npm install` — the easiest half of the setup to forget. */
const browserRoot =
  process.env.PLAYWRIGHT_BROWSERS_PATH ||
  (process.platform === 'win32'
    ? path.join(process.env.LOCALAPPDATA || os.homedir(), 'ms-playwright')
    : path.join(os.homedir(), '.cache', 'ms-playwright'));

let chromium = [];
try {
  chromium = fs.readdirSync(browserRoot).filter((d) => d.startsWith('chromium-'));
} catch {}

if (chromium.length) {
  add('OK', `Playwright Chromium (${chromium.join(', ')})`, browserRoot);
} else {
  add('FAIL', 'Playwright browsers not downloaded',
    `Nothing under ${browserRoot}\nThe sweep cannot run. Fix: npx playwright install chromium`);
  fixes.push('npx playwright install chromium');
}

/* ---------- 5. git identity ---------- */

const localName = run('git config --local --get user.name');
const localEmail = run('git config --local --get user.email');
const globalName = run('git config --global --get user.name');

if (localName && localEmail) {
  add('OK', `Git identity (repo-local): ${localName} <${localEmail}>`,
    globalName ? '' : 'No global identity — the next clone on this machine starts with none.');
} else if (globalName) {
  add('WARN', `Git identity is global only: ${globalName}`,
    'This repo has used a repo-local identity. Confirm commits get the right author.');
} else {
  add('FAIL', 'No git identity set',
    'Commits would get the wrong author. Set one:\n' +
    '  git config --local user.name "Controols"\n' +
    '  git config --local user.email "controols24@gmail.com"');
}

/* ---------- 6. the untracked asset folders ---------- */

/* These are gitignored on purpose and git will NEVER carry them between
   machines. Their location is user-specific, so search the likely roots
   rather than hardcoding one machine's Desktop path. */
const searchRoots = [
  ROOT,
  path.join(os.homedir(), 'Desktop'),
  path.join(os.homedir(), 'OneDrive', 'Desktop'),
  path.join(os.homedir(), 'Documents'),
  os.homedir(),
  ...extraAssetRoots,
];

function locate(folderName) {
  for (const root of searchRoots) {
    const candidate = path.join(root, folderName);
    try {
      if (fs.statSync(candidate).isDirectory()) return candidate;
    } catch {}
  }
  return null;
}

const ASSETS = [
  {
    folder: 'Logo',
    label: 'Logo/ — Linen Works vector print pack (~14 MB)',
    blocks:
      'regenerating any logo asset. The pack README carries the 40px rule, which\n' +
      'is invisible in the markup and enforced only by tests/linen-logo.spec.js.\n' +
      'The four files actually served ARE committed in linen-works/.',
  },
  {
    folder: 'Stock photos Linen Works',
    label: 'Stock photos Linen Works/ — full-res originals',
    blocks:
      'any photo re-export, including the foto-band.jpg optimisation pass that\n' +
      'Assets defers until the stock photo is replaced.\n' +
      'Do NOT work around this by re-compressing in-repo copies — it degrades them.',
  },
  {
    folder: 'LinenWorks Text',
    label: 'LinenWorks Text/ — client-supplied English copy',
    blocks: 'checking site copy against what the client actually wrote (About/ESG/Website).',
  },
];

let missingAssets = 0;
for (const a of ASSETS) {
  const at = locate(a.folder);
  if (at) {
    const { files, bytes } = measure(at);
    add('OK', a.label, `${at}  (${files} files, ${human(bytes)})`);
  } else {
    missingAssets++;
    add('WARN', `MISSING — ${a.label}`, `Blocks: ${a.blocks}`);
  }
}

if (missingAssets) {
  add('INFO', `${missingAssets} asset folder(s) unreachable — git cannot fix this`,
    'They are gitignored deliberately, so pulling will never bring them.\n' +
    'Copy them from the machine that has them, or pass --assets <dir> if they\n' +
    'live somewhere this script did not search.\n' +
    'Everything else — editing pages, sweep, precopy, serve — works without them.');
}

/* Concept D originals are gone everywhere; worth stating so nobody hunts. */
add('INFO', 'Concept D originals (1/2/3.jpg) exist on no machine',
  'The in-repo copies are the only ones. Higher res needs the owner to re-supply.');

/* ---------- report ---------- */

const pad = (s) => `[${s}]`.padEnd(7);
console.log('');
for (const r of results) {
  console.log(`  ${pad(r.level)} ${r.label}`);
  if (r.detail) {
    console.log(
      r.detail
        .split('\n')
        .filter((l) => l.length)
        .map((l) => '          ' + l)
        .join('\n')
    );
  }
}

const failures = results.filter((r) => r.level === 'FAIL');
const warnings = results.filter((r) => r.level === 'WARN');

console.log(`  ${'-'.repeat(60)}`);

if (fixes.length) {
  console.log('  To fix:');
  for (const f of [...new Set(fixes)]) console.log(`      ${f}`);
  if (fixes.some((f) => f.startsWith('winget'))) {
    console.log('      (restart the terminal after any winget install — PATH does not');
    console.log('       reach processes that were already running)');
  }
  console.log('');
}

if (failures.length) {
  console.log(`  NOT READY — ${failures.length} required check(s) failed.`);
  console.log('  `npm run sweep` and `npm run precopy` will not work until they pass.\n');
  process.exit(1);
}

console.log(
  `  READY — harness can run.` +
    (warnings.length ? `  ${warnings.length} warning(s) above limit what you can do.` : '')
);
console.log('  Verify with: npm run sweep   (expect 64 passed)\n');
