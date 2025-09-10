import asyncio
from pathlib import Path
from agents.front_agent import front_agent
# from agents.front_agent import generate_frontend
import subprocess

# Paths
PROJECT_NAME = "project_xx"
PROJECT_PATH = Path("projects") / PROJECT_NAME / "frontend"
SCRIPTS_PATH = Path("scripts")

def main(user_input: str):
    # 1. Criar pasta do projeto se não existir
    PROJECT_PATH.mkdir(parents=True, exist_ok=True)
    print(f"[INFO] Pasta do projeto criada: {PROJECT_PATH}")

    # 2. Rodar script para iniciar front-end (CRA ou Vite)
    init_script = SCRIPTS_PATH / "init_frontend.bat"
    try:
        subprocess.run(str(init_script), check=True)
        print("[INFO] Projeto base criado com sucesso.")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Falha ao criar projeto base: {e}")
        return

    # 3. Passar o input do usuário para o agente AGNO
    try:
        instruction = f"""
        Você é um agente que gera componentes React dentro do projeto.
        Crie arquivos JSX/TSX conforme necessário na pasta: {PROJECT_PATH}/src/components
        E edite os arquivos necessários em {PROJECT_PATH}
        Prompt do usuário: {user_input}
        Use FileTools apenas para criar/escrever arquivos dentro do projeto.
        Retorne sucesso ou erros no final.
        """
        
        result = front_agent.run(instruction)

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
            subprocess.run(str(lint_script), check=True, shell=True)
            print("[INFO] Lint e formatação aplicados com sucesso.")
        except subprocess.CalledProcessError as e:
            print(f"[WARNING] Lint falhou: {e}")
        except FileNotFoundError as e:
            print(f"[WARNING] Script de lint não encontrado: {e}")
    else:
        print("[INFO] Script de lint não encontrado, pulando...")

    # 5. Mensagem final
    print(f"[DONE] Projeto front-end pronto em {PROJECT_PATH}")


if __name__ == "__main__":
    user_input = input("Descreva o front-end que deseja gerar: ")
    main(user_input)
