def get_relevant_examples(user_prompt):
    """Analisa o prompt do usuário e retorna exemplos relevantes de PrimeReact"""
    prompt_lower = user_prompt.lower()
    examples = []
    
    # Exemplos básicos de PrimeReact
    primereact_examples = {
        'form': '''import { useState } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const subjects = [
    { label: 'Suporte', value: 'support' },
    { label: 'Vendas', value: 'sales' },
    { label: 'Geral', value: 'general' }
  ]

  return (
    <div className="max-w-md mx-auto p-4">
      <Card title="📧 Entre em Contato">
        <div className="flex flex-col gap-4">
          <div className="field">
            <label htmlFor="name">Nome</label>
            <InputText 
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText 
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div className="field">
            <label htmlFor="subject">Assunto</label>
            <Dropdown 
              value={formData.subject}
              options={subjects}
              onChange={(e) => setFormData({...formData, subject: e.value})}
              placeholder="Selecione um assunto"
              className="w-full"
            />
          </div>
          
          <div className="field">
            <label htmlFor="message">Mensagem</label>
            <InputTextarea 
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={4}
              className="w-full"
            />
          </div>
          
          <Button label="Enviar" icon="pi pi-send" className="p-button-primary" />
        </div>
      </Card>
    </div>
  )
}''',
        
        'table': '''import { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { Card } from 'primereact/card'

function ProductTable() {
  const [products] = useState([
    { id: 1, name: 'Smartphone', price: 699.99, category: 'Eletrônicos', stock: 15 },
    { id: 2, name: 'Notebook', price: 1299.99, category: 'Eletrônicos', stock: 8 },
    { id: 3, name: 'Cadeira', price: 299.99, category: 'Móveis', stock: 25 }
  ])

  const priceBodyTemplate = (rowData) => {
    return `R$ ${rowData.price.toFixed(2)}`
  }

  const stockBodyTemplate = (rowData) => {
    const severity = rowData.stock > 10 ? 'success' : rowData.stock > 5 ? 'warning' : 'danger'
    return <Badge value={rowData.stock} severity={severity}></Badge>
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-text" />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" />
      </div>
    )
  }

  return (
    <Card title="📦 Produtos">
      <DataTable value={products} responsiveLayout="scroll" paginator rows={10}>
        <Column field="name" header="Nome" sortable></Column>
        <Column field="category" header="Categoria" sortable></Column>
        <Column body={priceBodyTemplate} header="Preço" sortable></Column>
        <Column body={stockBodyTemplate} header="Estoque" sortable></Column>
        <Column body={actionBodyTemplate} header="Ações"></Column>
      </DataTable>
    </Card>
  )
}''',
        
        'dashboard': '''import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { Badge } from 'primereact/badge'

function Dashboard() {
  const stats = [
    { title: 'Vendas', value: 'R$ 45.678', change: '+12%', icon: 'pi pi-dollar', color: 'success' },
    { title: 'Pedidos', value: '1.234', change: '+8%', icon: 'pi pi-shopping-cart', color: 'info' },
    { title: 'Usuários', value: '892', change: '+15%', icon: 'pi pi-users', color: 'warning' },
    { title: 'Produtos', value: '156', change: '+5%', icon: 'pi pi-box', color: 'help' }
  ]

  return (
    <div className="grid">
      <div className="col-12">
        <h1>📊 Dashboard</h1>
      </div>
      
      {stats.map((stat, index) => (
        <div key={index} className="col-12 md:col-6 lg:col-3">
          <Card>
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-500 font-medium mb-2">{stat.title}</div>
                <div className="text-900 font-medium text-xl">{stat.value}</div>
              </div>
              <div className="flex align-items-center">
                <Badge value={stat.change} severity={stat.color}></Badge>
                <i className={`${stat.icon} text-blue-500 text-xl ml-2`}></i>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}'''
    }
    
    # Mapear palavras-chave para tipos de componente
    if any(word in prompt_lower for word in ['form', 'formulário', 'contato', 'cadastro']):
        examples.append(primereact_examples['form'])
    elif any(word in prompt_lower for word in ['table', 'tabela', 'lista', 'dados']):
        examples.append(primereact_examples['table'])
    elif any(word in prompt_lower for word in ['dashboard', 'painel', 'estatísticas']):
        examples.append(primereact_examples['dashboard'])
    else:
        # Exemplo padrão - lista de mercado
        examples.append('''// Exemplo base - Lista de itens com PrimeReact
import { useState } from 'react'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

function ItemList() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now(), name: newItem }])
      setNewItem('')
    }
  }

  return (
    <Card title="Lista de Itens">
      <div className="flex gap-2 mb-4">
        <InputText 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Novo item..."
          className="flex-1"
        />
        <Button label="Adicionar" onClick={addItem} />
      </div>
      <DataTable value={items}>
        <Column field="name" header="Nome"></Column>
      </DataTable>
    </Card>
  )
}''')
    
    return examples
