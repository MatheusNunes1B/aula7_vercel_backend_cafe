// =============================================================
// server.js — Servidor Principal da API do Haruy Sushi
// =============================================================
// Aula 6: API Middleware and Error Handling
//
// O que aprendemos nesta aula?
//   1. O que são Middlewares e para que servem
//   2. Criar um Middleware de Log (logger.js)
//   3. Criar um Middleware de Tratamento de Erros (errorHandler.js)
//   4. Tratar rotas não encontradas (Erro 404)
//   5. A ORDEM dos middlewares importa muito!
//
// Fluxo de uma Requisição (com Middlewares):
//
//  App Mobile
//     │
//     ▼
//  [cors()]              ← Middleware 1: Libera acesso de outras origens
//     │
//     ▼
//  [express.json()]      ← Middleware 2: Transforma o body em JSON
//     │
//     ▼
//  [logger]              ← Middleware 3: Anota a requisição no terminal
//     │
//     ▼
//  Rota correta          ← A requisição chega na rota certa
//  (ex: GET /api/produtos)
//     │
//     ▼ (se der erro)
//  [errorHandler]        ← Captura qualquer erro das rotas
//     │
//     ▼
//  Resposta enviada ao App Mobile
//
// =============================================================


// ─── 1. Importações das Dependências ─────────────────────────
// express: framework web para criar o servidor e as rotas
const express = require('express');
const cors = require('cors');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.get('/', (req, res) => {
    res.json({ mensagem: '🍣 Bem-vindo à API da Cafeteria Horizonte (Aula 6)' });
});

const rotasCategorias = require('./routes/categorias');
const rotasProdutos = require('./routes/produtos');

app.use('/api/categorias', rotasCategorias);
app.use('/api/produtos', rotasProdutos);

app.use((req, res, next) => {
    res.status(404).json({
        sucesso: false,
        mensagem: `Rota '${req.url}' não encontrada na API do Cafeteria Horizonte`
    });
});

app.use(errorHandler);
const PORTA = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
  });
}

module.exports = app;


// =============================================================
// server.js — API Cafeteria Horizonte + Supabase
// =============================================================

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ─── CONFIG SUPABASE ──────────────────────────────────────────
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── MIDDLEWARES ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(logger);

// ─── ROTA BASE ───────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ mensagem: '☕ API Cafeteria Horizonte rodando com Supabase' });
});

// ─── ROTAS EXISTENTES ─────────────────────────────────────────
const rotasCategorias = require('./routes/categorias');
const rotasProdutos = require('./routes/produtos');

app.use('/api/categorias', rotasCategorias);
app.use('/api/produtos', rotasProdutos);

// =============================================================
// 🧾 ROTAS DE PEDIDOS (AGORA COM SUPABASE)
// =============================================================

// GET /api/pedidos
app.get('/api/pedidos', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            sucesso: true,
            dados: data
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/pedidos/:id
app.get('/api/pedidos/:id', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;

        res.json({ sucesso: true, dados: data });
    } catch (err) {
        next(err);
    }
});

// POST /api/pedidos
app.post('/api/pedidos', async (req, res, next) => {
    try {
        const { cliente_nome, cliente_tel, itens, observacao, latitude, longitude } = req.body;

        if (!cliente_nome || !itens || itens.length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'cliente_nome e itens são obrigatórios'
            });
        }

        const { data, error } = await supabase
            .from('pedidos')
            .insert([{
                cliente_nome,
                cliente_tel,
                itens,
                observacao,
                latitude,
                longitude,
                status: 'novo'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            sucesso: true,
            dados: data
        });

    } catch (err) {
        next(err);
    }
});

// PATCH /api/pedidos/:id
app.patch('/api/pedidos/:id', async (req, res, next) => {
    try {
        const { status } = req.body;

        const { data, error } = await supabase
            .from('pedidos')
            .update({ status })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            sucesso: true,
            dados: data
        });

    } catch (err) {
        next(err);
    }
});

// DELETE /api/pedidos/:id
app.delete('/api/pedidos/:id', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .delete()
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            sucesso: true,
            dados: data
        });

    } catch (err) {
        next(err);
    }
});

// IMPORTAR
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ROTA TESTE
app.get('/api/pedidos', async (req, res) => {
    const { data, error } = await supabase
        .from('pedidos')
        .select('*');

    if (error) {
        return res.status(500).json({ erro: error.message });
    }

    res.json({ sucesso: true, dados: data });
});


// ─── 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: `Rota '${req.url}' não encontrada`
    });
});

// ─── ERROR HANDLER ───────────────────────────────────────────
app.use(errorHandler);

// ─── START ───────────────────────────────────────────────────
const PORTA = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORTA, () => {
        console.log(`🚀 Servidor rodando na porta ${PORTA}`);
    });
}

module.exports = app;
