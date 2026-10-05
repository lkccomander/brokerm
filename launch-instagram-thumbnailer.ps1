$ErrorActionPreference = "Stop"

$appDir = Join-Path $PSScriptRoot "tools\instagram-thumbnailer"
$appPath = Join-Path $appDir "app.py"
$venvPython = Join-Path $appDir ".venv\Scripts\python.exe"

if (-not (Test-Path -LiteralPath $venvPython -PathType Leaf)) {
    throw "No se encontro la .venv de la herramienta. Cree el entorno con: py -m venv '$appDir\.venv'. Luego ejecute: & '$venvPython' -m pip install -r '$appDir\requirements.txt'; & '$venvPython' -m playwright install chromium."
}

& $venvPython $appPath @args
exit $LASTEXITCODE
