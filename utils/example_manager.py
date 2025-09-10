import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.snippet_searcher_new import snippet_searcher

def add_new_example(category, example_code):
    """Adiciona um novo exemplo à base de conhecimento"""
    if category not in snippet_searcher.local_examples:
        snippet_searcher.local_examples[category] = []
    
    snippet_searcher.local_examples[category].append(example_code)
    snippet_searcher.save_cache()
    print(f"[INFO] Exemplo adicionado à categoria '{category}'")

def list_available_categories():
    """Lista todas as categorias disponíveis"""
    return list(snippet_searcher.local_examples.keys())

def add_dashboard_examples():
    """Adiciona exemplos de dashboard"""
    dashboard_example = '''import { 
  Box, 
  Container, 
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Icon,
  VStack
} from '@chakra-ui/react'
import { FaUsers, FaDollarSign, FaShoppingCart, FaTrendingUp } from 'react-icons/fa'

function Dashboard() {
  const stats = [
    { label: "Usuários", value: "1,234", change: "+12%", icon: FaUsers, color: "blue" },
    { label: "Vendas", value: "R$ 45,678", change: "+8%", icon: FaDollarSign, color: "green" },
    { label: "Pedidos", value: "892", change: "+15%", icon: FaShoppingCart, color: "purple" },
    { label: "Crescimento", value: "23%", change: "+5%", icon: FaTrendingUp, color: "orange" }
  ]

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6}>
        <Heading size="lg" color="gray.700">Dashboard</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="100%">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardBody>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm">{stat.label}</StatLabel>
                  <StatNumber color="gray.800" fontSize="2xl">{stat.value}</StatNumber>
                  <StatHelpText color={`${stat.color}.500`}>
                    <Icon as={stat.icon} mr={1} />
                    {stat.change}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  )
}'''
    
    add_new_example('dashboard', dashboard_example)

def add_navbar_examples():
    """Adiciona exemplos de navegação"""
    navbar_example = '''import { 
  Box, 
  Flex,
  Spacer,
  Heading,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Link
} from '@chakra-ui/react'
import { FaChevronDown } from 'react-icons/fa'

function Navbar() {
  return (
    <Box bg="white" shadow="sm" px={6} py={4}>
      <Flex align="center">
        <Heading size="md" color="blue.600">MeuApp</Heading>
        
        <Spacer />
        
        <HStack spacing={6}>
          <Link color="gray.600" _hover={{ color: "blue.600" }}>Início</Link>
          <Link color="gray.600" _hover={{ color: "blue.600" }}>Produtos</Link>
          <Link color="gray.600" _hover={{ color: "blue.600" }}>Sobre</Link>
          <Link color="gray.600" _hover={{ color: "blue.600" }}>Contato</Link>
          
          <Menu>
            <MenuButton as={Button} rightIcon={<FaChevronDown />} variant="ghost">
              <Avatar size="sm" name="Usuario" mr={2} />
            </MenuButton>
            <MenuList>
              <MenuItem>Perfil</MenuItem>
              <MenuItem>Configurações</MenuItem>
              <MenuItem>Sair</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  )
}'''
    
    add_new_example('navigation', navbar_example)

if __name__ == "__main__":
    # Adicionar novos exemplos
    add_dashboard_examples()
    add_navbar_examples()
    
    print("Categorias disponíveis:", list_available_categories())
