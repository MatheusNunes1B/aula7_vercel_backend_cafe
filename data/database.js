// =============================================================
// data/database.js — Banco de Dados em Memória
// =============================================================
// O que é isso?
//   Em vez de usar um banco de dados real (como MySQL ou MongoDB),
//   guardamos os dados aqui mesmo, dentro de arrays do JavaScript.
//   Isso funciona enquanto o servidor está ligado.
//   Quando o servidor reinicia, os dados voltam para o estado inicial.
//
// Por que usar isso nas aulas?
//   Simplifica o aprendizado! Não precisamos instalar e configurar
//   um banco de dados externo. O foco é aprender a API e os Middlewares.
// =============================================================

// ─── Tabela de Categorias ─────────────────────────────────────
// Cada categoria agrupa produtos relacionados no cardápio.
let categorias = [
    { id: 1, nome: "Café Classico" },
    { id: 1, nome: "Lanches" },
    { id: 1, nome: "Doces e Sobremesas" },
    { id: 1, nome: "Bebidas Especiais" },
]

// ─── Tabela de Produtos ───────────────────────────────────────
// Cada produto tem um ID único, pertence a uma categoria (categoriaId),
// e possui nome, descrição, preço e o nome do arquivo de imagem.
let produtos = [

    // ===== 1 - CAFÉS CLÁSSICOS =====
    {
        categoriaId: 1,
        nome: "Espresso Tradicional",
        descricao: "Café encorpado e intenso, extraído na hora.",
        preco: 6.00,
        categorias: "Cafés Clássicos",
        imagem: "https://blog.terrainvestimentos.com.br/wp-content/uploads/elementor/thumbs/Cafe-qual-e-o-melhor-scaled-1-ppcawa5sg2ns76tnnz33alvamako3kj5e2zbqp36da.jpg"
    },
    {
        categoriaId: 1,
        nome: "Cappuccino Cremoso",
        descricao: "Espresso com leite vaporizado e espuma aveludada.",
        preco: 14.00,
        categorias: "Cafés Clássicos",
        imagem: "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
    },
    {
        categoriaId: 1,
        nome: "Latte Caramelo",
        descricao: "Café suave com leite e toque de caramelo.",
        preco: 16.00,
        categorias: "Cafés Clássicos",
        imagem: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735"
    },
    {
        categoriaId: 1,
        nome: "Mocha Especial",
        descricao: "Espresso com chocolate e leite cremoso.",
        preco: 32.00,
        categorias: "Cafés Clássicos",
        imagem: "https://images.unsplash.com/photo-1572490122747-3968b75cc699"
    },


    // ===== 2 - LANCHES ARTESANAIS =====
    {
        categoriaId: 2,
        nome: "Croissant Misto Quente",
        descricao: "Croissant amanteigado com presunto e queijo.",
        preco: 19.00,
        categorias: "Lanches Artesanais",
        imagem: "https://auroracultural.com/wp-content/uploads/2025/01/Misto-quente-scaled-1.jpg"
    },
    {
        categoriaId: 2,
        nome: "Toast de Abacate",
        descricao: "Pão rústico com pasta de abacate temperada.",
        preco: 24.00,
        categorias: "Lanches Artesanais",
        imagem: "https://images.unsplash.com/photo-1604908554168-37a3b7f9c1c1"
    },
    {
        categoriaId: 2,
        nome: "Sanduíche Natural",
        descricao: "Frango desfiado, alface e creme leve.",
        preco: 22.00,
        categorias: "Lanches Artesanais",
        imagem: "https://images.unsplash.com/photo-1528731708534-816fe59f90b5"
    },
    {
        categoriaId: 2,
        nome: "Pão de Queijo Mineiro",
        descricao: "Tradicional, macio por dentro e crocante por fora.",
        preco: 9.00,
        categorias: "Lanches Artesanais",
        imagem: "https://images.unsplash.com/photo-1585238342028-4d74b2c1f8d2"
    },


    // ===== 3 - DOCES & SOBREMESAS =====
    {
        categoriaId: 3,
        nome: "Cheesecake de Frutas Vermelhas",
        descricao: "Base crocante com creme leve e calda artesanal.",
        preco: 18.00,
        categorias: "Doces & Sobremesas",
        imagem: "https://cdn.dooca.store/149445/products/zzkwkuc268r8plq7syaaxcgsn6ljqarw98dy_640x640+fill_ffffff.png?v=1724757760&webp=0"
    },
    {
        categoriaId: 3,
        nome: "Brownie com Sorvete",
        descricao: "Brownie quente servido com sorvete de baunilha.",
        preco: 22.00,
        categorias: "Doces & Sobremesas",
        imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c"
    },
    {
        categoriaId: 3,
        nome: "Torta de Limão",
        descricao: "Recheio cremoso com cobertura levemente dourada.",
        preco: 16.00,
        categorias: "Doces & Sobremesas",
        imagem: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40"
    },
    {
        categoriaId: 3,
        nome: "Cookie Artesanal",
        descricao: "Biscoito macio com gotas de chocolate.",
        preco: 8.00,
        categorias: "Doces & Sobremesas",
        imagem: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e"
    },


    // ===== 4 - BEBIDAS ESPECIAIS =====
    {
        categoriaId: 4,
        nome: "Chocolate Quente Cremoso",
        descricao: "Chocolate intenso com leite vaporizado.",
        preco: 15.00,
        categorias: "Bebidas Especiais",
        imagem: "https://areademulher.r7.com/wp-content/uploads/2022/03/chocolate-quente-cremoso.jpg"
    },
    {
        categoriaId: 4,
        nome: "Chá Gelado Natural",
        descricao: "Refrescante, sabor limão ou pêssego.",
        preco: 12.00,
        categorias: "Bebidas Especiais",
        imagem: "https://images.unsplash.com/photo-1497534446932-c925b458314e"
    },
    {
        categoriaId: 4,
        nome: "Suco Natural",
        descricao: "Feito na hora, laranja, abacaxi ou maracujá.",
        preco: 14.00,
        categorias: "Bebidas Especiais",
        imagem: "https://images.unsplash.com/photo-1577805947697-89e18249d767"
    },
    {
        categoriaId: 4,
        nome: "Frappé de Café",
        descricao: "Café gelado batido com gelo e chantilly.",
        preco: 20.00,
        categorias: "Bebidas Especiais",
        imagem: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81"
    }

];

// ─── Exportação dos dados ─────────────────────────────────────
// Exportamos as duas variáveis num único objeto para que outros
// arquivos (como as rotas) possam importar e usar esses dados.
module.exports = { categorias, produtos };
