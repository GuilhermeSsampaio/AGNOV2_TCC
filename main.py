import asyncio
from pathlib import Path
from utils.timestamp_config import project_timestamp, project_path
from utils.project_manager import get_current_project_info, create_project_structure, get_project_readme_content
# from agents.front_agent import generate_frontend
import subprocess

# Paths usando o project_path do timestamp_config
PROJECT_PATH = Path(project_path) / "frontend"
SCRIPTS_PATH = Path("scripts")

# Importar o front_agent após definir PROJECT_PATH
from agents.front_agent import front_agent

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
        from agents.front_agent import get_relevant_examples
        examples = get_relevant_examples(user_input)
        
        examples_text = ""
        if examples:
            examples_text = "\n\nEXEMPLOS DE REFERÊNCIA (use como base para criar componentes similares):\n"
            for i, example in enumerate(examples, 1):
                examples_text += f"\n--- EXEMPLO {i} ---\n{example}\n"
        
        instruction = f"""
        Você é um agente que gera componentes React BONITOS usando PrimeReact.
        
        PROMPT DO USUÁRIO: {user_input}
        
        INSTRUÇÕES:
        1. Crie componentes JSX/TSX na pasta: {PROJECT_PATH}/src/components
        2. Edite o App.jsx para integrar os componentes criados
        3. Use SEMPRE componentes PrimeReact para interfaces modernas
        4. Siga os padrões dos exemplos abaixo para criar código de qualidade
        5. Use PrimeFlex para layout responsivo (grid, flex, etc.)
        6. Adicione ícones com PrimeIcons (pi pi-*)
        7. Use Cards para organização visual
        
        {examples_text}
        
        EXEMPLO BASE - LISTA DE MERCADO:
        O projeto já vem com um exemplo de lista de mercado funcional no App.jsx.
        Use esse padrão como base e adapte para o que o usuário pediu.
        
        COMPONENTES PRIMEREACT MAIS USADOS:
        - Card: para agrupar conteúdo
        - DataTable + Column: para listas e tabelas
        - Button: botões com ícones
        - InputText: campos de entrada
        - Dropdown: seleção de opções
        - Badge: status e indicadores
        - Toast: notificações
        
        IMPORTANTE: 
        - Crie componentes visualmente atraentes
        - Use os exemplos como referência de boas práticas
        - Aplique layout responsivo com PrimeFlex
        - Mantenha a funcionalidade da lista de mercado como base
        - Retorne sucesso ou erros no final
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


if __name__ == "__main__":
    user_input = input("Descreva o front-end que deseja gerar: ")
    main(user_input)
