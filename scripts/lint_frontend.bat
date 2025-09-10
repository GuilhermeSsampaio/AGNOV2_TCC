@echo off
echo [LINT] Executando lint e formatacao no projeto frontend...

set PROJECT_PATH=%1
if "%PROJECT_PATH%"=="" (
    echo [WARNING] Caminho do projeto nao fornecido, usando padrao
    set PROJECT_PATH=projects\project_xx\frontend
)

echo [LINT] Executando lint em: %PROJECT_PATH%
cd /d "%PROJECT_PATH%"

if not exist "node_modules" (
    echo [WARNING] node_modules nao encontrado. Executando npm install...
    npm install
)

echo [LINT] Executando ESLint...
npm run lint 2>nul || echo [WARNING] ESLint nao configurado ou falhou

echo [LINT] Verificando se Prettier esta disponivel...
npx prettier --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [LINT] Executando Prettier...
    npx prettier --write "src/**/*.{js,jsx,ts,tsx,css,html}" 2>nul || echo [WARNING] Prettier falhou
) else (
    echo [WARNING] Prettier nao esta instalado
)

echo [LINT] Lint e formatacao concluidos
cd /d "%~dp0.."
