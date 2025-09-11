import os
from agno.knowledge.knowledge import Knowledge
from agno.knowledge.reader.markdown_reader import MarkdownReader
from agno.vectordb.pgvector import PgVector  # Mudança para PGVector
from agno.knowledge.embedder.sentence_transformer import SentenceTransformerEmbedder
from utils.config import AGNO_EMBEDDER_ID

print("--- Iniciando script de carregamento da base de conhecimento ---")

CONTEXT_FILE_PATH = "database/frontend_context.md"
print(f"Tentando carregar o arquivo de contexto de: '{os.path.abspath(CONTEXT_FILE_PATH)}'")

if not os.path.exists(CONTEXT_FILE_PATH):
    print(f"\nERRO CRÍTICO: O arquivo '{CONTEXT_FILE_PATH}' não foi encontrado.")
    exit()

print("Inicializando o embedder de sentenças...")
embedder = SentenceTransformerEmbedder(id=AGNO_EMBEDDER_ID)
print("Embedder inicializado com sucesso.")

# Usar PGVector em vez de Qdrant
try:
    knowledge = Knowledge(
        vector_db=PgVector(
            table_name="context_front",  # Usar table_name em vez de collection
            db_url="postgresql+psycopg2://postgres:root@localhost:5433/tcc?client_encoding=utf8",
            embedder=embedder,
        ),
    )
    
    print("\nIniciando o processo de carregamento...")
    
    knowledge.add_content(
        path=CONTEXT_FILE_PATH,
        reader=MarkdownReader(),
        name="Frontend Context",
        description="Contexto do frontend da aplicação"
    )
    
    print("\n✅ Knowledge base carregada com sucesso!")
    context_base = knowledge
    
except Exception as e:
    print(f"\n❌ Erro ao carregar knowledge base: {e}")
    print("Usando versão simplificada...")
    
    
    # Fallback: carregar como texto simples
    try:
        with open(CONTEXT_FILE_PATH, 'r', encoding='utf-8') as f:
            context_content = f.read()
        context_base = context_content
        print("✅ Context carregado como texto simples!")
    except Exception as e2:
        print(f"❌ Erro no fallback: {e2}")
        context_base = ""