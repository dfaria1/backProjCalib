const express = require('express')
const { check, validationResult } = require("express-validator")
const router = express.Router()
const auth = require('../middleware/auth')
const Produto = require('../model/Produto')
const Grupo = require('../model/Grupo')

const validaProduto = [
    check("codigo", "Código de Barra deve ser numérico e possuir 13 caracteres").isNumeric().isLength({ min: 13, max: 13 }),
    check("nome", "Nome do produto é obrigatório").not().isEmpty(),
    check("preco", "Informe um preço válido").isFloat({ min: 0 }),
    check("validade", "Informe uma data válida").isDate(),
    check("inativo", "Informe o valor true ou false").isBoolean(),
    check("unidade", "A unidade do produto é obrigatória").not().isEmpty(),
    check("grupo", "O grupo do produto é inválido").isMongoId().trim()
]

/*#############################################
* Lista todos os produtos 
*################################################ */
router.get("/", auth, async (req, res) => {
    try {
        
        const produtos = await Produto.find()
                         .sort({ nome: 1 })
                         .populate("grupo", "nome")
        res.json(produtos)
    } catch (err) {
        res.status(500).send({
            errors: [{ message: `Não foi possível obter os produtos! - ${err.message}` }]       
        })
    }
})

/* #############################################
// Lista um produto pelo ID
################################################ */
router.get("/:id", auth, async (req, res) => {
    Produto.findById(req.params.id)
        .then(produto => {
            res.send(produto);
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível obter o produto com o ID ${req.params.id}` }]   });
        })
})

/* #####################################
// Inclui um novo produto
######################################## */
router.post("/", auth, validaProduto,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        //Verifica se o produto já existe
        const { codigo } = req.body
        let produto = await Produto.findOne({ codigo })
        if (produto)
            return res.status(200).json({
                errors: [{ message: "Já existe um produto com o código de barras informado!" }]
            });

        try {
            let produto = new Produto(req.body)
            await produto.save()
            res.send(produto)
        } catch (err) {
            return res.status(500).json({
                errors: [{ message: `Erro ao salvar o produto: ${err.message} ` }]      
            })
        }
    })

/* #####################################
// Apaga o produto pelo ID
######################################## */
router.delete("/:id", auth, async (req, res) => {
    await Produto.findByIdAndRemove(req.params.id)
        .then(produto => {
            res.send({ message: `Produto ${produto.nome} removido com sucesso!` });
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível apagar o produto com o ID ${req.params.id}` }]
            })
        })
})

/* #####################################
// Edita o produto
######################################## */

router.put("/", auth, validaProduto,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        let dados = req.body

        await Produto.findByIdAndUpdate(req.body._id, {
            $set: dados
        }, { new: true })
        .then(produto => {
            res.send({ message: `Produto ${produto.nome} alterado com sucesso!` });
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível alterar o produto com o ID ${req.body._id}` }]
            })
        })
    })

module.exports = router