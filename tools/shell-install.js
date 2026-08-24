/* ============================================================
   shell-install — put the `claude-danger` helper into this
   machine's PowerShell profile and Git Bash rc files.

   Same split as sounds-install: the content is tracked in the repo,
   the wiring is personal config outside it. The snippets themselves are
   portable — they only call `claude` off PATH — so the same block works
   on any machine unmodified.

       npm run shell:install            # show what would change
       npm run shell:install -- --write # apply it
       npm run shell:install -- --remove --write   # take it back out

   Idempotent: the block is delimited by
       >>> claude-danger (worksgroup) >>>   ...   <<< claude-danger ... <<<
   and an install REPLACES anything between those markers rather than
   appending a second copy. Re-running after editing a snippet updates
   the profile in place.

   Default is show-not-write. A shell profile is the user's own file and
   may hold anything; nothing outside the repo is touched without --write.
   ============================================================ */

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(__dirname, 'shell');

const BEGIN = '# >>> claude-danger (worksgroup) >>>';
const END = '# <<< claude-danger (worksgroup) <<<';

const argv = process.argv.slice(2);
const write = argv.includes('--write');
const remove = argv.includes('--remove');

const log = (s) => console.log(s);

log(`\n  shell-install — ${os.userInfo().username}@${os.hostname()}`);
log(`  ${'-'.repeat(58)}`);

/* ---------- where does PowerShell actually keep its profile? ----------
   Do not hardcode Documents\WindowsPowerShell — Documents is often
   redirected into OneDrive, which moves $PROFILE with it. Ask PowerShell. */
function powershellProfilePath() {
  try {
    const out = execSync('powershell -NoProfile -NonInteractive -Command "$PROFILE"', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 20000,
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

const HOME = os.homedir();
const psProfile = powershellProfilePath();

const TARGETS = [
  psProfile && {
    label: 'PowerShell profile',
    file: psProfile,
    snippet: path.join(SRC, 'claude-danger.ps1'),
    /* Leave a BOM alone here. PowerShell 5.1 reads BOM-less UTF-8 as ANSI,
       so stripping one can mangle non-ASCII characters in the profile. */
    stripBom: false,
  },
  {
    label: 'Git Bash (.bashrc)',
    file: path.join(HOME, '.bashrc'),
    snippet: path.join(SRC, 'claude-danger.sh'),
    stripBom: true,
  },
].filter(Boolean);

if (!psProfile) {
  log('  [WARN] could not resolve $PROFILE — skipping PowerShell, doing bash only');
}

/* ---------- apply ---------- */

/* Markers must match a WHOLE LINE, not just appear somewhere in the file.
   A plain indexOf() cannot tell a real marker from prose that quotes one —
   and a profile header explaining "the block between the >>> ... >>> markers"
   does exactly that. The first version of this matched the header comment and
   swallowed it on --remove. Anchor to line boundaries instead. */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const lineRe = (marker) => new RegExp('^[ \\t]*' + escapeRe(marker) + '[ \\t]*$', 'm');

function findBlock(existing) {
  const b = lineRe(BEGIN).exec(existing);
  if (!b) return null;
  const e = lineRe(END).exec(existing.slice(b.index));
  if (!e) return null;
  return { start: b.index, end: b.index + e.index + e[0].length };
}

function hasBlock(existing) {
  return findBlock(existing) !== null;
}

function applyBlock(existing, block) {
  const found = findBlock(existing);
  if (found) {
    // replace in place, preserving whatever surrounds it
    return existing.slice(0, found.start) + block.trim() + existing.slice(found.end);
  }
  const sep = existing.length && !existing.endsWith('\n') ? '\n\n' : existing.length ? '\n' : '';
  return existing + sep + block.trim() + '\n';
}

function stripBlock(existing) {
  const found = findBlock(existing);
  if (!found) return null;
  return (existing.slice(0, found.start) + existing.slice(found.end))
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s*$/, '\n');
}

let changes = 0;

for (const t of TARGETS) {
  const block = fs.readFileSync(t.snippet, 'utf8');
  const exists = fs.existsSync(t.file);

  /* Strip a leading UTF-8 BOM. PowerShell 5.1's `Set-Content -Encoding utf8`
     writes one, and bash does not skip it — the BOM glues onto the first
     token, so a login shell greets you with
         bash: $'\357\273\277#': command not found
     on every start. Reading it off here means the next install heals a file
     someone edited from PowerShell, rather than preserving the breakage. */
  const raw = exists ? fs.readFileSync(t.file, 'utf8') : '';
  const current = t.stripBom ? raw.replace(/^﻿/, '') : raw;
  const hadBom = raw !== current;

  const present = hasBlock(current);

  let next;
  let verb;
  if (remove) {
    const stripped = stripBlock(current);
    if (stripped === null) {
      log(`  [SKIP] ${t.label.padEnd(20)} block not present`);
      continue;
    }
    next = stripped;
    verb = 'remove block from';
  } else {
    next = applyBlock(current, block);
    verb = present ? 'UPDATE block in' : exists ? 'append block to' : 'create';
  }

  /* Compare against what is actually ON DISK, not the cleaned-up copy —
     otherwise a file whose only problem is a BOM reports "up to date" and
     the BOM is never written away. */
  if (next === raw) {
    log(`  [OK]   ${t.label.padEnd(20)} already up to date`);
    continue;
  }
  if (hadBom) log(`  [FIX]  ${t.label.padEnd(20)} stripping UTF-8 BOM (breaks bash)`);

  changes++;
  if (!write) {
    log(`  [DRY]  ${verb} ${t.file}`);
    continue;
  }

  fs.mkdirSync(path.dirname(t.file), { recursive: true });
  if (exists) fs.copyFileSync(t.file, t.file + '.bak');
  fs.writeFileSync(t.file, next, 'utf8');
  log(`  [OK]   ${verb.padEnd(17)} ${t.file}${exists ? '  (backed up .bak)' : ''}`);
}

/* Git Bash starts as a LOGIN shell, so it reads .bash_profile and ignores
   .bashrc entirely. Without this the function exists in the file and never
   loads — the most confusing possible failure. */
if (!remove) {
  const bp = path.join(HOME, '.bash_profile');
  const line = '[ -f "$HOME/.bashrc" ] && . "$HOME/.bashrc"';
  const cur = fs.existsSync(bp) ? fs.readFileSync(bp, 'utf8') : '';
  if (!cur.includes('.bashrc')) {
    changes++;
    if (write) {
      if (fs.existsSync(bp)) fs.copyFileSync(bp, bp + '.bak');
      const header =
        '# Git Bash starts as a LOGIN shell, which reads this file and ignores\n' +
        '# .bashrc. Source it here so both shell types behave the same.\n';
      fs.writeFileSync(bp, (cur ? cur.replace(/\s*$/, '\n\n') : '') + header + line + '\n', 'utf8');
      log(`  [OK]   .bash_profile sources .bashrc`);
    } else {
      log(`  [DRY]  make .bash_profile source .bashrc (login shells ignore .bashrc)`);
    }
  } else {
    log(`  [OK]   .bash_profile        already sources .bashrc`);
  }
}

log(`  ${'-'.repeat(58)}`);

if (!changes) {
  log(`  Nothing to do — everything already matches the repo.\n`);
  process.exit(0);
}

if (!write) {
  log(`  ${changes} change(s) would be made. Re-run with --write to apply:`);
  log(`      npm run shell:install -- --write\n`);
  process.exit(0);
}

log(`  Done. Open a NEW terminal, then:  claude-danger   (or: cdanger)`);
log(`  Existing shells keep their old environment — same staleness rule as PATH.\n`);
