from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.file import FileTools
from pathlib import Path
from .instructions import front_instructions
from utils.timestamp_config import project_timestamp, project_path

# Define o caminho do projeto usando timestamp
PROJECT_PATH = Path(f"{project_path}/frontend")
file_tools = FileTools(base_dir=Path("."))

# Inicializa o modelo Gemini
gemini_model = Gemini("gemini-2.0-flash")

# Criação do agente
front_agent = Agent(
    name="FrontEndAgent",
    model=gemini_model,
    instructions=front_instructions,
    tools=[file_tools]
)


