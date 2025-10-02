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

    print("[SETUP] Instalando PrimeReact e dependências (primereact, primeicons)...")
    run(["npm", "install", "primereact", "primeicons", "--save"], project_path)

    print("[SETUP] Instalando peer-deps (se necessário)... (npm install pode cuidar disso)")
    print("[SETUP] Setup PrimeReact concluído")

if __name__ == "__main__":
    main()
