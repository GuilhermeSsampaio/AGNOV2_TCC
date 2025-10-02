from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.file import FileTools
from agno.tools.reasoning import ReasoningTools
from pathlib import Path
from .backend_instructions import backend_instructions
from utils.timestamp_config import project_timestamp, project_path
# from .local_model_config import local_model
# from database.manage_context import context_base
# Define o caminho do projeto usando timestamp
PROJECT_PATH = Path(f"{project_path}/backend")
file_tools = FileTools(base_dir=Path(f"{PROJECT_PATH}"))

# Inicializa o modelo Gemini
gemini_model = Gemini("gemini-2.0-flash")

# Criação do agente
backend_agent = Agent(
    name="BackEndAgent",
    model=gemini_model,
    # knowledge= context_base,
    # search_knowledge=True,
    # model = local_model,
    instructions=backend_instructions,
    tools=[file_tools, ReasoningTools()]
)


