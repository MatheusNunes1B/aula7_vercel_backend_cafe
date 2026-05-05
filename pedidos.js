// =============================================================
// routes/pedidos.js — Rotas de Pedidos da API Cafeteria Horizonte
// =============================================================
// Endpoints disponíveis:
//   GET    /api/pedidos          → Lista todos os pedidos
//   GET    /api/pedidos/:id      → Busca um pedido por ID
//   POST   /api/pedidos          → Cria um novo pedido
//   PATCH  /api/pedidos/:id      → Atualiza o status de um pedido
//   DELETE /api/pedidos/:id      → Remove um pedido
// =============================================================

const express = require('express');
const router  = express.Router();

// ─── "Banco de dados" em memória (substitua por DB real se quiser) ──────────
// Em produção, troque por uma integração com Supabase, MongoDB, PostgreSQL, etc.
let pedidos = [];
let proximoId = 1;

// ─── Status válidos ───────────────────────────────────────────────────────────
const STATUS_VALIDOS = ['novo', 'preparo', 'pronto', 'entregue', 'cancelado'];

// =============================================================
// GET /api/pedidos
// Lista todos os pedidos, do mais recente ao mais antigo.
// Query params opcionais:
//   ?status=novo           → filtra por status
//   ?limite=10             → limita quantidade de resultados
// =============================================================
router.get('/', (req, res, next) => {
    try {
        const { status, limite } = req.query;

        let resultado = [...pedidos].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        if (status) {
            if (!STATUS_VALIDOS.includes(status)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}`
                });
            }
            resultado = resultado.filter(p => p.status === status);
        }

        if (limite) {
            resultado = resultado.slice(0, parseInt(limite));
        }

        res.json({
            sucesso:    true,
            quantidade: resultado.length,
            dados:      resultado
        });
    } catch (err) {
        next(err);
    }
});

// =============================================================
// GET /api/pedidos/:id
// Retorna um pedido específico pelo ID.
// =============================================================
router.get('/:id', (req, res, next) => {
    try {
        const pedido = pedidos.find(p => p.id === parseInt(req.params.id));

        if (!pedido) {
            return res.status(404).json({
                sucesso:  false,
                mensagem: `Pedido #${req.params.id} não encontrado.`
            });
        }

        res.json({ sucesso: true, dados: pedido });
    } catch (err) {
        next(err);
    }
});

// =============================================================
// POST /api/pedidos
// Cria um novo pedido.
// Body esperado (JSON):
// {
//   "cliente_nome": "João Silva",
//   "itens": [
//     { "nome": "Café Expresso", "preco": 8.00, "quantidade": 2 },
//     { "nome": "Pão de Queijo", "preco": 5.50, "quantidade": 1 }
//   ],
//   "observacao": "Sem açúcar",    ← opcional
//   "latitude":  -23.550520,       ← opcional
//   "longitude": -46.633308        ← opcional
// }
// =============================================================
router.post('/', (req, res, next) => {
    try {
        const { cliente_nome, itens, observacao, latitude, longitude } = req.body;

        // ── Validações ──────────────────────────────────────────
        if (!cliente_nome || cliente_nome.trim() === '') {
            return res.status(400).json({
                sucesso:  false,
                mensagem: 'O campo "cliente_nome" é obrigatório.'
            });
        }

        if (!itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                sucesso:  false,
                mensagem: 'O campo "itens" é obrigatório e deve ser uma lista com ao menos 1 item.'
            });
        }

        for (const item of itens) {
            if (!item.nome || item.preco == null || item.quantidade == null) {
                return res.status(400).json({
                    sucesso:  false,
                    mensagem: 'Cada item deve ter "nome", "preco" e "quantidade".'
                });
            }
            if (item.quantidade < 1) {
                return res.status(400).json({
                    sucesso:  false,
                    mensagem: `A quantidade do item "${item.nome}" deve ser ao menos 1.`
                });
            }
            if (item.preco < 0) {
                return res.status(400).json({
                    sucesso:  false,
                    mensagem: `O preço do item "${item.nome}" não pode ser negativo.`
                });
            }
        }

        // ── Calcular total ──────────────────────────────────────
        const total = itens.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);

        // ── Montar objeto do pedido ─────────────────────────────
        const novoPedido = {
            id:           proximoId++,
            cliente_nome: cliente_nome.trim(),
            itens,
            observacao:   observacao || null,
            latitude:     latitude   || null,
            longitude:    longitude  || null,
            status:       'novo',
            total,
            created_at:   new Date().toISOString(),
            updated_at:   new Date().toISOString()
        };

        pedidos.push(novoPedido);

        res.status(201).json({
            sucesso:  true,
            mensagem: 'Pedido criado com sucesso!',
            dados:    novoPedido
        });
    } catch (err) {
        next(err);
    }
});

// =============================================================
// PATCH /api/pedidos/:id
// Atualiza o status de um pedido.
// Body esperado (JSON):
// { "status": "preparo" }
// =============================================================
router.patch('/:id', (req, res, next) => {
    try {
        const { status } = req.body;
        const id         = parseInt(req.params.id);

        // ── Validações ──────────────────────────────────────────
        if (!status) {
            return res.status(400).json({
                sucesso:  false,
                mensagem: 'O campo "status" é obrigatório.'
            });
        }

        if (!STATUS_VALIDOS.includes(status)) {
            return res.status(400).json({
                sucesso:  false,
                mensagem: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}`
            });
        }

        const idx = pedidos.findIndex(p => p.id === id);

        if (idx === -1) {
            return res.status(404).json({
                sucesso:  false,
                mensagem: `Pedido #${id} não encontrado.`
            });
        }

        // ── Atualizar ───────────────────────────────────────────
        pedidos[idx].status     = status;
        pedidos[idx].updated_at = new Date().toISOString();

        res.json({
            sucesso:  true,
            mensagem: `Pedido #${id} atualizado para "${status}".`,
            dados:    pedidos[idx]
        });
    } catch (err) {
        next(err);
    }
});

// =============================================================
// DELETE /api/pedidos/:id
// Remove um pedido pelo ID.
// =============================================================
router.delete('/:id', (req, res, next) => {
    try {
        const id  = parseInt(req.params.id);
        const idx = pedidos.findIndex(p => p.id === id);

        if (idx === -1) {
            return res.status(404).json({
                sucesso:  false,
                mensagem: `Pedido #${id} não encontrado.`
            });
        }

        const removido = pedidos.splice(idx, 1)[0];

        res.json({
            sucesso:  true,
            mensagem: `Pedido #${id} removido com sucesso.`,
            dados:    removido
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
