@REM echo Starting Docker containers...
@REM docker-compose up -d

set VENV_DIR=venv
call "%VENV_DIR%/Scripts/activate.bat"

echo Running main.py...
python main.py