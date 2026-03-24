// =============================================================
// routes/produtos.js — Rotas de Produtos (CRUD Completo)
// =============================================================
// O que é CRUD?
//   Create (POST)   → Criar produto novo
//   Read   (GET)    → Ler/listar produtos
//   Update (PUT)    → Atualizar produto existente
//   Delete (DELETE) → Remover produto
//
// Todas as 4 operações estão implementadas aqui!
// =============================================================

const express = require('express');
const router = express.Router();
let supabase = require('../data/supabase');
// ⚠️ Usamos 'let' (não 'const') porque a rota DELETE vai
//    reatribuir db.produtos com um novo array filtrado.

// =============================================================
// ── AULA 6: ROTA ESPECIAL PARA TESTE DE ERRO ─────────────────
// =============================================================
// Esta rota existe apenas para demonstrar o Middleware de Erros.
// Quando acessada, ela "explode" de propósito para mostrar
// que o errorHandler captura o erro e devolve um JSON elegante
// em vez de travar o servidor.
//
// Teste no Thunder Client:
//   Método: GET
//   URL: http://localhost:3000/api/produtos/erro-teste
//
// Resposta esperada (com o errorHandler funcionando):
//   { "sucesso": false, "mensagem": "Ops!...", "detalhe": "O servidor do Haruy Sushi tropeçou!" }
//
// ⚠️ DEVE VIR ANTES da rota '/:id', senão "erro-teste" seria
//    interpretado como um ID de produto!
// =============================================================
router.get('/erro-teste', (req, res) => {
    // throw new Error() lança um erro intencional.
    // O Express captura e repassa para o middleware de erro (errorHandler.js).
    throw new Error("O servidor do Café Horizonte tropeçou!");
});

// =============================================================
// ── [GET] /api/produtos ───────────────────────────────────────
// Retorna todos os produtos OU filtra por categoriaId.
//
// Exemplos de teste no Thunder Client:
//   Todos:             GET http://localhost:3000/api/produtos
//   Filtrar categoria: GET http://localhost:3000/api/produtos?categoriaId=1
//
// Query Params (parâmetros na URL com ?):
//   São acessados via req.query.nomeDoParametro
//   Ex: /api/produtos?categoriaId=2 → req.query.categoriaId === "2"
// =============================================================
router.get('/', async (req, res, next) => {

try{
    const {categoriaId} = req.query;
    let consulta = supabase.from('produtos').select('*');

    if (categoriaId){
        consulta = consulta.eq('categoria_id', categoriaId)
    }

    const {data, error} = await consulta.order('id', {ascending: true});

    if(error) throw error;
    res.json(data);
}catch (err) {
    next(err);
}
});

// =============================================================
// ── [GET] /api/produtos/:id ───────────────────────────────────
// Busca um produto específico pelo seu ID.
//
// Route Params (parâmetros na rota com :):
//   São acessados via req.params.nomeDoParametro
//   Ex: /api/produtos/1 → req.params.id === "1"
//
// Teste: GET http://localhost:3000/api/produtos/1
// =============================================================
router.get('/:id', async (req, res, next) => {
try{
    const {id} = req.params;
    const{data, error} = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .maybeSingle()

    if (error) throw error;
    if (data){
    res.json(data);
} else {
    res.status(404).json({mensagem: 'não encontrado'});
}
}catch (err) {
    next(err);

}
});

// =============================================================
// ── [POST] /api/produtos ──────────────────────────────────────
// Adiciona um novo produto ao cardápio.
//
// O corpo (body) da requisição deve ser JSON:
//   { "categoriaId": 1, "nome": "Uramaki", "descricao": "...", "preco": 45.00, "imagem": "uramaki.png" }
//
// Status 201 = Created (recurso criado com sucesso)
//
// Teste no Thunder Client:
//   Método: POST
//   URL: http://localhost:3000/api/produtos
//   Body → JSON → cole o body acima
// =============================================================
router.post('/', async (req, res, next) => {
    try{
        const {data, error} = await supabase
        .from('produtos')
        .insert([req.body])
        .select()
        if(error) throw error;
        res.status(201).json(data[0]);

    }catch (err) {
        next(err);
    }

});

// =============================================================
// ── [PUT] /api/produtos/:id ───────────────────────────────────
// Atualiza um produto existente pelo ID.
//
// Body: os campos que deseja alterar, ex:
//   { "preco": 99.90 }
//
// Teste no Thunder Client:
//   Método: PUT
//   URL: http://localhost:3000/api/produtos/1
//   Body → JSON → { "preco": 99.90 }
// =============================================================
router.put('/:id', async (req, res, next) => {
    try{
        const {id} = req.params;
        const {data, error} = await supabase
        .from('produtos')
        .update(req.body)
        .eq('id', id)
        .select();

        if(error) throw error;
        if (data && data.length > 0){
            res.json(data[0]);
        }else{
            res.status(404).json({mensagem: 'não encontrado'});
        }
    }catch (err){
        next(err);
    }

});

// =============================================================
// ── [DELETE] /api/produtos/:id ────────────────────────────────
// Remove um produto do cardápio pelo ID.
//
// Teste no Thunder Client:
//   Método: DELETE
//   URL: http://localhost:3000/api/produtos/2
// =============================================================
router.delete('/:id', async (req, res, next) => {
    try{
        const {id} = req.params;
        const {error} = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

        if(error) throw error;
        res.json({mensagem: 'produto deletado'});
    }catch (err){
        next(err);
    }
});

// ─── Exportação do Router ─────────────────────────────────────
module.exports = router;
