import asyncio
from pathlib import Path
from utils.copy_boilerplate import clone_boilerplate
from utils.timestamp_config import project_timestamp, project_path
from utils.project_manager import (
    get_current_project_info,
    create_project_structure,
    get_project_readme_content
)
import subprocess
from dotenv import load_dotenv

load_dotenv()

# Paths usando o project_path do timestamp_config
PROJECT_PATH = Path(project_path) / "backend"

# Importar o backend_agent após definir PROJECT_PATH
from agents.backend_agent import backend_agent
import time


def main(user_input: str):
    print(f"[INFO] Criando projeto backend com timestamp: {project_timestamp}")
    print(f"[INFO] Caminho do projeto: {project_path}")
    
    # 1. Criar estrutura do projeto
    project_info = create_project_structure()
    print(f"[INFO] Estrutura do projeto criada: {project_info['project_path']}")
    
    # 1.1. Criar README do projeto
    readme_path = Path(project_info['project_path']) / "README.md"
    readme_path.write_text(get_project_readme_content(), encoding='utf-8')
    print(f"[INFO] README criado: {readme_path}")

    # 2. Clonar boilerplate backend (a função já ignora node_modules)
    try:
        result = clone_boilerplate(
            PROJECT_PATH, 
            boilerplate_path=Path("./backend_boilerplate")
        )
        print(f"[INFO] Boilerplate backend copiado para: {result['destination']}")
        print(f"[INFO] node_modules foi automaticamente ignorado durante a cópia")
    except Exception as e:
        print(f"[ERROR] Falha ao copiar boilerplate backend: {e}")
        return

    # 3. Instalar dependências do Node.js
    print("[INFO] Instalando dependências do backend...")
    try:
        # Navegar para o diretório do projeto e instalar dependências
        subprocess.run(["npm", "install"], cwd=str(PROJECT_PATH), check=True, shell=True)
        print("[INFO] Dependências instaladas com sucesso.")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Falha ao instalar dependências: {e}")
        return
    except FileNotFoundError:
        print("[ERROR] npm não encontrado. Certifique-se de que o Node.js está instalado.")
        return

    # 3.1. Verificar se dependências foram instaladas corretamente
    dependencies_check = PROJECT_PATH / "node_modules"
    if dependencies_check.exists():
        print("[INFO] Dependências detectadas e configuradas.")
    else:
        print("[WARNING] node_modules não foi criado. Verificando configuração...")
        return

    # 4. Passar o input do usuário para o agente AGNO Backend
    try:
        result = backend_agent.run(user_input)
        if result:
            print("[INFO] Agente AGNO Backend completou a geração do back-end.")
            if hasattr(result, 'output') and result.output:
                print(f"[INFO] Resultado: {result.output}")
            else:
                print("[INFO] Agente executou sem retornar output específico.")
        else:
            print("[WARNING] Resultado vazio do agente.")
    except Exception as e:
        print(f"[ERROR] Erro ao executar backend_agent: {e}")
        return

    # 5. Mensagem final
    print(f"[DONE] Projeto back-end pronto em {PROJECT_PATH}")


if __name__ == "__main__":
    start_time = time.time()
    # user_input = input("Descreva o back-end que deseja gerar: ")
    user_input = "API para cadastrar peças musicais e maestros, maestros cadastram peças musicais, o app deve ter endpoints para CRUD de maestros e peças"
    main(user_input)
    end_time = time.time()  # Fim da medição
    print(f"[INFO] Tempo total de execução: {end_time - start_time:.2f} segundos")