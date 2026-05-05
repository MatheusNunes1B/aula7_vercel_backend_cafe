// =============================================================
// routes/pedidos.js — Rotas de Pedidos (CRUD Completo)
// =============================================================
// Aqui controlamos todos os pedidos da cafeteria.
//
// Estrutura do pedido:
// {
//   cliente_nome,
//   cliente_tel,
//   itens,
//   observacao,
//   latitude,
//   longitude,
//   status
// }
//
// Status pode ser: "novo", "preparando", "entregue"
// =============================================================

const express = require('express');
const router = express.Router();

// ─── IMPORTAÇÃO DO SUPABASE ───────────────────────────────────
const supabase = require('../data/supabase');

// =============================================================
// ── [GET] /api/pedidos ────────────────────────────────────────
// Retorna todos os pedidos (mais recentes primeiro)
// =============================================================
router.get('/', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        next(err);
    }
});

// =============================================================
// ── [GET] /api/pedidos/:id ────────────────────────────────────
// Retorna um pedido específico
// =============================================================
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

    } catch (err) {
        next(err);
    }
});

// =============================================================
// ── [POST] /api/pedidos ───────────────────────────────────────
// Cria um novo pedido
// =============================================================
router.post('/', async (req, res, next) => {
    try {
        const {
            cliente_nome,
            cliente_tel,
            itens,
            observacao,
            latitude,
            longitude
        } = req.body;

        // Validação básica
        if (!cliente_nome || !itens || itens.length === 0) {
            return res.status(400).json({
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
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);

    } catch (err) {
        next(err);
    }
});

// =============================================================
// ── [PATCH] /api/pedidos/:id ──────────────────────────────────
// Atualiza apenas o status do pedido
// =============================================================
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('pedidos')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data && data.length > 0) {
            res.json(data[0]);
        } else {
            res.status(404).json({ mensagem: 'Pedido não encontrado' });
        }

    } catch (err) {
        next(err);
    }
});

// =============================================================
// ── [DELETE] /api/pedidos/:id ─────────────────────────────────
// Remove um pedido
// =============================================================
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('pedidos')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ mensagem: 'Pedido deletado' });

    } catch (err) {
        next(err);
    }
});

// ─── EXPORTAÇÃO ───────────────────────────────────────────────
module.exports = router;
