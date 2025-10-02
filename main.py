import argparse
import json
import logging
from pathlib import Path
from threading import Thread, Event
from tasks.parse_task import parse_json_task
from tasks.setup_task import setup_task
from utils.timestamp_config import project_path
from utils.project_manager import create_project_structure, get_project_readme_content
from utils.copy_boilerplate import clone_boilerplate
from agents.frontend_agent import frontend_agent
from agents.backend_agent import backend_agent
import time
import sys
import subprocess

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

SCRIPTS_DIR = Path("scripts")

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

    # 2) Orquestrador (local)
    # Agente local que inspeciona o resultado do frontend (ou sua spec)
    # e converte em instruções claras para o backend.
    orchestrator(shared)

    # Aguarda um delay entre a geração do frontend e a geração do backend.
    # Alguns recursos externos (APIs, instalações) podem exigir tempo para
    # estabilizar; adicionamos um delay para reduzir possibilidade de erros
    # por taxa/limitação/consumo rápido de quota.
    DELAY_SECONDS = 60
    logging.info("Aguardando %s segundos antes de iniciar o backend...", DELAY_SECONDS)
    time.sleep(DELAY_SECONDS)

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
        # Após gerar o projeto e o README, iniciar automaticamente o projeto
        # em novos terminais (frontend e backend). Usamos o script
        # scripts/run_project.py com o interpretador atual.
        run_script = Path("scripts") / "run_project.py"
        if run_script.exists():
            try:
                fe = info.get("full_frontend_path")
                be = info.get("full_backend_path")
                cmd = [sys.executable, str(run_script), "--frontend", str(fe), "--backend", str(be)]
                logging.info("Iniciando run_project.py para abrir terminais de front/back...")
                subprocess.Popen(cmd)
            except Exception as e:
                logging.warning("Falha ao iniciar run_project: %s", e)
    logging.info("Fluxo completo. Projeto em %s", info["project_path"] if info else project_path)

if __name__ == "__main__":
    start = time.time()
    main()
    logging.info("Tempo total: %.2fs", time.time() - start)
