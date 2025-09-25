import asyncio
from pathlib import Path
from utils.timestamp_config import project_timestamp, project_path
from utils.project_manager import get_current_project_info, create_project_structure, get_project_readme_content
import subprocess
from tools.manage_examples import get_relevant_examples
from agno.os import AgentOS

# Paths usando o project_path do timestamp_config
PROJECT_PATH = Path(project_path) / "frontend"
SCRIPTS_PATH = Path("scripts")

# Importar o front_agent após definir PROJECT_PATH
from agents.front_agent import front_agent

# Criar o AgentOS com o seu front_agent
agent_os = AgentOS(
    os_id="frontend-generator-os",
    description="Sistema de geração de frontend com React e PrimeReact",
    agents=[front_agent],  # Usar o seu agente existente
)

def main(user_input: str):
    print(f"[INFO] Criando projeto com timestamp: {project_timestamp}")
    print(f"[INFO] Caminho do projeto: {project_path}")
    
    # 1. Criar estrutura do projeto
    project_info = create_project_structure()
    print(f"[INFO] Estrutura do projeto criada: {project_info['project_path']}")
    
    # 1.1. Criar README do projeto
    readme_path = Path(project_info['project_path']) / "README.md"
    readme_path.write_text(get_project_readme_content(), encoding='utf-8')
    print(f"[INFO] README criado: {readme_path}")

    # 2. Rodar script para iniciar front-end (CRA ou Vite)
    init_script = SCRIPTS_PATH / "init_frontend.bat"
    try:
        subprocess.run([str(init_script), str(PROJECT_PATH)], check=True, shell=True)
        print("[INFO] Projeto base criado com sucesso.")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Falha ao criar projeto base: {e}")
        return

    # 2.1. Verificar se PrimeReact foi instalado corretamente
    primereact_check = PROJECT_PATH / "node_modules" / "primereact"
    if not primereact_check.exists():
        print("[WARNING] PrimeReact não detectado. Tentando instalar...")
        fix_script = SCRIPTS_PATH / "fix_primereact.bat"
        try:
            subprocess.run([str(fix_script), str(PROJECT_PATH)], check=True, shell=True)
            print("[INFO] PrimeReact instalado com sucesso.")
        except subprocess.CalledProcessError as e:
            print(f"[ERROR] Falha ao instalar PrimeReact: {e}")
            return
    else:
        print("[INFO] PrimeReact detectado e configurado.")

    # 3. Passar o input do usuário para o agente AGNO
    try:
        # Buscar exemplos relevantes baseado no prompt do usuário
        examples = get_relevant_examples(user_input)
        
        examples_text = ""
        if examples:
            examples_text = "\n\nEXEMPLOS DE REFERÊNCIA (use como base para criar componentes similares):\n"
            for i, example in enumerate(examples, 1):
                examples_text += f"\n--- EXEMPLO {i} ---\n{example}\n"
        
        result = front_agent.run(user_input + examples_text)

        if result:
            print("[INFO] Agente AGNO completou a geração do front-end.")
            if hasattr(result, 'output') and result.output:
                print(f"[INFO] Resultado: {result.output}")
            else:
                print("[INFO] Agente executou sem retornar output específico.")
        else:
            print("[WARNING] Resultado vazio do agente.")

    except Exception as e:
        print(f"[ERROR] Erro ao executar front_agent: {e}")
        return

    # 4. Rodar script de lint/prettier (opcional)
    lint_script = SCRIPTS_PATH / "lint_frontend.bat"
    if lint_script.exists():
        try:
            subprocess.run([str(lint_script), str(PROJECT_PATH)], check=True, shell=True)
            print("[INFO] Lint e formatação aplicados com sucesso.")
        except subprocess.CalledProcessError as e:
            print(f"[WARNING] Lint falhou: {e}")
        except FileNotFoundError as e:
            print(f"[WARNING] Script de lint não encontrado: {e}")
    else:
        print("[INFO] Script de lint não encontrado, pulando...")

    # 5. Mensagem final
    print(f"[DONE] Projeto front-end pronto em {PROJECT_PATH}")

# Obter a aplicação do AgentOS
app = agent_os.get_app()

if __name__ == "__main__":
    # Opção 1: Executar via interface web do AgentOS
    agent_os.serve(app="main:app", reload=True, port=7777)
    
    # Opção 2: Executar diretamente (comentado)
    # user_input = input("Descreva o front-end que deseja gerar: ")
    # main(user_input)