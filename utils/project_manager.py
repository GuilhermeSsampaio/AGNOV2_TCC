from pathlib import Path
from utils.timestamp_config import project_timestamp, project_path

def get_current_project_info():
    """
    Retorna informações do projeto atual com timestamp
    """
    return {
        "timestamp": project_timestamp,
        "project_path": project_path,
        "frontend_path": Path(f"{project_path}/frontend"),
        "backend_path": Path(f"{project_path}/backend"),
        "full_frontend_path": Path(project_path) / "frontend",
        "full_backend_path": Path(project_path) / "backend"
    }

def create_project_structure():
    """
    Cria a estrutura básica do projeto
    """
    info = get_current_project_info()
    
    # Criar diretórios
    info["full_frontend_path"].mkdir(parents=True, exist_ok=True)
    info["full_backend_path"].mkdir(parents=True, exist_ok=True)
    
    return info

def get_project_readme_content():
    """
    Gera conteúdo do README para o projeto
    """
    info = get_current_project_info()
    
    return f"""# Projeto {project_timestamp}

Projeto gerado automaticamente em {project_timestamp}

## Estrutura
- Frontend: `{info['frontend_path']}`
- Backend: `{info['backend_path']}`

## Como executar

### Frontend (React + Vite)
```bash
cd {info['frontend_path']}
npm install
npm run dev
```

### Backend
```bash
cd {info['backend_path']}
# Comandos específicos do backend
```

## Gerado por
Agno TCC Agent System
"""
