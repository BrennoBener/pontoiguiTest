# 📱 Revista Digital Atacado - Ponto Igui

Sistema completo de catálogo digital e e-commerce para atacado de roupas com integração WhatsApp.

##  Funcionalidades

###  Catálogo Digital
- **Visualização em Revista**: Navegação horizontal entre páginas de catálogo
- **Sistema de Filtros**: Categorias (Saias, Blusas, Calças, Vestidos, Conjuntos, Plus Size)
- **Visualização de Imagens**: Zoom em produtos
- **Menu Responsivo**: Adaptado para desktop, tablet e mobile

###  Sistema de Carrinho Avançado
- **Carrinho**: Mantém itens mesmo navegando entre páginas
- **Conjuntos**: Compre o conjunto completo ou peças individuais
  - Cliente pode escolher: 5 blusas + 3 calças de um mesmo conjunto
  - Preços individualizados por peça
- **Controle de Quantidade**: Aumentar ou diminuir quantidade de cada item
- **Remoção de Itens**: Remover produtos do carrinho facilmente

### Integração com WhatsApp
- **Envio Automático**: Lista de compras via WhatsApp
- **Pedido Mínimo**: Sistema de validação de quantidade mínima (6 peças)
- **Informações Completas**: Referência, tamanho, cor, quantidade e preço total
- **Direto para Vendedor**: Botão flutuante WhatsApp para contato rápido

### Responsividade
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet (768px)**: Ajustes de espaçamento e tamanho de fonte
- **Mobile (480px)**: Interface otimizada para telas pequenas

## Estrutura do Projeto

```
.
├── index.html          # Estrutura HTML principal
├── style.css           # Estilos CSS com media queries
├── script.js           # Lógica JavaScript
├── images/             # Imagens dos produtos
│   ├── capa.jpg
│   ├── modeloplus1.jpeg
│   ├── modeloplus1costa.jpeg
│   └── modeloplus1cores.jpg
└── README.md
```

## Estrutura de Dados dos Produtos

### Produto Normal
```javascript
{
    id: 1,
    nome: "Nome do Produto",
    categorias: ["Blusas", "Saias"],
    referencia: "REF-001",
    preco: 49.90,
    imagens: ["./images/img1.jpg"],
    tamanhos: ["P", "M", "G"],
    cores: ["Branco", "Preto"],
    descricao: "Descrição do produto"
}
```

### Conjunto com Peças Individuais
```javascript
{
    id: 1,
    nome: "Conjunto Plus Size em Air Flow",
    categorias: ["Conjuntos", "Blusas", "Calça"],
    preco: 89.80,           // Preço do conjunto completo
    isConjunto: true,
    pecas: [
        {
            nome: "Blusa",
            referencia: "0030011",
            preco: 34.90,
            cores: ["Bege", "Preto"],
            tamanhos: ["G"]
        },
        {
            nome: "Calça",
            referencia: "1700022",
            preco: 54.90,
            cores: ["Bege", "Preto"],
            tamanhos: ["G"]
        }
    ],
    imagens: ["./images/model.jpg"],
    tamanhos: ["G"],
    cores: ["Bege", "Preto"],
    descricao: "Descrição"
}
```

## Como Usar

### Adicionar Novo Produto

No `script.js`, adicione à array `produtos`:

```javascript
{
    id: 2,
    nome: "Blusa Simples",
    categorias: ["Blusas"],
    referencia: "BLS-001",
    preco: 49.90,
    imagens: ["./images/blusa.jpg"],
    tamanhos: ["P", "M", "G"],
    cores: ["Branco", "Preto", "Azul"],
    descricao: "Blusa básica de alta qualidade"
}
```

### Adicionar Nova Categoria

No `script.js`, adicione à array `categorias`:

```javascript
const categorias = [
    "Saias",
    "Blusas",
    "Vestidos",
    "Conjuntos",
    "Macacões",
    "SUA_NOVA_CATEGORIA"  // Adicione aqui
];
```

### Alterar Número WhatsApp

No `script.js`, procure por `558598097181` e substitua pelo seu número:
- Formato: +55 + DDD + Número (sem caracteres especiais)

## Customização

### Cores do Menu
No `style.css`, linha 54+:
```css
.menu-bottom {
    background: transparent;  /* Mude a cor aqui */
}
```

### Tamanho das Imagens do Catálogo
No `style.css`, altere `.pagina`:
```css
.pagina {
    background-size: cover;
    background-position: center;
}
```

## Breakpoints Responsivos

- **480px**: Mobile
- **600px**: Tablet pequeno
- **768px**: Tablet grande / Desktop pequeno
- **1024px+**: Desktop completo

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Grid, Flexbox, Media Queries
- **JavaScript Vanilla**: Sem dependências externas
- **Google Material Icons**: Ícones
- **WhatsApp Web API**: Integração de mensagens

## Constantantes Importantes

```javascript
const PEDIDO_MINIMO = 6;  // Mínimo de peças por pedido
```

## Troubleshooting

### Carrinho não abre
- Verifique se `modal-carrinho` existe no HTML
- Verifique se `fecharModal()` está funcionando

### Imagens não carregam
- Verifique o caminho das imagens em relação ao index.html
- Use caminhos relativos: `./images/nome.jpg`

### WhatsApp não funciona
- Verifique o número de telefone (formato: 999999999)
- Confira se está usando HTTPS em produção

## Deploy com GitHub Pages

O projeto está configurado para deploy automático via GitHub Pages:

1. Vá para Settings do repositório
2. Procure por "Pages"
3. Selecione "main branch" como source
4. Clique em Save

Seu site estará disponível em: `https://seu-usuario.github.io/seu-repositorio`

## Licença

Projeto desenvolvido para estudos e aplicação.

## Autor

Desenvolvido por: Brenno Bener
Data: Janeiro 2026

---

**Última atualização**: 29/01/2026
**Versão**: 1.0.0
