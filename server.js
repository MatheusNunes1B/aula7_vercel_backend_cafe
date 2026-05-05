console.log('URL:', process.env.SUPABASE_URL);
console.log('KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING');

// =============================================================
// server.js — API Cafeteria Horizonte (CORRIGIDO)
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

// ─── ROTA BASE ────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ mensagem: '☕ API Cafeteria Horizonte rodando com Supabase' });
});

// ─── ROTAS EXISTENTES ─────────────────────────────────────────
const rotasCategorias = require('./routes/categorias');
const rotasProdutos   = require('./routes/produtos');

app.use('/api/categorias', rotasCategorias);
app.use('/api/produtos', rotasProdutos);

// =============================================================
// 🧾 ROTAS DE PEDIDOS (SUPABASE)
// =============================================================

// GET TODOS
app.get('/api/pedidos', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ sucesso: true, dados: data });
    } catch (err) {
        next(err);
    }
});

// GET POR ID
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

// CRIAR PEDIDO
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

        res.status(201).json({ sucesso: true, dados: data });

    } catch (err) {
        next(err);
    }
});

// ATUALIZAR STATUS
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

        res.json({ sucesso: true, dados: data });

    } catch (err) {
        next(err);
    }
});

// DELETAR
app.delete('/api/pedidos/:id', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .delete()
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        res.json({ sucesso: true, dados: data });

    } catch (err) {
        next(err);
    }
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

// ─── START LOCAL ─────────────────────────────────────────────
const PORTA = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORTA, () => {
        console.log(`🚀 Servidor rodando na porta ${PORTA}`);
    });
}

module.exports = app;
