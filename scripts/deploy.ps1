# Compila el sitio estático y lo publica en la rama `deploy` (solo el contenido de out/).
# En el hosting basta con hacer `git pull` de la rama deploy en la carpeta pública.
#
# Uso:  powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 ["mensaje del commit"]

param([string]$Mensaje = "")

$ErrorActionPreference = "Continue"
$raiz = Split-Path -Parent $PSScriptRoot
$worktree = Join-Path $raiz ".deploy"
Set-Location $raiz

if (git status --porcelain) {
    Write-Warning "Hay cambios sin commit en main; el deploy usará lo que hay en disco."
}

npm run build
if ($LASTEXITCODE -ne 0) { throw "Falló npm run build" }

# Worktree de la rama deploy en .deploy/ (se crea la primera vez)
if (-not (Test-Path (Join-Path $worktree ".git"))) {
    git worktree prune
    git show-ref --verify --quiet refs/heads/deploy
    if ($LASTEXITCODE -ne 0 -and (git ls-remote --heads origin deploy)) {
        git fetch origin deploy:deploy
    }
    git show-ref --verify --quiet refs/heads/deploy
    if ($LASTEXITCODE -eq 0) {
        git worktree add $worktree deploy
    } else {
        git worktree add --orphan -b deploy $worktree
    }
} elseif (git ls-remote --heads origin deploy) {
    git -C $worktree pull --ff-only origin deploy
}

# Reemplaza el contenido del worktree por out/ (sin tocar .git)
robocopy (Join-Path $raiz "out") $worktree /MIR /XD .git /XF .git /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Falló la copia de out/ (robocopy $LASTEXITCODE)" }

$commit = git rev-parse --short HEAD
if (-not $Mensaje) { $Mensaje = "build: export estático desde main $commit" }

git -C $worktree add -A
if (git -C $worktree status --porcelain) {
    # el mensaje va por archivo UTF-8 para que git no reciba las tildes en la codificación ANSI de la consola
    $archivoMsg = Join-Path $env:TEMP "oreorekords-deploy-msg.txt"
    [IO.File]::WriteAllText($archivoMsg, $Mensaje, (New-Object Text.UTF8Encoding $false))
    git -C $worktree commit -q -F $archivoMsg
    Remove-Item $archivoMsg
    git -C $worktree push -u origin deploy
    if ($LASTEXITCODE -ne 0) { throw "Commit hecho en deploy, pero falló el push a GitHub" }
    Write-Host "Deploy publicado en la rama deploy." -ForegroundColor Green
} else {
    Write-Host "Sin cambios en el sitio; no hay nada que publicar." -ForegroundColor Yellow
}
