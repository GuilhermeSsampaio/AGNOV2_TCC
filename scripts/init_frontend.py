import argparse
import subprocess
from pathlib import Path
import json

def run(cmd, cwd):
    print(f"[CMD] {' '.join(cmd) if isinstance(cmd, (list, tuple)) else cmd}")
    return subprocess.run(cmd, cwd=str(cwd), shell=True)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--path", "-p", default=r"projects\project_xx\frontend", help="Caminho para o frontend")
    args = p.parse_args()
    project_path = Path(args.path)
    if not project_path.exists():
        print(f"[WARNING] Caminho não encontrado: {project_path} (tentar criar/continuar...)")

    print("[INIT] Executando npm install...")
    run(["npm", "install"], project_path)

    # Não executar build aqui - apenas instalar dependências.
    # Se for necessário um build, execute manualmente após validação.
    pkg = project_path / "package.json"
    if pkg.exists():
        try:
            data = json.loads(pkg.read_text(encoding="utf-8"))
            scripts = data.get("scripts", {})
            if "start" in scripts:
                print("[INIT] script 'start' encontrado em package.json (não será executado automaticamente)")
        except Exception as e:
            print(f"[WARNING] Falha lendo package.json: {e}")

    print("[INIT] Inicialização frontend concluída")

if __name__ == "__main__":
    main()
