import argparse
import json
import logging
import os
import atexit
from pathlib import Path
from threading import Thread, Event
from tasks.parse_task import parse_json_task
from tasks.setup_task import setup_task
from utils.timestamp_config import project_path, project_timestamp
from utils.project_manager import create_project_structure, get_project_readme_content
from utils.copy_boilerplate import clone_boilerplate
from agents.frontend_agent import frontend_agent, frontend_file_tools
from agents.backend_agent import backend_agent, backend_file_tools
import time
import sys
import subprocess

SCRIPTS_DIR = Path("scripts")
PROJECT_DIR = Path(project_path)
LOG_FILE = PROJECT_DIR / f"execucao_{project_timestamp}.txt"
LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

ORIGINAL_STDOUT = sys.stdout
ORIGINAL_STDERR = sys.stderr


class _StreamToLogger:
    def __init__(self, logger: logging.Logger, level: int):
        self.logger = logger
        self.level = level
        self._buffer = ""

    def write(self, message: str) -> int:
        if not message:
            return 0
        self._buffer += message
        while "\n" in self._buffer:
            line, self._buffer = self._buffer.split("\n", 1)
            line = line.rstrip()
            if line:
                self.logger.log(self.level, line)
        return len(message)

    def flush(self) -> None:
        if self._buffer:
            self.logger.log(self.level, self._buffer.rstrip())
            self._buffer = ""

    @property
    def encoding(self) -> str:
        return "utf-8"

from dotenv import load_dotenv

load_dotenv(override=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    force=True,
    handlers=[
        logging.StreamHandler(ORIGINAL_STDOUT),
        logging.FileHandler(LOG_FILE, mode="w", encoding="utf-8"),
    ],
)

root_logger = logging.getLogger()
sys.stdout = _StreamToLogger(root_logger, logging.INFO)
sys.stderr = _StreamToLogger(root_logger, logging.ERROR)
logging.captureWarnings(True)
atexit.register(logging.shutdown)


def _run_npm_install(target: Path) -> None:
    if not target.exists():
        logging.warning("Caminho para npm install nao encontrado: %s", target)
        return

    package_json = target / "package.json"
    if not package_json.exists():
        logging.info("Sem package.json em %s; pulando npm install.", target)
        return

    logging.info("Executando npm install em %s", target)
    try:
        subprocess.run(["npm", "install"], cwd=str(target), check=True)
        logging.info("npm install concluido em %s", target)
    except subprocess.CalledProcessError as exc:
        logging.warning("npm install falhou em %s: %s", target, exc)
    except FileNotFoundError:
        logging.warning("npm nao encontrado no PATH; instale Node.js ou ajuste o ambiente antes de continuar.")

def orchestrator(shared: dict):
    # Analisa a especificação do frontend já extraída e gera um relatório
    # de requisitos técnicos que o backend deverá implementar.
    # O relatório é simples aqui (lista de endpoints + notas), mas pode
    # ser expandido para incluir modelos de dados, tipos/validações, auth, etc.
    logging.info("Orquestrador: analisando frontend spec e gerando relatório para backend...")
    fe = shared.get("frontend_spec", {})
    endpoints = []
    services = fe.get("services", {}).get("endpoints", {})
    for name, spec in services.items():
        endpoints.append({"name": name, "url": spec.get("url"), "method": spec.get("method")})
    report = {"endpoints": endpoints, "notes": "Valide tipos e obrigatoriedade no backend conforme JSON"}
    shared["orchestrator_report"] = report
    logging.info("Orquestrador gerou relatório.")

def run_agents(shared: dict):
    # Sequência principal de agentes (executados **após** parsing e setup).
    # Ordem: Frontend -> Orquestrador (local) -> Backend.

    # 1) Agente Frontend
    # Fornece ao agente frontend a parte do JSON específica para UI/UX e templates
    # (essa informação vem do `shared` preenchido pela task de parsing).
    logging.info("Executando agente frontend...")
    frontend_prompt = "Gere o frontend do projeto seguindo suas diretrizes de trabalho, conforme JSON: " + json.dumps(shared.get("frontend_spec", {}))
    try:
        frontend_agent.run(frontend_prompt)
    except Exception as e:
        logging.warning("frontend_agent.run falhou: %s", e)
    finally:
        try:
            frontend_ops = frontend_file_tools.drain()
            if frontend_ops:
                result = frontend_file_tools.apply(frontend_ops)
            else:
                result = "Nenhuma alteração para aplicar."
            logging.info("Frontend buffer: %s", result)
        except Exception as flush_error:
            logging.warning("Falha ao aplicar buffer do frontend: %s", flush_error)

    # 2) Orquestrador (local)
    # Agente local que inspeciona o resultado do frontend (ou sua spec)
    # e converte em instruções claras para o backend.
    orchestrator(shared)

    # Aguarda um delay entre a geração do frontend e a geração do backend.
    # Alguns recursos externos (APIs, instalações) podem exigir tempo para
    # estabilizar; adicionamos um delay para reduzir possibilidade de erros
    # por taxa/limitação/consumo rápido de quota.
    delay_env = os.getenv("BACKEND_DELAY_SECONDS")
    try:
        delay_seconds = int(delay_env) if delay_env is not None else 160
    except ValueError:
        delay_seconds = 160
        logging.warning(
            "Valor invalido para BACKEND_DELAY_SECONDS: %s. Usando delay padrao de %s s.",
            delay_env,
            delay_seconds,
        )

    logging.info("Aguardando %s segundos antes de iniciar o backend...", delay_seconds)
    time.sleep(max(delay_seconds, 0))

    # 3) Backend agent
    # O agente backend recebe tanto o `backend_spec` original quanto o
    # `orchestrator_report` (o que o frontend exige). Com isso ele gera
    # endpoints, modelos e lógica do servidor.
    logging.info("Executando agente backend...")
    backend_prompt = "Gerar o backend do projeto seguindo suas diretrizes de trabalho, com base no relatório e no JSON: " + json.dumps({
        "report": shared.get("orchestrator_report"),
        "backend_spec": shared.get("backend_spec", {})
    })
    try:
        backend_agent.run(backend_prompt)
    except Exception as e:
        logging.warning("backend_agent.run falhou: %s", e)
    finally:
        try:
            backend_ops = backend_file_tools.drain()
            if backend_ops:
                result = backend_file_tools.apply(backend_ops)
            else:
                result = "Nenhuma alteração para aplicar."
            logging.info("Backend buffer: %s", result)
        except Exception as flush_error:
            logging.warning("Falha ao aplicar buffer do backend: %s", flush_error)

def main():
    parser = argparse.ArgumentParser()
    # tornar opcional: se o usuário não passar --input, usamos o arquivo default
    parser.add_argument("--input", "-i", required=False, default="json/json2.json", help="JSON de especificacao (ex: json/json2.json)")
    args = parser.parse_args()
    input_path = Path(args.input)
    if not input_path.exists():
        logging.error("Arquivo de entrada nao encontrado: %s", input_path)
        return

    # `shared` é o canal de comunicação entre as threads/tasks e os agentes.
    # As duas tasks abaixo rodam em paralelo para acelerar o processo:
    # - parsing (extrai frontend/backend specs do JSON)
    # - setup (cria pastas, copia boilerplate, instala dependências)
    # Cada task dispara um Event quando termina; aqui o main espera ambos
    # os Events antes de seguir para os agentes.
    shared = {}
    p_ready = Event()  # sinaliza que o parsing terminou
    s_ready = Event()  # sinaliza que o setup terminou

    # Criar e iniciar threads como daemon — elas não bloquearão o encerramento
    # do processo caso o main termine inesperadamente; o comportamento
    # normal é aguardar pelos eventos explicitamente abaixo.
    t_parse = Thread(target=parse_json_task, args=(input_path, p_ready, shared), daemon=True)
    t_setup = Thread(target=setup_task, args=(s_ready, shared), daemon=True)
    t_parse.start()
    t_setup.start()

    # Sincronização: aguardar explicitamente até que ambas as tasks
    # chamem .set() em seus respectivos Events. Sem timeout aqui —
    # para runs automáticas você pode querer adicionar um timeout e
    # tratamento de falha caso uma task trave.
    p_ready.wait()
    s_ready.wait()

    run_agents(shared)

    # Finalização: escrever README e informar onde o projeto foi gerado.
    # `project_info` é preenchido pela task de setup e deve conter o caminho
    # do projeto (`project_path` ou chaves equivalentes definidas pelo util).
    info = shared.get("project_info")
    if info:
        readme = Path(info["project_path"]) / "README.md"
        readme.write_text(get_project_readme_content(), encoding="utf-8")

        frontend_path = Path(info.get("full_frontend_path", ""))
        backend_path = Path(info.get("full_backend_path", ""))

        _run_npm_install(frontend_path)
        _run_npm_install(backend_path)

        run_script = Path("scripts") / "run_project.py"
        if run_script.exists():
            try:
                cmd = [
                    sys.executable,
                    str(run_script),
                    "--frontend",
                    str(frontend_path),
                    "--backend",
                    str(backend_path),
                ]
                logging.info("Iniciando run_project.py para subir frontend e backend...")
                subprocess.Popen(cmd)
            except Exception as e:
                logging.warning("Falha ao iniciar run_project: %s", e)
    logging.info("Fluxo completo. Projeto em %s", info["project_path"] if info else project_path)

if __name__ == "__main__":
    start = time.time()
    main()
    logging.info("Tempo total: %.2fs", time.time() - start)
