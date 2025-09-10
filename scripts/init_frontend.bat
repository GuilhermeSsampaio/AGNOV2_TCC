@echo off
REM Inicializa projeto React + Vite e instala PrimeReact
cd projects\project_xx\frontend
npx create-vite . --template react --yes
npm install
npm install primereact primeicons --yes
