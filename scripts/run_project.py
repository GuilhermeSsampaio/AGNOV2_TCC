import argparse
import subprocess
from pathlib import Path
import shlex

def open_powershell_and_run(cwd: Path, command: str):
    """Open a new PowerShell window and run the given command in it."""
    # Use Start-Process to open a new window
    ps_command = f"Start-Process powershell -ArgumentList '-NoExit','-Command',{shlex.quote(command)} -WorkingDirectory {shlex.quote(str(cwd))}"
    return subprocess.Popen(["powershell", "-Command", ps_command], shell=True)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--frontend", help="Caminho para a pasta do frontend")
    p.add_argument("--backend", help="Caminho para a pasta do backend")
    args = p.parse_args()

    if not args.frontend and not args.backend:
        print("Forneça pelo menos --frontend ou --backend")
        return

    procs = []
    if args.frontend:
        fe = Path(args.frontend)
        if fe.exists():
            cmd_fe = "npm start"
            print(f"Abrindo PowerShell para frontend em {fe} -> {cmd_fe}")
            procs.append(open_powershell_and_run(fe, cmd_fe))
        else:
            print(f"Frontend path não encontrado: {fe}")

    if args.backend:
        be = Path(args.backend)
        if be.exists():
            cmd_be = "npm run server" if (be / "package.json").exists() else ""
            # fallback to 'npm start' if dev not present - do not execute automatically if empty
            if not cmd_be:
                cmd_be = "npm start"
            print(f"Abrindo PowerShell para backend em {be} -> {cmd_be}")
            procs.append(open_powershell_and_run(be, cmd_be))
        else:
            print(f"Backend path não encontrado: {be}")

    # Não aguardar processos aqui (eles permanecem abertos em novas janelas)

if __name__ == "__main__":
    main()
