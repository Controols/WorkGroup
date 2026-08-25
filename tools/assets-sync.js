/* ============================================================
   assets-sync — move the untracked asset folders between machines.

   `doctor` reports that Logo/ and the Desktop folders are missing and
   then says, correctly, that it cannot fix it: they are gitignored on
   purpose, so pulling will never bring them. CLAUDE.md has said since
   2026-08-24 that they "need a real channel". This is that channel.

   On the machine that HAS them:

       npm run assets:bundle                  # -> ~/Desktop/worksgroup-assets.zip
       npm run assets:bundle -- --out D:\x.zip

   Move that one file by whatever means (USB, shared drive, WeTransfer).
   Then on the machine that LACKS them:

       npm run assets:restore -- <zip>            # dry run — prints the plan
       npm run assets:restore -- <zip> --write    # actually unpack

   Two things this has to get right, and neither is obvious:

   1. DESTINATIONS ARE PER-MACHINE, NOT PATHS IN THE ZIP. Every Desktop
      path recorded in CLAUDE.md is `C:\Users\TMJ\...`, which does not
      exist on the other machine. So the zip stores a logical destination
      ("repo" or "desktop") per folder and restore resolves it against
      whatever machine it is running on — including the case where
      Desktop has been redirected into OneDrive.

   2. `tar` IS TWO DIFFERENT PROGRAMS HERE. Git Bash ships GNU tar 1.35,
      which has no zip support and fails on `-a`. Windows ships bsdtar at
      System32\tar.exe, which does. Whichever wins depends on PATH order,
      i.e. on which shell spawned node. So we resolve bsdtar by absolute
      path rather than trusting `tar`.

   Restore is a DRY RUN by default and refuses to overwrite a folder that
   already has files in it (--force overrides). It verifies what it wrote
   against the manifest rather than assuming the extract worked.
   ============================================================ */

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = '_manifest.json';
const DEFAULT_NAME = 'worksgroup-assets.zip';

/* ---------- the sets ----------
   `dest` is logical on purpose — see note 1 in the header. */
const ASSET_SETS = [
  {
    folder: 'Logo',
    dest: 'repo',
    why: 'Linen Works vector print pack. Carries the 40px rule in its README — '
       + 'the rule tests/linen-logo.spec.js enforces and the markup does not show.',
  },
  {
    folder: 'Stock photos Linen Works',
    dest: 'desktop',
    why: 'Full-res photo originals. Re-export from here; never re-compress the '
       + 'in-repo copies, that only degrades them.',
  },
  {
    folder: 'LinenWorks Text',
    dest: 'desktop',
    why: "The client's supplied English copy (About/ESG/Website).",
  },
  {
    folder: 'Linen Works data',
    dest: 'desktop',
    optional: true,
    why: 'Early mockup, the About Us PDF, and `logo 2.png` — which is NOT in the '
       + 'Logo pack. Undocumented in CLAUDE.md and nothing depends on it, but it '
       + 'is owner-supplied material that exists on one machine only.',
  },
];

/* ---------- args ---------- */
const argv = process.argv.slice(2);
const mode = argv[0] === 'restore' ? 'restore' : 'bundle';
const rest = argv[0] === 'restore' || argv[0] === 'bundle' ? argv.slice(1) : argv;

let outPath = null;
let zipPath = null;
let write = false;
let force = false;
for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (a === '--out' && rest[i + 1]) outPath = rest[++i];
  else if (a === '--write') write = true;
  else if (a === '--force') force = true;
  else if (!a.startsWith('--') && !zipPath) zipPath = a;
}

/* ---------- helpers ---------- */
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
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile()) {
      let size = 0;
      try { size = fs.statSync(p).size; } catch {}
      out.push({ rel: path.relative(dir, p).split(path.sep).join('/'), size });
    }
  }
  return out;
}

function measure(dir) {
  const files = walk(dir);
  return { files: files.length, bytes: files.reduce((n, f) => n + f.size, 0) };
}

/* Desktop may be redirected into OneDrive. Prefer one that exists; if
   neither does, fall back to the plain path and create it on write. */
function desktopDir() {
  const candidates = [
    path.join(os.homedir(), 'Desktop'),
    path.join(os.homedir(), 'OneDrive', 'Desktop'),
  ];
  for (const c of candidates) {
    try { if (fs.statSync(c).isDirectory()) return c; } catch {}
  }
  return candidates[0];
}

function resolveDest(dest) {
  return dest === 'repo' ? ROOT : desktopDir();
}

/* See note 2 in the header: do not trust bare `tar`. */
function bsdtar() {
  if (process.platform !== 'win32') return 'tar';
  const sysRoot = process.env.SystemRoot || 'C:\\Windows';
  const p = path.join(sysRoot, 'System32', 'tar.exe');
  try { fs.accessSync(p); return p; } catch {}
  return 'tar';
}

function tar(args, cwd) {
  return execFileSync(bsdtar(), args, {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}

function isNonEmptyDir(p) {
  try { return fs.readdirSync(p).length > 0; } catch { return false; }
}

const line = '  ' + '-'.repeat(60);
const say = (s = '') => console.log(s);

/* ============================================================
   bundle
   ============================================================ */
function bundle() {
  say('');
  say(`  assets-sync — bundle  ·  ${os.userInfo().username}@${os.hostname()}`);
  say(line);

  const present = [];
  const absent = [];
  for (const set of ASSET_SETS) {
    const from = path.join(resolveDest(set.dest), set.folder);
    let ok = false;
    try { ok = fs.statSync(from).isDirectory(); } catch {}
    if (ok) {
      const m = measure(from);
      present.push({ ...set, from, ...m });
      say(`  [PACK]  ${set.folder}`);
      say(`          ${from}  (${m.files} files, ${human(m.bytes)})`);
    } else {
      absent.push(set);
      say(`  [SKIP]  ${set.folder} — not on this machine${set.optional ? ' (optional)' : ''}`);
      say(`          looked in ${resolveDest(set.dest)}`);
    }
  }

  if (!present.length) {
    say(line);
    say('  Nothing to bundle — this machine has none of the asset folders.');
    say('  Run this on the machine that HAS them (see `npm run doctor`).');
    say('');
    process.exit(1);
  }

  const out = path.resolve(outPath || path.join(desktopDir(), DEFAULT_NAME));
  const totalBytes = present.reduce((n, s) => n + s.bytes, 0);
  const totalFiles = present.reduce((n, s) => n + s.files, 0);

  say(line);
  say(`  ${present.length} folder(s), ${totalFiles} files, ${human(totalBytes)} -> ${out}`);
  say('  Packing…');

  /* Stage the manifest next to the output so it lands at the zip root.
     Contents are listed per set so restore can verify rather than trust. */
  const manifest = {
    tool: 'assets-sync',
    version: 1,
    createdOn: `${os.userInfo().username}@${os.hostname()}`,
    sets: present.map((s) => ({
      folder: s.folder,
      dest: s.dest,
      files: s.files,
      bytes: s.bytes,
      optional: !!s.optional,
      why: s.why,
    })),
  };

  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'wg-assets-'));
  const manifestPath = path.join(staging, MANIFEST);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  try {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    try { fs.unlinkSync(out); } catch {}

    /* One tar invocation per source root: each folder lives under a
       different parent, so -C has to change between them. bsdtar takes
       repeated -C, applied in order, which keeps this to a single call. */
    const args = ['-a', '-c', '-f', out, '-C', staging, MANIFEST];
    for (const s of present) {
      args.push('-C', path.dirname(s.from), s.folder);
    }
    tar(args);
  } catch (err) {
    say('');
    say('  FAILED to create the archive.');
    say('  ' + String(err.stderr || err.message).trim().split('\n').join('\n  '));
    say('');
    process.exit(1);
  } finally {
    try { fs.rmSync(staging, { recursive: true, force: true }); } catch {}
  }

  const zipped = fs.statSync(out).size;
  say(line);
  say(`  WROTE  ${out}`);
  say(`         ${human(zipped)} on disk (${human(totalBytes)} unpacked)`);
  if (absent.length) {
    say('');
    say(`  NOT included (absent here): ${absent.map((a) => a.folder).join(', ')}`);
  }
  say('');
  say('  Move that file to the other machine, then run there:');
  say(`      npm run assets:restore -- "<path>\\${path.basename(out)}"`);
  say('      npm run assets:restore -- "<path>" --write');
  say('');
  say('  ⚠️ Git will never carry these folders. If they change, re-bundle.');
  say('');
}

/* ============================================================
   restore
   ============================================================ */
function restore() {
  say('');
  say(`  assets-sync — restore  ·  ${os.userInfo().username}@${os.hostname()}`);
  say(line);

  if (!zipPath) {
    say('  No archive given.');
    say('      npm run assets:restore -- <path-to-worksgroup-assets.zip>');
    say('');
    process.exit(1);
  }
  const zip = path.resolve(zipPath);
  try {
    if (!fs.statSync(zip).isFile()) throw new Error('not a file');
  } catch {
    say(`  Archive not found: ${zip}`);
    say('');
    process.exit(1);
  }

  /* Read the manifest without unpacking the whole archive. */
  let manifest;
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'wg-assets-'));
  try {
    tar(['-x', '-f', zip, '-C', staging, MANIFEST]);
    manifest = JSON.parse(fs.readFileSync(path.join(staging, MANIFEST), 'utf8'));
  } catch {
    say(`  ${path.basename(zip)} has no ${MANIFEST} at its root.`);
    say('  It was not made by `npm run assets:bundle`; unpack it by hand.');
    say('');
    try { fs.rmSync(staging, { recursive: true, force: true }); } catch {}
    process.exit(1);
  } finally {
    try { fs.rmSync(staging, { recursive: true, force: true }); } catch {}
  }

  say(`  ${path.basename(zip)}  (${human(fs.statSync(zip).size)}, from ${manifest.createdOn})`);
  say('');

  const plan = [];
  let blocked = 0;
  for (const s of manifest.sets) {
    const to = path.join(resolveDest(s.dest), s.folder);
    const exists = isNonEmptyDir(to);
    if (exists && !force) {
      blocked++;
      say(`  [BLOCKED]  ${s.folder}`);
      say(`             ${to} already has files — pass --force to overwrite`);
      const m = measure(to);
      say(`             here: ${m.files} files, ${human(m.bytes)} · incoming: ${s.files} files, ${human(s.bytes)}`);
    } else {
      plan.push({ ...s, to });
      say(`  [${exists ? 'OVERWRITE' : 'RESTORE'}]  ${s.folder}  (${s.files} files, ${human(s.bytes)})`);
      say(`             -> ${to}`);
    }
  }

  say(line);

  if (!plan.length) {
    say('  Nothing to do.');
    say(blocked ? '  Everything is already present. Re-run with --force to replace it.' : '');
    say('');
    process.exit(blocked ? 1 : 0);
  }

  if (!write) {
    say(`  DRY RUN — nothing written. Re-run with --write to apply:`);
    say(`      npm run assets:restore -- "${zip}" --write${force ? ' --force' : ''}`);
    say('');
    process.exit(0);
  }

  say('  Unpacking…');
  let failed = 0;
  for (const s of plan) {
    const parent = path.dirname(s.to);
    try {
      fs.mkdirSync(parent, { recursive: true });
      tar(['-x', '-f', zip, '-C', parent, s.folder]);
    } catch (err) {
      failed++;
      say(`  [FAIL]  ${s.folder}`);
      say('          ' + String(err.stderr || err.message).trim().split('\n').join('\n          '));
      continue;
    }
    /* Verify rather than assume — a partial extract is silent otherwise. */
    const m = measure(s.to);
    if (m.files === s.files && m.bytes === s.bytes) {
      say(`  [OK]    ${s.folder} — ${m.files} files, ${human(m.bytes)}`);
    } else {
      failed++;
      say(`  [FAIL]  ${s.folder} — expected ${s.files} files / ${human(s.bytes)},`);
      say(`          got ${m.files} files / ${human(m.bytes)}`);
    }
  }

  say(line);
  if (failed) {
    say(`  ${failed} folder(s) did not restore cleanly. Nothing else was touched.`);
    say('');
    process.exit(1);
  }
  say('  Done. Confirm with:  npm run doctor');
  say('');
}

mode === 'restore' ? restore() : bundle();
