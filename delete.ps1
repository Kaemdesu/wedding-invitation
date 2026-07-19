# remove-wedding-game.ps1
# Run from repo root: C:\Users\kelvi\Desktop\wedding-invitation-website
$ErrorActionPreference = 'Stop'

$targets = @(
    'app\journey',
    'components\journey',
    'lib\journey-config.ts',
    'public\journey'
)

$root = $PSScriptRoot
if (-not (Test-Path (Join-Path $root 'package.json'))) {
    Write-Warning "package.json not found in $root — run this script from the repo root."
}

foreach ($t in $targets) {
    $path = Join-Path $root $t
    if (Test-Path $path) {
        Remove-Item -LiteralPath $path -Recurse -Force
        Write-Host "Deleted: $t" -ForegroundColor Green
    } else {
        Write-Host "Skip (not found): $t" -ForegroundColor DarkGray
    }
}

Write-Host "`nDone. Verify build: npm run build" -ForegroundColor Cyan
