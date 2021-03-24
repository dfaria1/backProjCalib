const express = require('express')
const { check, validationResult } = require("express-validator")
const router = express.Router()
const auth = require('../middleware/auth')
const Cardapio = require('../model/Cardapio')
const Restaurante = require('../model/Restaurante')

const validaCardapio = [
    check("nome", "Nome do item no cardapio é obrigatório").not().isEmpty(),
    check("restaurante", "O restaurante vinculado ao cardapio é inválido").isMongoId().trim()
]

/*#############################################
* Lista todos os cardapios 
*################################################ */
router.get("/", async (req, res) => {
    try {
        
        const cardapios = await Cardapio.find()
                         .sort({ nome: 1 })
                         .populate("restaurante", "nome")
        res.json(cardapios)
    } catch (err) {
        res.status(500).send({
            errors: [{ message: `Não foi possível obter os cardapios! - ${err.message}` }]       
        })
    }
})

/* #############################################
// Lista um cardapio pelo ID
################################################ */
router.get("/:id", auth, async (req, res) => {
    Cardapio.findById(req.params.id)
        .then(cardapio => {
            res.send(cardapio);
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível obter o cardapio com o ID ${req.params.id}` }]   });
        })
})

/* #############################################
// Lista os cardapios do restaurante
############################################### */
router.get("/restaurante/:id",  async (req, res) => {
    Cardapio.find({"restaurante":req.params.id})
    .sort({ nome: 1 })
    .populate("restaurante", "nome")
        .then(cardapio => {
            res.send(cardapio);
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível obter os cardápios com o restaurante ID ${req.params.id}` }]   });
        })
})

/* #####################################
// Inclui um novo cardapio
######################################## */
router.post("/", validaCardapio,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        //Verifica se o cardapio já existe
        const { nome } = req.body
        let cardapio = await Cardapio.findOne({ nome })
        if (cardapio)
            return res.status(200).json({
                errors: [{ message: "Já existe um prato no cardapio com o nome informado!" }]
            });

        try {
            let cardapio = new Cardapio(req.body)
            await cardapio.save()
            res.send(cardapio)
        } catch (err) {
            return res.status(500).json({
                errors: [{ message: `Erro ao salvar o cardapio: ${err.message} ` }]      
            })
        }
    })

/* #####################################
// Apaga o cardapio pelo ID
######################################## */
router.delete("/:id", auth, async (req, res) => {
    await Cardapio.findByIdAndRemove(req.params.id)
        .then(cardapio => {
            res.send({ message: `Cardapio ${cardapio.nome} removido com sucesso!` });
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível apagar o cardapio com o ID ${req.params.id}` }]
            })
        })
})

/* #####################################
// Edita o cardapio
######################################## */

router.put("/", auth, validaCardapio,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        let dados = req.body

        await Cardapio.findByIdAndUpdate(req.body._id, {
            $set: dados
        }, { new: true })
        .then(cardapio => {
            res.send({ message: `Cardapio ${cardapio.nome} alterado com sucesso!` });
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível alterar o cardapio com o ID ${req.body._id}` }]
            })
        })
    })

module.exports = router