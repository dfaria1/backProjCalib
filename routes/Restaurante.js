const express = require('express')
const { check, validationResult } = require("express-validator")
const router = express.Router()
const auth = require('../middleware/auth')
const Restaurante = require('../model/Restaurante')
const Categoria = require('../model/Categoria')

const validaRestaurante = [
    check("nome", "Nome do restaurante é obrigatório").not().isEmpty(),
    check("categoria", "A categoria do restaurante é inválida").isMongoId().trim()
]

/*#############################################
* Lista todos os restaurantes 
*################################################ */
router.get("/", async (req, res) => {
    try {
        
        const restaurantes = await Restaurante.find()
                         .sort({ nome: 1 })
                         .populate("categoria", "nome")
        res.json(restaurantes)
    } catch (err) {
        res.status(500).send({
            errors: [{ message: `Não foi possível obter os restaurantes! - ${err.message}` }]       
        })
    }
})

/* #############################################
// Lista um restaurante pelo ID
################################################ */
router.get("/:id", auth, async (req, res) => {
    Restaurante.findById(req.params.id)
        .then(restaurante => {
            res.send(restaurante);
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível obter o restaurante com o ID ${req.params.id}` }]   });
        })
})

/* #############################################
// Lista os restaurante pela categoria
############################################### */
router.get("/categoria/:id",  async (req, res) => {
    Restaurante.find({"categoria":req.params.id})
    .sort({ nome: 1 })
    .populate("categoria", "nome")
        .then(restaurante => {
            res.send(restaurante);
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível obter os restaurantes com a categoria ID ${req.params.id}` }]   });
        })
})

/* #####################################
// Inclui um novo restaurante
######################################## */
router.post("/", validaRestaurante,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        //Verifica se o restaurante já existe
        const { nome } = req.body
        let restaurante = await Restaurante.findOne({ nome })
        if (restaurante)
            return res.status(200).json({
                errors: [{ message: "Já existe um restaurante com o nome informado!" }]
            });

        try {
            let restaurante = new Restaurante(req.body)
            await restaurante.save()
            res.send(restaurante)
        } catch (err) {
            return res.status(500).json({
                errors: [{ message: `Erro ao salvar o restaurante: ${err.message} ` }]      
            })
        }
    })

/* #####################################
// Apaga o restaurante pelo ID
######################################## */
router.delete("/:id", auth, async (req, res) => {
    await Restaurante.findByIdAndRemove(req.params.id)
        .then(restaurante => {
            res.send({ message: `Restaurante ${restaurante.nome} removido com sucesso!` });
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível apagar o restaurante com o ID ${req.params.id}` }]
            })
        })
})

/* #####################################
// Edita o restaurante
######################################## */

router.put("/", auth, validaRestaurante,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        let dados = req.body

        await Restaurante.findByIdAndUpdate(req.body._id, {
            $set: dados
        }, { new: true })
        .then(restaurante => {
            res.send({ message: `Restaurante ${restaurante.nome} alterado com sucesso!` });
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível alterar o restaurante com o ID ${req.body._id}` }]
            })
        })
    })

module.exports = router