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

    node_modules = project_path / "node_modules"
    if not node_modules.exists():
        print("[WARNING] node_modules não encontrado. Executando npm install...")
        run(["npm", "install"], project_path)

    print("[LINT] Executando ESLint...")
    res = run(["npm", "run", "lint"], project_path)
    if res.returncode != 0:
        print("[WARNING] ESLint não configurado ou falhou")

    print("[LINT] Verificando Prettier...")
    res = run(["npx", "prettier", "--version"], project_path)
    if res.returncode == 0:
        print("[LINT] Executando Prettier...")
        run(f'npx prettier --write "src/**/*.+(js|jsx|ts|tsx|css|html)"', project_path)
    else:
        print("[WARNING] Prettier não está instalado")

    print("[LINT] Lint e formatação concluídos")

if __name__ == "__main__":
    main()
