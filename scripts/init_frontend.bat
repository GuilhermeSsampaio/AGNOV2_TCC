@echo off
REM Inicializa projeto React + Vite e instala PrimeReact
REM Aceita o caminho do projeto como parâmetro
set PROJECT_PATH=%1
if "%PROJECT_PATH%"=="" (
    echo [ERROR] Caminho do projeto nao fornecido
    exit /b 1
)

echo [INFO] Inicializando projeto em: %PROJECT_PATH%
cd /d "%PROJECT_PATH%"

echo [INFO] Criando projeto Vite...
npx create-vite . --template react --yes
if %errorlevel% neq 0 (
    echo [ERROR] Falha ao criar projeto Vite
    exit /b 1
)

echo [INFO] Instalando dependencias base...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Falha ao instalar dependencias base
    exit /b 1
)

echo [INFO] Instalando PrimeReact e dependencias...
npm install primereact primeicons primeflex
if %errorlevel% neq 0 (
    echo [ERROR] Falha ao instalar PrimeReact
    exit /b 1
)

echo [INFO] Instalando React Icons para icones adicionais...
npm install react-icons
if %errorlevel% neq 0 (
    echo [ERROR] Falha ao instalar react-icons
    exit /b 1
)

echo [INFO] Configurando PrimeReact...
call "%~dp0setup_primereact.bat" "%PROJECT_PATH%"
if %errorlevel% neq 0 (
    echo [ERROR] Falha ao configurar PrimeReact
    exit /b 1
)

echo [INFO] Projeto React + PrimeReact criado com sucesso!
