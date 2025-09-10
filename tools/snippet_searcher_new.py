import json
import re
from pathlib import Path

class CodeSnippetSearcher:
    def __init__(self):
        self.chakra_examples_cache = {}
        self.cache_file = Path("utils/chakra_snippets_cache.json")
        self.load_cache()
        self.load_local_examples()
    
    def load_cache(self):
        """Carrega cache de snippets salvos"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    self.chakra_examples_cache = json.load(f)
            except:
                self.chakra_examples_cache = {}
    
    def save_cache(self):
        """Salva cache de snippets"""
        self.cache_file.parent.mkdir(exist_ok=True)
        with open(self.cache_file, 'w', encoding='utf-8') as f:
            json.dump(self.chakra_examples_cache, f, indent=2, ensure_ascii=False)
    
    def load_local_examples(self):
        """Carrega exemplos locais pré-definidos"""
        self.local_examples = {
            'form': [
                '''import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Heading,
  Card,
  CardBody,
  Textarea
} from '@chakra-ui/react'

function ContactForm() {
  return (
    <Card maxW="md" mx="auto">
      <CardBody>
        <VStack spacing={4}>
          <Heading size="md" color="blue.600">Entre em Contato</Heading>
          <FormControl>
            <FormLabel>Nome</FormLabel>
            <Input placeholder="Seu nome completo" />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="seu@email.com" />
          </FormControl>
          <FormControl>
            <FormLabel>Mensagem</FormLabel>
            <Textarea placeholder="Sua mensagem..." />
          </FormControl>
          <Button colorScheme="blue" size="lg" w="100%">
            Enviar Mensagem
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )
}''',
                '''import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  HStack,
  VStack,
  Switch,
  Checkbox,
  Link
} from '@chakra-ui/react'

function LoginForm() {
  return (
    <Box maxW="sm" mx="auto" p={6} bg="white" borderRadius="lg" shadow="lg">
      <VStack spacing={4}>
        <Heading size="lg" color="gray.700">Login</Heading>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Digite seu email" />
        </FormControl>
        <FormControl>
          <FormLabel>Senha</FormLabel>
          <Input type="password" placeholder="Digite sua senha" />
        </FormControl>
        <HStack justify="space-between" w="100%">
          <Checkbox>Lembrar-me</Checkbox>
          <Link color="blue.500">Esqueci a senha</Link>
        </HStack>
        <Button colorScheme="blue" size="lg" w="100%">
          Entrar
        </Button>
      </VStack>
    </Box>
  )
}'''
            ],
            'card': [
                '''import { 
  Box, 
  Card, 
  CardBody, 
  CardHeader,
  Heading, 
  Text, 
  Button,
  Image,
  Badge,
  HStack,
  VStack
} from '@chakra-ui/react'

function ProductCard({ product }) {
  return (
    <Card maxW="sm" borderRadius="lg" overflow="hidden" shadow="md">
      <Image src={product.image} alt={product.name} h="200px" objectFit="cover" />
      <CardBody>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="100%">
            <Heading size="md" color="gray.700">{product.name}</Heading>
            <Badge colorScheme="green" variant="solid">Novo</Badge>
          </HStack>
          <Text color="gray.600" fontSize="sm" noOfLines={3}>
            {product.description}
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="blue.600">
            R$ {product.price}
          </Text>
          <Button colorScheme="blue" size="sm" w="100%">
            Adicionar ao Carrinho
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )
}''',
                '''import { 
  Box, 
  Card, 
  CardBody,
  Heading, 
  Text, 
  Avatar,
  HStack,
  VStack,
  Icon
} from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'

function TestimonialCard({ testimonial }) {
  return (
    <Card bg="white" p={6} borderRadius="xl" shadow="lg" maxW="md">
      <CardBody>
        <VStack spacing={4} align="start">
          <HStack spacing={1}>
            {[...Array(5)].map((_, i) => (
              <Icon key={i} as={FaStar} color="yellow.400" />
            ))}
          </HStack>
          <Text fontSize="lg" color="gray.600" fontStyle="italic">
            "{testimonial.comment}"
          </Text>
          <HStack spacing={3}>
            <Avatar src={testimonial.avatar} name={testimonial.author} />
            <Box>
              <Text fontWeight="bold" color="gray.700">{testimonial.author}</Text>
              <Text fontSize="sm" color="gray.500">{testimonial.role}</Text>
            </Box>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )
}'''
            ],
            'layout': [
                '''import {
  Container,
  SimpleGrid,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon
} from '@chakra-ui/react'
import { FaUsers, FaRocket, FaHeart } from 'react-icons/fa'

function FeaturesSection() {
  const features = [
    { icon: FaUsers, title: "Comunidade", desc: "Milhares de usuários ativos" },
    { icon: FaRocket, title: "Performance", desc: "Rápido e otimizado" },
    { icon: FaHeart, title: "Confiável", desc: "Suporte 24/7" }
  ]

  return (
    <Container maxW="container.xl" py={16}>
      <VStack spacing={12}>
        <Box textAlign="center">
          <Heading size="xl" color="gray.700" mb={4}>
            Por que nos escolher?
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Oferecemos as melhores soluções para seu negócio crescer
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="100%">
          {features.map((feature, index) => (
            <Box key={index} textAlign="center" p={6} bg="white" borderRadius="lg" shadow="md">
              <VStack spacing={4}>
                <Icon as={feature.icon} boxSize={12} color="blue.500" />
                <Heading size="md" color="gray.700">{feature.title}</Heading>
                <Text color="gray.600">{feature.desc}</Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  )
}'''
            ]
        }
    
    def get_component_examples(self, component_type):
        """Retorna exemplos para um tipo de componente"""
        return self.local_examples.get(component_type.lower(), [])
    
    def get_examples_by_keywords(self, keywords):
        """Busca exemplos baseado em palavras-chave"""
        examples = []
        keywords_lower = [k.lower() for k in keywords]
        
        for category, category_examples in self.local_examples.items():
            for example in category_examples:
                if any(keyword in example.lower() for keyword in keywords_lower):
                    examples.append(example)
        
        return examples

# Instância global
snippet_searcher = CodeSnippetSearcher()

def get_chakra_examples(component_type):
    """Função helper para buscar exemplos"""
    return snippet_searcher.get_component_examples(component_type)

def search_examples_by_keywords(keywords):
    """Função helper para buscar por palavras-chave"""
    return snippet_searcher.get_examples_by_keywords(keywords)
