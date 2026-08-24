# >>> claude-danger (worksgroup) >>>
# Managed by `npm run shell:install` — edit tools/shell/claude-danger.sh in
# the worksgroup repo, not this copy. Anything between these markers is
# replaced on the next install.
#
# claude-danger — Claude Code with ALL permission prompts off.
# Equivalent to `claude --dangerously-skip-permissions`. Kept as its own
# command rather than a shift+tab mode on purpose: bypass mode is opt-in at
# launch precisely so you cannot tab into it by accident.
#
#     claude-danger                 # fresh session, no prompts
#     claude-danger --continue      # resume the last one, no prompts
#     claude-danger -p "..."        # one-shot, no prompts
#
# WARNING: in this state nothing stops a mistaken command. Prefer it for
# throwaway or sandboxed work, not for folders that publish to a live site.
claude-danger() {
  if ! command -v claude >/dev/null 2>&1; then
    printf '\033[31mclaude is not on PATH in this shell.\033[0m\n'
    printf '\033[90mIf Claude Code was installed after this terminal opened, restart it.\033[0m\n'
    return 1
  fi

  printf '\n\033[30;43m  !!  BYPASS PERMISSIONS  !!  \033[0m\n'
  printf '\033[33m  No permission prompts. Every edit and command runs unasked.\033[0m\n'
  printf '\033[90m  cwd: %s\033[0m\n\n' "$PWD"

  command claude --dangerously-skip-permissions "$@"
}

alias cdanger='claude-danger'
# <<< claude-danger (worksgroup) <<<
