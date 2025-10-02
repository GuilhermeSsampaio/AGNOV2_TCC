@echo off
REM Configura PrimeReact no projeto
REM Aceita o caminho do projeto como parâmetro
set PROJECT_PATH=%1
if "%PROJECT_PATH%"=="" (
    echo [ERROR] Caminho do projeto nao fornecido
    exit /b 1
)

echo [INFO] Configurando PrimeReact em: %PROJECT_PATH%
cd /d "%PROJECT_PATH%"

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo [ERROR] node_modules nao encontrado. Execute npm install primeiro.
    exit /b 1
)

REM Verificar se PrimeReact foi instalado
if not exist "node_modules\primereact" (
    echo [ERROR] PrimeReact nao foi instalado corretamente
    exit /b 1
)

echo [INFO] Criando backup dos arquivos originais...
if exist "src\main.jsx" (
    copy "src\main.jsx" "src\main.jsx.bak" >nul
)
if exist "src\App.jsx" (
    copy "src\App.jsx" "src\App.jsx.bak" >nul
)

echo [INFO] Criando main.jsx com PrimeReact...
(
echo import { StrictMode } from 'react'
echo import { createRoot } from 'react-dom/client'
echo import 'primereact/resources/themes/lara-light-cyan/theme.css'
echo import 'primereact/resources/primereact.min.css'
echo import 'primeicons/primeicons.css'
echo import 'primeflex/primeflex.css'
echo import './index.css'
echo import App from './App.jsx'
echo.
echo createRoot^(document.getElementById^('root'^)^).render^(
echo   ^<StrictMode^>
echo     ^<App /^>
echo   ^</StrictMode^>,
echo ^)
) > src\main.jsx

echo [INFO] Criando App.jsx inicial com PrimeReact - Lista de Mercado...
(
echo import React, { useState } from 'react'
echo import { Card } from 'primereact/card'
echo import { Button } from 'primereact/button'
echo import { InputText } from 'primereact/inputtext'
echo import { DataTable } from 'primereact/datatable'
echo import { Column } from 'primereact/column'
echo import { Badge } from 'primereact/badge'
echo import { Toast } from 'primereact/toast'
echo import { useRef } from 'react'
echo import './App.css'
echo.
echo function App^(^) {
echo   const [items, setItems] = useState^([
echo     { id: 1, name: 'Leite', quantity: 2, category: 'Laticínios', completed: false },
echo     { id: 2, name: 'Pão', quantity: 1, category: 'Padaria', completed: false },
echo     { id: 3, name: 'Maçãs', quantity: 6, category: 'Frutas', completed: true }
echo   ]^)
echo   const [newItem, setNewItem] = useState^(''^)
echo   const [newQuantity, setNewQuantity] = useState^(1^)
echo   const toast = useRef^(null^)
echo.
echo   const addItem = ^(^) =^> {
echo     if ^(newItem.trim^(^)^) {
echo       const item = {
echo         id: Date.now^(^),
echo         name: newItem,
echo         quantity: newQuantity,
echo         category: 'Geral',
echo         completed: false
echo       }
echo       setItems^([...items, item]^)
echo       setNewItem^(''^)
echo       setNewQuantity^(1^)
echo       toast.current.show^({ severity: 'success', summary: 'Item Adicionado', detail: newItem }^)
echo     }
echo   }
echo.
echo   const toggleComplete = ^(item^) =^> {
echo     setItems^(items.map^(i =^> 
echo       i.id === item.id ? { ...i, completed: !i.completed } : i
echo     ^)^)
echo   }
echo.
echo   const deleteItem = ^(item^) =^> {
echo     setItems^(items.filter^(i =^> i.id !== item.id^)^)
echo     toast.current.show^({ severity: 'info', summary: 'Item Removido', detail: item.name }^)
echo   }
echo.
echo   const statusBodyTemplate = ^(rowData^) =^> {
echo     return ^<Badge value={rowData.completed ? 'Comprado' : 'Pendente'} 
echo                  severity={rowData.completed ? 'success' : 'warning'}^>^</Badge^>
echo   }
echo.
echo   const actionBodyTemplate = ^(rowData^) =^> {
echo     return ^(
echo       ^<div className="flex gap-2"^>
echo         ^<Button 
echo           icon={rowData.completed ? "pi pi-times" : "pi pi-check"} 
echo           className={rowData.completed ? "p-button-secondary" : "p-button-success"}
echo           onClick={^(^) =^> toggleComplete^(rowData^)}
echo         /^>
echo         ^<Button 
echo           icon="pi pi-trash" 
echo           className="p-button-danger"
echo           onClick={^(^) =^> deleteItem^(rowData^)}
echo         /^>
echo       ^</div^>
echo     ^)
echo   }
echo.
echo   return ^(
echo     ^<div className="min-h-screen bg-gray-50 p-4"^>
echo       ^<Toast ref={toast} /^>
echo       ^<div className="max-w-4xl mx-auto"^>
echo         ^<Card title="🛒 Lista de Mercado" className="mb-4"^>
echo           ^<div className="flex gap-3 mb-4"^>
echo             ^<InputText
echo               value={newItem}
echo               onChange={^(e^) =^> setNewItem^(e.target.value^)}
echo               placeholder="Digite o item..."
echo               className="flex-1"
echo             /^>
echo             ^<InputText
echo               type="number"
echo               value={newQuantity}
echo               onChange={^(e^) =^> setNewQuantity^(parseInt^(e.target.value^) ^|^| 1^)}
echo               placeholder="Qtd"
echo               className="w-20"
echo               min="1"
echo             /^>
echo             ^<Button 
echo               label="Adicionar" 
echo               icon="pi pi-plus"
echo               onClick={addItem}
echo               disabled={!newItem.trim^(^)}
echo             /^>
echo           ^</div^>
echo         ^</Card^>
echo.
echo         ^<Card^>
echo           ^<DataTable value={items} responsiveLayout="scroll"^>
echo             ^<Column field="name" header="Item" sortable^>^</Column^>
echo             ^<Column field="quantity" header="Quantidade" sortable^>^</Column^>
echo             ^<Column field="category" header="Categoria" sortable^>^</Column^>
echo             ^<Column body={statusBodyTemplate} header="Status"^>^</Column^>
echo             ^<Column body={actionBodyTemplate} header="Ações"^>^</Column^>
echo           ^</DataTable^>
echo         ^</Card^>
echo       ^</div^>
echo     ^</div^>
echo   ^)
echo }
echo.
echo export default App
) > src\App.jsx

echo [INFO] Atualizando App.css...
(
echo .p-card {
echo   box-shadow: 0 2px 8px rgba^(0,0,0,0.1^) !important;
echo }
echo.
echo .p-datatable .p-datatable-tbody ^> tr.p-row-odd {
echo   background-color: #f8f9fa;
echo }
echo.
echo .p-badge {
echo   min-width: 80px;
echo }
echo.
echo .bg-gray-50 {
echo   background-color: #f8fafc;
echo }
) > src\App.css

echo [INFO] PrimeReact configurado com sucesso!
