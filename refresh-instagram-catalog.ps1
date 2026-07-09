param(
    [switch]$Json,
    [switch]$Build,
    [switch]$GraphifyUpdate
)

$ErrorActionPreference = "Stop"

$projectRoot = "C:\Projects\brokermike"
$thumbnailerDir = Join-Path $projectRoot "tools\instagram-thumbnailer"
$appPath = Join-Path $thumbnailerDir "app.py"
$venvPython = Join-Path $thumbnailerDir ".venv\Scripts\python.exe"

Set-Location $projectRoot

if (Test-Path $venvPython) {
    $python = $venvPython
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $python = "py"
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    $python = "python"
} else {
    throw "No se encontro Python. Revise la .venv o su instalacion de Python en Windows."
}

$argsList = @($appPath, "refresh-catalog-thumbnails")
if ($Json) {
    $argsList += "--json"
}

& $python @argsList
$refreshExitCode = $LASTEXITCODE
if ($refreshExitCode -ne 0) {
    exit $refreshExitCode
}

if ($Build) {
    Push-Location (Join-Path $projectRoot "landingpage")
    try {
        npm run build
    } finally {
        Pop-Location
    }
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

if ($GraphifyUpdate) {
    graphify update .
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}
