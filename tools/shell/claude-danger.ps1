# >>> claude-danger (worksgroup) >>>
# Managed by `npm run shell:install` — edit tools/shell/claude-danger.ps1
# in the worksgroup repo, not this copy. Anything between these markers is
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
function claude-danger {
    if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
        Write-Host "claude is not on PATH in this shell." -ForegroundColor Red
        Write-Host "If Claude Code was installed after this terminal opened, restart it." -ForegroundColor DarkGray
        return
    }

    Write-Host ""
    Write-Host "  !!  BYPASS PERMISSIONS  !!" -ForegroundColor Black -BackgroundColor Yellow
    Write-Host "  No permission prompts. Every edit and command runs unasked." -ForegroundColor Yellow
    Write-Host "  cwd: $(Get-Location)" -ForegroundColor DarkGray
    Write-Host ""

    & claude --dangerously-skip-permissions @args
}

Set-Alias -Name cdanger -Value claude-danger
# <<< claude-danger (worksgroup) <<<
