@echo off
set VENV_DIR=venv

:: Check if the virtual environment folder exists
if not exist "%VENV_DIR%" (
    echo Virtual environment not found. Creating...
    python -m venv %VENV_DIR%
    echo Activating virtual environment and installing dependencies...
    call "%VENV_DIR%/Scripts/activate.bat"
    pip install -r requirements.txt
) else (
    echo Virtual environment found. Activating...
    call "%VENV_DIR%/Scripts/activate.bat"
    pip install -r requirements.txt

)

:: Run the main script
@REM echo Building Docker containers...
@REM docker-compose build

@REM echo Starting Docker containers...
@REM docker-compose up -d

echo Running main.py...
python main.py