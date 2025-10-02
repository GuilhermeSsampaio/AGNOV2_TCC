import os
from datetime import datetime

# Database and storage
AGNO_DB_URL = os.getenv("AGNO_DB_URL", "postgresql+psycopg://postgres:root@localhost:5433/tcc")
AGNO_PROJECT_SCHEMA = os.getenv("AGNO_PROJECT_SCHEMA", "frontend")

# Model configuration
# AGNO_GEMINI_ID = os.getenv("AGNO_GEMINI_ID", "gemini-1.5-flash-latest")
AGNO_GEMINI_ID = os.getenv("AGNO_GEMINI_ID", "gemini-2.0-flash")
AGNO_EMBEDDER_ID = os.getenv("AGNO_EMBEDDER_ID", "all-MiniLM-L6-v2")
