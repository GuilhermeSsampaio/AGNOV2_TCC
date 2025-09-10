# Exemplos de Componentes Chakra UI

## Componentes Básicos Mais Usados

### Layout

- `<Box>` - Div estilizada
- `<Container>` - Container centralizado
- `<VStack>` - Stack vertical
- `<HStack>` - Stack horizontal
- `<SimpleGrid>` - Grid responsivo
- `<Flex>` - Flexbox

### Texto

- `<Heading>` - Títulos (size='xs'|'sm'|'md'|'lg'|'xl'|'2xl')
- `<Text>` - Texto normal
- `<Link>` - Links

### Formulários

- `<Input>` - Campo de entrada
- `<Button>` - Botão (colorScheme='blue'|'red'|'green'|etc)
- `<FormControl>` - Container de formulário
- `<FormLabel>` - Label do campo
- `<Textarea>` - Área de texto
- `<Select>` - Select dropdown
- `<Checkbox>` - Checkbox
- `<Radio>` - Radio button

### Feedback

- `<Alert>` - Alertas (status='success'|'error'|'warning'|'info')
- `<Spinner>` - Loading spinner
- `<Progress>` - Barra de progresso
- `<Toast>` - Notificações (use useToast hook)

### Dados

- `<Table>` - Tabelas
- `<Badge>` - Badge/chip
- `<Tag>` - Tags
- `<Card>` - Cards (use Box com estilização)

### Navegação

- `<Breadcrumb>` - Breadcrumbs
- `<Tabs>` - Tabs/abas

### Overlay

- `<Modal>` - Modal/popup
- `<Drawer>` - Drawer lateral
- `<Popover>` - Popover

## Props Mais Comuns

### Cores

- `bg='blue.500'` - Background
- `color='white'` - Cor do texto
- `colorScheme='blue'` - Esquema de cores (para Button, etc)

### Espaçamento

- `p={4}` - Padding (1-12)
- `m={2}` - Margin (1-12)
- `px={6}` - Padding horizontal
- `py={4}` - Padding vertical

### Tamanho

- `w='100%'` - Width
- `h='200px'` - Height
- `maxW='container.md'` - Max width
- `size='lg'` - Size (para Button, Input, etc)

### Bordas

- `borderRadius='md'` - Border radius ('sm'|'md'|'lg'|'xl')
- `border='1px'` - Border
- `borderColor='gray.200'` - Border color

### Sombras

- `shadow='sm'` - Box shadow ('sm'|'md'|'lg'|'xl')

### Responsividade

Use arrays para diferentes breakpoints:

- `direction={['column', 'row']}` - Coluna no mobile, linha no desktop
- `spacing={[4, 6]}` - Spacing 4 no mobile, 6 no desktop

## Exemplo de Componente Completo

```jsx
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Badge,
  useToast,
} from "@chakra-ui/react";

function ExemploComponente() {
  const toast = useToast();

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6}>
        <Box textAlign="center">
          <Heading size="xl" color="blue.600">
            Título Principal
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Subtítulo explicativo
          </Text>
        </Box>

        <Card w="100%">
          <CardBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input placeholder="Digite seu nome" />
              </FormControl>

              <HStack spacing={4} w="100%">
                <Button colorScheme="blue" flex={1}>
                  Confirmar
                </Button>
                <Button variant="outline" flex={1}>
                  Cancelar
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <HStack spacing={2}>
          <Badge colorScheme="green">Ativo</Badge>
          <Badge colorScheme="red">Inativo</Badge>
        </HStack>
      </VStack>
    </Container>
  );
}
```

## Dicas para IA

1. **Sempre use componentes Chakra** em vez de HTML básico
2. **Combine cores consistentes**: use blue.50 para backgrounds claros, blue.500 para elementos principais
3. **Use spacing consistente**: múltiplos de 4 (4, 8, 12)
4. **Layout com VStack/HStack**: mais fácil que Flexbox manual
5. **Container para centralizar**: sempre envolva o conteúdo principal
6. **Cards para agrupamento**: use Box com bg='white', p={6}, borderRadius='lg', shadow='md'
