<#
  play-sound.ps1 — used by the Claude Code Notification and Stop hooks.

  Why a script and not an inline hook command: the hook string is parsed by
  Git Bash first and PowerShell second, so an inline one-liner needs two
  layers of escaping and breaks the moment a path or quote changes. A file
  takes an argument and sidesteps all of it.

  Why MediaPlayer and not SoundPlayer: SoundPlayer is WAV-only, and these
  are MP3s. MediaPlayer (WPF) handles both.

  Fails silently on purpose — a missing sound file must never interrupt or
  block a Claude Code turn.
#>
param(
  [Parameter(Mandatory = $true)][string]$Path,
  [double]$MaxSeconds = 10,
  [int]$FadeMs = 300
)

try {
  if (-not (Test-Path -LiteralPath $Path)) { exit 0 }

  Add-Type -AssemblyName PresentationCore -ErrorAction Stop
  $player = New-Object System.Windows.Media.MediaPlayer
  $player.Open([uri]((Resolve-Path -LiteralPath $Path).Path))

  # Open() is async; the duration is not known until the media is buffered.
  $waited = 0
  while (-not $player.NaturalDuration.HasTimeSpan -and $waited -lt 50) {
    Start-Sleep -Milliseconds 100
    $waited++
  }

  $natural = if ($player.NaturalDuration.HasTimeSpan) {
    $player.NaturalDuration.TimeSpan.TotalSeconds
  } else { 3 }

  $seconds = [math]::Min($natural, $MaxSeconds)
  $player.Play()

  # When we are cutting the clip short, ramp the volume down instead of
  # stopping dead — an abrupt cut mid-waveform clicks. Trimming the file
  # itself would be cleaner, but the only ffmpeg on this machine is
  # Playwright's, which ships no mp3/wav demuxer and cannot read these files.
  if ($seconds -lt $natural -and $FadeMs -gt 0) {
    $holdMs = [int]($seconds * 1000) - $FadeMs
    if ($holdMs -gt 0) { Start-Sleep -Milliseconds $holdMs }
    $steps = 12
    for ($i = $steps; $i -ge 0; $i--) {
      $player.Volume = ($i / $steps)
      Start-Sleep -Milliseconds ([int]($FadeMs / $steps))
    }
  } else {
    Start-Sleep -Milliseconds ([int]($seconds * 1000) + 200)
  }

  $player.Close()
} catch {
  # never surface an error into the hook
}
exit 0
