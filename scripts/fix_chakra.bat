@echo off
REM Script para adicionar Chakra UI a um projeto existente
REM Aceita o caminho do projeto como parâmetro
set PROJECT_PATH=%1
if "%PROJECT_PATH%"=="" (
    echo [ERROR] Caminho do projeto nao fornecido
    echo Uso: fix_chakra.bat "caminho/do/projeto"
    exit /b 1
)

echo [INFO] Adicionando Chakra UI ao projeto existente: %PROJECT_PATH%
cd /d "%PROJECT_PATH%"

if not exist "package.json" (
    echo [ERROR] package.json nao encontrado. Nao e um projeto Node.js valido.
    exit /b 1
)

echo [INFO] Instalando Chakra UI e dependencias...
npm install @chakra-ui/react@^2.8.2 @emotion/react @emotion/styled framer-motion @chakra-ui/icons@^2.1.1 react-icons
if %errorlevel% neq 0 (
    echo [ERROR] Falha ao instalar Chakra UI
    exit /b 1
)

echo [INFO] Configurando Chakra UI...
call "%~dp0setup_chakra.bat" "%PROJECT_PATH%"
if %errorlevel% neq 0 (
    echo [ERROR] Falha ao configurar Chakra UI
    exit /b 1
)

echo [INFO] Chakra UI adicionado com sucesso ao projeto!
echo [INFO] Reinicie o servidor de desenvolvimento (npm run dev)
