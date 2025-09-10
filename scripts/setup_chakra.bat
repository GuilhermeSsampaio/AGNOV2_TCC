@echo off
REM Configura Chakra UI no projeto
REM Aceita o caminho do projeto como parâmetro
set PROJECT_PATH=%1
if "%PROJECT_PATH%"=="" (
    echo [ERROR] Caminho do projeto nao fornecido
    exit /b 1
)

echo [INFO] Configurando Chakra UI em: %PROJECT_PATH%
cd /d "%PROJECT_PATH%"

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo [ERROR] node_modules nao encontrado. Execute npm install primeiro.
    exit /b 1
)

REM Verificar se Chakra UI foi instalado
if not exist "node_modules\@chakra-ui" (
    echo [ERROR] Chakra UI nao foi instalado corretamente
    exit /b 1
)

echo [INFO] Criando backup dos arquivos originais...
if exist "src\main.jsx" (
    copy "src\main.jsx" "src\main.jsx.bak" >nul
)
if exist "src\App.jsx" (
    copy "src\App.jsx" "src\App.jsx.bak" >nul
)

echo [INFO] Criando main.jsx com ChakraProvider...
(
echo import { StrictMode } from 'react'
echo import { createRoot } from 'react-dom/client'
echo import { ChakraProvider } from '@chakra-ui/react'
echo import './index.css'
echo import App from './App.jsx'
echo.
echo createRoot^(document.getElementById^('root'^)^).render^(
echo   ^<StrictMode^>
echo     ^<ChakraProvider^>
echo       ^<App /^>
echo     ^</ChakraProvider^>
echo   ^</StrictMode^>,
echo ^)
) > src\main.jsx

echo [INFO] Criando App.jsx inicial com Chakra UI...
(
echo import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
echo.
echo function App^(^) {
echo   return ^(
echo     ^<Container maxW='container.xl' py={8}^>
echo       ^<VStack spacing={8}^>
echo         ^<Box textAlign='center'^>
echo           ^<Heading size='2xl' color='blue.600'^>
echo             Bem-vindo ao seu Projeto React
echo           ^</Heading^>
echo           ^<Text fontSize='lg' color='gray.600' mt={4}^>
echo             Projeto criado com Vite + React + Chakra UI
echo           ^</Text^>
echo         ^</Box^>
echo       ^</VStack^>
echo     ^</Container^>
echo   ^)
echo }
echo.
echo export default App
) > src\App.jsx

echo [INFO] Chakra UI configurado com sucesso!
