/* ============================================================
   sounds-install — set up the Claude Code notification sounds
   on this machine.

   The audio and the player script are tracked in this repo, but the
   wiring is NOT: the hooks live in ~/.claude/settings.json, which is
   personal config and carries absolute paths under the current user's
   home directory. So a clone gives you the parts, and this assembles
   them for whatever machine you are on.

       npm run sounds:install            # copy files, print the hook JSON
       npm run sounds:install -- --write # also merge the hooks into settings
       npm run sounds:install -- --write --force   # overwrite existing hooks

   Without --write nothing outside the repo is modified except the two
   copied files, and the hook JSON is printed for you to paste.

   Default is print-not-write on purpose: ~/.claude/settings.json is the
   user's own config and may hold hooks this script knows nothing about.
   ============================================================ */

const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_SOUNDS = path.join(ROOT, 'Sounds');
const SRC_SCRIPT = path.join(__dirname, 'play-sound.ps1');

const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const DST_SOUNDS = path.join(CLAUDE_DIR, 'sounds');
const DST_SCRIPT = path.join(CLAUDE_DIR, 'play-sound.ps1');
const SETTINGS = path.join(CLAUDE_DIR, 'settings.json');

const argv = process.argv.slice(2);
const write = argv.includes('--write');
const force = argv.includes('--force');

/* message.mp3 fires on a permission prompt or question; jobsdone.mp3 when a
   turn ends. message-full.mp3 is the untrimmed original, kept for re-cuts —
   it is copied too, but no hook points at it. */
const MAP = [
  { event: 'Notification', file: 'message.mp3', why: 'a question or permission prompt is waiting' },
  { event: 'Stop', file: 'jobsdone.mp3', why: 'a turn finished' },
];

const log = (s) => console.log(s);
let failed = false;

log(`\n  sounds-install — ${os.userInfo().username}@${os.hostname()}`);
log(`  ${'-'.repeat(58)}`);

/* ---------- 1. copy the audio + the player script ---------- */

if (!fs.existsSync(SRC_SOUNDS)) {
  console.error(`  FAIL  no Sounds/ folder at ${SRC_SOUNDS}`);
  process.exit(1);
}

fs.mkdirSync(DST_SOUNDS, { recursive: true });

const mp3s = fs.readdirSync(SRC_SOUNDS).filter((f) => f.toLowerCase().endsWith('.mp3'));
for (const f of mp3s) {
  fs.copyFileSync(path.join(SRC_SOUNDS, f), path.join(DST_SOUNDS, f));
  const kb = Math.round(fs.statSync(path.join(DST_SOUNDS, f)).size / 1024);
  log(`  [OK]   ${f.padEnd(20)} -> ~/.claude/sounds/  (${kb} KB)`);
}

fs.copyFileSync(SRC_SCRIPT, DST_SCRIPT);
log(`  [OK]   play-sound.ps1       -> ~/.claude/`);

/* every hook target must actually exist, or the sound silently never plays */
for (const m of MAP) {
  if (!fs.existsSync(path.join(DST_SOUNDS, m.file))) {
    console.error(`  FAIL  ${m.file} is missing from Sounds/ — ${m.event} would be silent`);
    failed = true;
  }
}
if (failed) process.exit(1);

/* ---------- 2. build the hook block for THIS machine ---------- */

/* Invoke powershell.exe explicitly rather than using the hook schema's
   "shell": "powershell" — that means pwsh (PowerShell 7), which is not
   installed on either machine. The default shell here is Git Bash. */
const hookCommand = (soundFile) =>
  `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "${DST_SCRIPT}" -Path "${path.join(DST_SOUNDS, soundFile)}"`;

const hookBlock = {};
for (const m of MAP) {
  hookBlock[m.event] = [
    { hooks: [{ type: 'command', command: hookCommand(m.file), async: true, timeout: 15 }] },
  ];
}

/* ---------- 3. write, or print for pasting ---------- */

if (!write) {
  log(`\n  Files are in place. To wire the hooks, merge this into`);
  log(`  ${SETTINGS}\n`);
  log(JSON.stringify({ hooks: hookBlock }, null, 2).split('\n').map((l) => '    ' + l).join('\n'));
  log(`\n  Or re-run with --write to merge it automatically:`);
  log(`      npm run sounds:install -- --write\n`);
  process.exit(0);
}

let settings = {};
if (fs.existsSync(SETTINGS)) {
  try {
    settings = JSON.parse(fs.readFileSync(SETTINGS, 'utf8'));
  } catch (e) {
    console.error(`  FAIL  ${SETTINGS} is not valid JSON — refusing to overwrite it.`);
    console.error(`        Fix it by hand first; a broken settings file disables ALL settings.`);
    process.exit(1);
  }
}

settings.hooks = settings.hooks || {};

const existing = MAP.filter((m) => settings.hooks[m.event]).map((m) => m.event);
if (existing.length && !force) {
  log(`\n  Already configured: ${existing.join(', ')} hook(s) exist in settings.json.`);
  log(`  Left untouched — they may not be these sounds, and clobbering another`);
  log(`  hook silently is worse than doing nothing.`);
  log(`  Re-run with --force to replace them:`);
  log(`      npm run sounds:install -- --write --force\n`);
  process.exit(0);
}

/* back up before touching the user's settings — cheap, and this file holds
   more than sounds */
if (fs.existsSync(SETTINGS)) {
  const backup = SETTINGS + '.bak';
  fs.copyFileSync(SETTINGS, backup);
  log(`  [OK]   backed up settings.json -> settings.json.bak`);
}

for (const m of MAP) settings.hooks[m.event] = hookBlock[m.event];
fs.writeFileSync(SETTINGS, JSON.stringify(settings, null, 2) + '\n', 'utf8');

log(`  [OK]   wrote ${MAP.map((m) => m.event).join(' + ')} hooks to settings.json`);
log(`\n  Done. ${MAP.map((m) => `${m.event}: ${m.file} (${m.why})`).join('\n        ')}`);
log(`\n  ⚠️  A running session may not reload settings.json on its own —`);
log(`      open /hooks once, or restart, before expecting sound.\n`);
