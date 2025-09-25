# utils/copy_boilerplate.py
from pathlib import Path
import shutil

def clone_boilerplate(project_path: Path, boilerplate_path: Path = Path("boilerplate")):
    """
    Clona o boilerplate (projeto base) para o novo projeto, ignorando a pasta node_modules.
    """
    if not boilerplate_path.exists():
        raise FileNotFoundError(f"Boilerplate não encontrado em: {boilerplate_path}")

    def ignore_node_modules(directory, contents):
        if Path(directory).name == "node_modules":
            return contents
        return []

    print("Clonando boilerplate...")
    shutil.copytree(boilerplate_path, project_path, dirs_exist_ok=True, ignore=ignore_node_modules)

    return {
        "success": True,
        "cloned_from": str(boilerplate_path),
        "destination": str(project_path)
    }
