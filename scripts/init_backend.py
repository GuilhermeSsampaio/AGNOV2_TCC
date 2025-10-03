import argparse
import subprocess
from pathlib import Path
import json

def run(cmd, cwd):
    print(f"[CMD] {' '.join(cmd) if isinstance(cmd, (list, tuple)) else cmd}")
    return subprocess.run(cmd, cwd=str(cwd), shell=True)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--path", "-p", default=r"projects\project_xx\backend", help="Caminho para o backend")
    args = p.parse_args()
    project_path = Path(args.path)
    if not project_path.exists():
        print(f"[WARNING] Caminho não encontrado: {project_path} (tentar criar/continuar...)")

    # print("[INIT] Executando npm install (backend)...")
    # run(["npm", "install"], project_path)

    # Não executar build/start aqui - apenas instalar dependências.
    pkg = project_path / "package.json"
    if pkg.exists():
        try:
            data = json.loads(pkg.read_text(encoding="utf-8"))
            scripts = data.get("scripts", {})
            if scripts:
                print("[INIT] package.json contém scripts, mas nenhum será executado automaticamente.")
        except Exception as e:
            print(f"[WARNING] Falha lendo package.json: {e}")

    print("[INIT] Inicialização backend concluída")

if __name__ == "__main__":
    main()
