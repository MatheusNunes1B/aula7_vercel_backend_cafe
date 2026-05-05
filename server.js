// =============================================================
// server.js — API Cafeteria Horizonte (Vercel + Supabase)
// =============================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ─── MIDDLEWARES ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(logger);

// ─── ROTA BASE ────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ mensagem: '☕ API Cafeteria Horizonte rodando com Supabase' });
});

// ─── ROTAS ────────────────────────────────────────────────────
const rotasCategorias = require('./routes/categorias');
const rotasProdutos   = require('./routes/produtos');
const rotasPedidos    = require('./routes/pedidos'); // ✅ NOVA

app.use('/api/categorias', rotasCategorias);
app.use('/api/produtos', rotasProdutos);
app.use('/api/pedidos', rotasPedidos); // ✅ NOVA

// ─── 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: `Rota '${req.url}' não encontrada`
    });
});

// ─── ERROR HANDLER ───────────────────────────────────────────
app.use(errorHandler);

// ─── START LOCAL (NÃO RODA NA VERCEL) ────────────────────────
const PORTA = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORTA, () => {
        console.log(`🚀 Servidor rodando na porta ${PORTA}`);
    });
}

// ─── EXPORTAÇÃO (OBRIGATÓRIO PRA VERCEL) ─────────────────────
module.exports = app;
