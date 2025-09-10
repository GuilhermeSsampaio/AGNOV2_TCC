@echo off
REM Script para adicionar PrimeReact a um projeto existente
REM Aceita o caminho do projeto como parâmetro
set PROJECT_PATH=%1
if "%PROJECT_PATH%"=="" (
    echo [ERROR] Caminho do projeto nao fornecido
    echo Uso: fix_primereact.bat "caminho/do/projeto"
    exit /b 1
)

echo [INFO] Adicionando PrimeReact ao projeto existente: %PROJECT_PATH%
cd /d "%PROJECT_PATH%"

if not exist "package.json" (
    echo [ERROR] package.json nao encontrado. Nao e um projeto Node.js valido.
    exit /b 1
)

echo [INFO] Instalando PrimeReact e dependencias...
npm install primereact primeicons primeflex react-icons
if %errorlevel% neq 0 (
    echo [ERROR] Falha ao instalar PrimeReact
    exit /b 1
)

echo [INFO] Configurando PrimeReact...
call "%~dp0setup_primereact.bat" "%PROJECT_PATH%"
if %errorlevel% neq 0 (
    echo [ERROR] Falha ao configurar PrimeReact
    exit /b 1
)

echo [INFO] PrimeReact adicionado com sucesso ao projeto!
echo [INFO] Reinicie o servidor de desenvolvimento (npm run dev)
