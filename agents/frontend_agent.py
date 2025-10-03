from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.reasoning import ReasoningTools
from pathlib import Path
from .frontend_instructions import frontend_instructions
from utils.timestamp_config import project_timestamp, project_path
from utils.buffered_file_tools import BufferedFileTools
# from .local_model_config import local_model
# from database.manage_context import context_base
# Define o caminho do projeto usando timestamp
PROJECT_PATH = Path(f"{project_path}/frontend")
frontend_file_tools = BufferedFileTools(base_dir=PROJECT_PATH)

# Inicializa o modelo Gemini
gemini_model = Gemini("gemini-2.0-flash")

# Criação do agente
frontend_agent = Agent(
    name="FrontEndAgent",
    model=gemini_model,
    # knowledge= context_base,
    # search_knowledge=True,
    # model = local_model,
    instructions=frontend_instructions,
    tools=[frontend_file_tools, ReasoningTools()]
)


