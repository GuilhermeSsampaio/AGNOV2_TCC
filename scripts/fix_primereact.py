import argparse
import subprocess
from pathlib import Path

def run(cmd, cwd):
    print(f"[CMD] {' '.join(cmd) if isinstance(cmd, (list, tuple)) else cmd}")
    return subprocess.run(cmd, cwd=str(cwd), shell=True)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--path", "-p", default=r"projects\project_xx\frontend", help="Caminho para o frontend")
    args = p.parse_args()
    project_path = Path(args.path)
    if not project_path.exists():
        print(f"[WARNING] Caminho não encontrado: {project_path} (tentar continuar...)")

    print("[FIX] Executando npm audit fix...")
    run(["npm", "audit", "fix"], project_path)

    print("[FIX] Executando npm dedupe...")
    run(["npm", "dedupe"], project_path)

    print("[FIX] Atualizando DB do browserslist (se disponível)...")
    run(["npx", "browserslist@latest", "--update-db"], project_path)

    print("[FIX] Operações de correção concluídas")

if __name__ == "__main__":
    main()
