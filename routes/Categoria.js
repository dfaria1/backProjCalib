const express = require('express')
const { check, validationResult } = require("express-validator")
const router = express.Router()
const auth = require('../middleware/auth')
const Categoria = require('../model/Categoria')

const validaCategoria = [
    check("nome", "Nome da categoria é obrigatório").not().isEmpty(),
    check("status", "Informe um status válido para a categoria!").isIn(['ativo', 'inativo'])
]

/*#############################################
* Lista todas as categorias 
*################################################ */
router.get("/", async (req, res) => {
    try {
        const categorias = await Categoria.find({"status":"ativo"}).sort({ nome: 1 })
        res.json(categorias)
    } catch (err) {
        res.status(500).send({
            errors: [{ message: "Não foi possível obter as categorias!" }]       
        })
    }
})

/* #############################################
// Lista uma categoria pelo ID 
################################################ */
router.get("/:id", auth, async (req, res) => {
    Categoria.findById(req.params.id)
        .then(categoria => {
            res.send(categoria);
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível obter a categoria com o ID ${req.params.id}` }]   });
        })
})

/* #####################################
// Inclui uma nova categoria
######################################## */
router.post("/", auth, validaCategoria,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        //Verifica se o categoria já existe
        const { nome } = req.body
        let categoria = await Categoria.findOne({ nome })
        if (categoria)
            return res.status(200).json({
                errors: [{ message: "Já existe uma categoria com o nome informado!" }]
            });

        try {
            let categoria = new Categoria(req.body)
            await categoria.save()
            res.send(categoria)
        } catch (err) {
            return res.status(500).json({
                errors: [{ message: `Erro ao salvar a categoria: ${err.message} ` }]      
            })
        }
    })

/* #####################################
// Apaga a categoria pelo ID
######################################## */
router.delete("/:id", auth, async (req, res) => {
    await Categoria.findByIdAndRemove(req.params.id)
        .then(categoria => {
            res.send({ message: `Categoria ${categoria.nome} removido com sucesso!` });
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível apagar a categoria com o ID ${req.params.id}` }]
            })
        })
})

/* #####################################
// Edita a categoria
######################################## */

router.put("/", auth, validaCategoria,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        let dados = req.body

        await Categoria.findByIdAndUpdate(req.body._id, {
            $set: dados
        }, { new: true })
        .then(categoria => {
            res.send({ message: `Categoria ${categoria.nome} alterada com sucesso!` });
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível alterar a categoria com o ID ${req.body._id}` }]
            })
        })
    })

module.exports = router