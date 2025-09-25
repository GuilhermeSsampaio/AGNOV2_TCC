from pathlib import Path
import shutil

def copy_standard_libs(project_path: Path, libs_path: Path = Path("libs")):
    """
    Copia os utilitários padrão (libs) para um projeto React
    
    Args:
        project_path: Caminho do projeto de destino
        libs_path: Caminho da pasta libs (padrão: "libs")
    """
    print("Copiando libs...")
    libs_src = libs_path / "src"
    
    if not libs_src.exists():
        raise FileNotFoundError(f"Pasta libs não encontrada em: {libs_src}")
    
    # Mapeamento detalhado de pastas
    folder_mappings = {
        "utilitários": "src/utilitários",
        "componentes": "src/componentes", 
        "contextos": "src/contextos",
        "serviços": "src/serviços",
        "páginas": "src/páginas",
        "rotas": "src/rotas",
        "imagens": "src/assets/imagens",
        "modais": "src/components/modais"  # Para componentes/modais
    }
    
    copied_files = []
    
    try:
        # Copiar estrutura de pastas
        for source_folder, dest_folder in folder_mappings.items():
            source_path = libs_src / source_folder
            dest_path = project_path / dest_folder
            
            if source_path.exists():
                dest_path.mkdir(parents=True, exist_ok=True)
                
                for file_path in source_path.rglob("*"):
                    if file_path.is_file() and not file_path.name.startswith('.'):
                        relative_path = file_path.relative_to(source_path)
                        dest_file_path = dest_path / relative_path
                        
                        dest_file_path.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(file_path, dest_file_path)
                        copied_files.append(f"{dest_folder}/{relative_path}")
        
        # Copiar arquivos raiz
        root_files = ["global.css", "index.js"]
        for file_name in root_files:
            source_file = libs_src / file_name
            if source_file.exists():
                dest_file = project_path / "src" / file_name
                shutil.copy2(source_file, dest_file)
                copied_files.append(f"src/{file_name}")
        
        # Copiar configs
        config_files = [".env.example", ".env"]
        for file_name in config_files:
            source_file = libs_path / file_name
            if source_file.exists():
                dest_file = project_path / file_name
                shutil.copy2(source_file, dest_file)
                copied_files.append(file_name)
        
        # Copiar public/index.html se existir
        public_source = libs_path / "public"
        if public_source.exists():
            public_dest = project_path / "public"
            for file_path in public_source.rglob("*"):
                if file_path.is_file():
                    relative_path = file_path.relative_to(public_source)
                    dest_file = public_dest / relative_path
                    dest_file.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(file_path, dest_file)
                    copied_files.append(f"public/{relative_path}")
        
        return {
            "success": True,
            "copied_files": copied_files,
            "total_files": len(copied_files)
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "copied_files": copied_files
        }

def update_project_structure_for_libs(project_path: Path):
    """
    Atualiza a estrutura do projeto para integrar as libs copiadas
    """
    
    # Criar package.json personalizado se necessário
    package_json_additions = {
        "dependencies": {
            "primereact": "^10.0.0",
            "primeicons": "^6.0.0", 
            "primeflex": "^3.3.0",
            "react-router-dom": "^6.0.0"
        }
    }
    
    return package_json_additions

def copy_utils(project_path: Path, libs_path: Path = Path("libs")):
    """
    Copia apenas a pasta utilitários para a pasta utils no projeto de destino.
    
    Args:
        project_path: Caminho do projeto de destino
        libs_path: Caminho da pasta libs (padrão: "libs")
    """
    print("Copiando utilitários para utils...")
    libs_src = libs_path / "src" / "utilitários"
    utils_dest = project_path / "src" / "utils"
    
    if not libs_src.exists():
        raise FileNotFoundError(f"Pasta utilitários não encontrada em: {libs_src}")
    
    copied_files = []
    
    try:
        utils_dest.mkdir(parents=True, exist_ok=True)
        
        for file_path in libs_src.rglob("*"):
            if file_path.is_file() and not file_path.name.startswith('.'):
                relative_path = file_path.relative_to(libs_src)
                dest_file_path = utils_dest / relative_path
                
                dest_file_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(file_path, dest_file_path)
                copied_files.append(f"utils/{relative_path}")
        
        return {
            "success": True,
            "copied_files": copied_files,
            "total_files": len(copied_files)
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "copied_files": copied_files
        }

if __name__ == "__main__":
    test_project = Path("test_project")
    result = copy_utils(test_project)
    print(result)
    # Teste
    test_project = Path("test_project")
    result = copy_standard_libs(test_project)
    print(result)