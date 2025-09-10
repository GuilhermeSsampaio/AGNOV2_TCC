from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.file import FileTools
from pathlib import Path

# Define o caminho do projeto (caminho relativo à raiz do workspace)
PROJECT_PATH = Path("projects/project_xx/frontend")
file_tools=FileTools(base_dir=Path("."))

# Inicializa o modelo Gemini
gemini_model = Gemini("gemini-2.0-flash")

# Criação do agente
front_agent = Agent(
    name="FrontEndAgent",
    model=gemini_model,
    instructions=[
        "Você é um agente que gera componentes React dentro do projeto.",
        "Crie arquivos JSX/TSX conforme necessário na pasta: projects/project_xx/frontend/src/components",
        "Edite os arquivos necessários em projects/project_xx/frontend/",
        "Use FileTools apenas para criar/escrever arquivos dentro do projeto.",
        "IMPORTANTE: Use sempre caminhos relativos começando com 'projects/project_xx/frontend/'",
        "Retorne sucess ou error no final."
    ],
    tools=[file_tools]
)

# def generate_frontend(prompt: str, project_path: str):
#     """
#     Gera front-end usando AGNO FrontAgent + Gemini.
#     """
#     instruction = f"""
# Você é um agente que gera componentes React dentro do projeto.
# Crie arquivos JSX/TSX conforme necessário na pasta: {project_path}/src/components
# E edite os arquivo necessários em {project_path}
# Prompt do usuário: {prompt}
# Use FileTools apenas para criar/escrever arquivos dentro do projeto.
# Retorne sucesso ou erros no final.
# """
#     try:
#         # AGNO run não precisa de await
#         result = front_agent.run(instruction)


#         return {"success": True, "result": result.output}

#     except Exception as e:
#         return {"success": False, "errors": str(e)}
