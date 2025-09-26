# Fluxo de Geração do Projeto

## Passos para Geração do Projeto

| **Elemento**    | **Descrição**                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **scripts**     | Automações para reduzir o uso da IA.                                                                               |
| **boilerplate** | Esqueleto do projeto com as bibliotecas que serão usadas e os componentes básicos, sem nada específico.            |
| **JSON**        | Mapeamento do aplicativo do usuário para o gerador, com os parâmetros que devem ser atendidos pelo projeto gerado. |
| **agente IA**   | Analisa o JSON e gera o projeto desejado utilizando o boilerplate apenas como base.                                |

1. **Criar Estrutura de Diretórios**  
   Utilizar Python para criar a estrutura de diretórios necessária para o projeto.

2. **Configurar o Frontend**

   - Executar um script `.bat` para configurar o projeto frontend.
   - Verificar e instalar dependências necessárias utilizando o script `.bat`.

3. **Clonar o Boilerplate**  
   Utilizar Python para clonar o boilerplate e colocá-lo na pasta do projeto.

4. **Obter Input do Usuário e Enviar para o Agente de IA**

   - O agente de IA (Agno e Gemini) deve receber as instruções para gerar o projeto.
   - **Observação:** As instruções para o agente devem garantir:
     - Uso dos componentes já criados.
     - Organização consistente da estrutura.
     - Funcionalidades variadas.
     - Minimização do uso de IA para evitar limitações de planos gratuitos.

5. **Finalizar e Informar Sucesso**  
   Retornar uma mensagem informando que o projeto foi gerado com sucesso.

---

## Fluxo de Entrada e Processamento

```plaintext
entrada (json: layout, tema, serviços -> em qual evento são chamados, componentes, validação, navegação, paginas, campos de forms, libs usadas) -> agente {
    IA integra frontend e backend nessa parte, alinhando o que deve ser implementado:
    - frontend -> interface
    - backend -> interface
}

entrada -> json
scripts -> IA (entrada -> front) -> projeto gerado
scripts -> IA (entrada -> back) -> projeto gerado

instruções -> padrões de criptografia, bibliotecas como o uso de prime react, TypeORM, e similares.
```

exemplo de json:

```json
{
  "layout": {
    "header": {
      "title": "Sistema de Cadastro de Peças Musicais",
      "logo": "logo.png",
      "menu": ["Dashboard", "Maestros", "Peças Musicais", "Configurações"]
    },
    "sidebar": {
      "items": [
        { "label": "Dashboard", "icon": "pi pi-home", "route": "/dashboard" },
        { "label": "Maestros", "icon": "pi pi-users", "route": "/maestros" },
        { "label": "Peças Musicais", "icon": "pi pi-music", "route": "/pecas" },
        {
          "label": "Configurações",
          "icon": "pi pi-cog",
          "route": "/configuracoes"
        }
      ]
    }
  },
  "theme": {
    "primaryColor": "#007bff",
    "secondaryColor": "#6c757d",
    "fontFamily": "Arial, sans-serif"
  },
  "services": {
    "apiBaseUrl": "https://api.meuprojeto.com",
    "endpoints": {
      "getMaestros": {
        "url": "/maestros",
        "method": "GET",
        "events": ["onPageLoad", "onRefreshButtonClick"]
      },
      "getPecas": {
        "url": "/pecas",
        "method": "GET",
        "events": ["onPageLoad", "onRefreshButtonClick"]
      },
      "createMaestro": {
        "url": "/maestros/create",
        "method": "POST",
        "events": ["onSubmitForm"]
      },
      "createPeca": {
        "url": "/pecas/create",
        "method": "POST",
        "events": ["onSubmitForm"]
      }
    }
  },
  "components": {
    "dashboard": {
      "cards": [
        { "title": "Total de Maestros", "value": 42, "icon": "pi pi-users" },
        {
          "title": "Total de Peças Musicais",
          "value": 128,
          "icon": "pi pi-music"
        }
      ]
    },
    "forms": {
      "maestroForm": {
        "fields": [
          {
            "name": "nome",
            "type": "text",
            "label": "Nome do Maestro",
            "required": true
          },
          {
            "name": "email",
            "type": "email",
            "label": "Email",
            "required": true
          }
        ],
        "submitEvent": "createMaestro"
      },
      "pecaForm": {
        "fields": [
          {
            "name": "titulo",
            "type": "text",
            "label": "Título da Peça",
            "required": true
          },
          {
            "name": "compositor",
            "type": "text",
            "label": "Compositor",
            "required": true
          }
        ],
        "submitEvent": "createPeca"
      }
    }
  },
  "navigation": {
    "routes": [
      { "path": "/dashboard", "component": "Dashboard" },
      { "path": "/maestros", "component": "Maestros" },
      { "path": "/pecas", "component": "Pecas" },
      { "path": "/configuracoes", "component": "Configuracoes" }
    ]
  }
}
```

Objetivo atual:
Gerar o cadastro do usuário igual no projeto de LP, primeiramente sem o modal de confirmação e ligado ao backend
Num primeiro momento deixar o evento para o programador programar

p/ semana q vem:

| **Tarefa**                    | **Descrição**                                                                              | **Responsável** |
| ----------------------------- | ------------------------------------------------------------------------------------------ | --------------- |
| **Gerar Cadastro do Usuário** | Criar o cadastro do usuário igual ao projeto de LP, inicialmente sem modal de confirmação. | [Ambos]         |
| **Conectar ao Backend**       | Ligar o cadastro ao backend, deixando os eventos para o programador implementar.           | [Guilherme]     |
| **Boilerplate do Pedro**      | Finalizar boilerplate, pelo menos da parte do usuário,                                     | [Pedro]         |
| **JSON Proposto**             | Mapear os serviços chamados nas páginas, verificações e integração com o backend.          | [Guilherme]     |
