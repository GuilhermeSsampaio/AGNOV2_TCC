import logging
import subprocess
import sys
from pathlib import Path
from threading import Event
from utils.project_manager import create_project_structure
from utils.copy_boilerplate import clone_boilerplate

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

SCRIPTS_DIR = Path("scripts")


def _run_script(script_path: Path, target_path: str):
    """Execute a Python script with the current Python interpreter passing --path."""
    try:
        cmd = [sys.executable, str(script_path), "--path", str(target_path)]
        logging.info("Executando script: %s", " ".join(cmd))
        subprocess.run(cmd, check=True)
    except Exception as e:
        logging.warning("Falha ao executar %s: %s", script_path, e)


def setup_task(ready_event: Event, shared: dict):
    logging.info("Criando estrutura de projeto e copiando boilerplate (task module)...")
    info = create_project_structure()
    shared["project_info"] = info
    # clone boilerplate para frontend/backend (se existir)
    try:
        # usar o diretório real 'boilerplates/frontend'
        clone_boilerplate(Path(info["full_frontend_path"]), boilerplate_path=Path("boilerplates/frontend"))
    except Exception:
        logging.info("No frontend boilerplate or already copied, continuando...")
    try:
        clone_boilerplate(Path(info["full_backend_path"]), boilerplate_path=Path("boilerplates/backend"))
    except Exception:
        logging.info("No backend boilerplate or already copied, continuando...")

    # opcional: rodar scripts de init Python
    init_front = SCRIPTS_DIR / "init_frontend.py"
    if init_front.exists():
        _run_script(init_front, info["full_frontend_path"])
    init_back = SCRIPTS_DIR / "init_backend.py"
    if init_back.exists():
        _run_script(init_back, info["full_backend_path"])

    ready_event.set()
    logging.info("Setup concluído (task module).")
