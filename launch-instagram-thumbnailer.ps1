$ErrorActionPreference = "Stop"

$projectRoot = "C:\Projects\brokermike"
$appPath = Join-Path $projectRoot "tools\instagram-thumbnailer\app.py"
$venvPython = Join-Path $projectRoot "tools\instagram-thumbnailer\.venv\Scripts\python.exe"

Set-Location $projectRoot

if (Test-Path $venvPython) {
    & $venvPython $appPath
    exit $LASTEXITCODE
}

if (Get-Command py -ErrorAction SilentlyContinue) {
    & py $appPath
    exit $LASTEXITCODE
}

if (Get-Command python -ErrorAction SilentlyContinue) {
    & python $appPath
    exit $LASTEXITCODE
}

throw "No se encontro Python. Revise la .venv o su instalacion de Python en Windows."
