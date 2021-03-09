const express = require('express')
const { check, validationResult } = require("express-validator")
const router = express.Router()
const auth = require('../middleware/auth')
const Grupo = require('../model/Grupo')

const validaGrupo = [
    check("nome", "Nome do grupo é obrigatório").not().isEmpty(),
    check("status", "Informe um status válido para o grupo!").isIn(['ativo', 'inativo'])
]

/*#############################################
* Lista todos os grupos 
*################################################ */
router.get("/", auth, async (req, res) => {
    try {
        const grupos = await Grupo.find().sort({ nome: 1 })
        res.json(grupos)
    } catch (err) {
        res.status(500).send({
            errors: [{ message: "Não foi possível obter os grupos!" }]       
        })
    }
})

/* #############################################
// Lista um grupo pelo ID 
################################################ */
router.get("/:id", auth, async (req, res) => {
    Grupo.findById(req.params.id)
        .then(grupo => {
            res.send(grupo);
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível obter o grupo com o ID ${req.params.id}` }]   });
        })
})

/* #####################################
// Inclui um novo grupo
######################################## */
router.post("/", auth, validaGrupo,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        //Verifica se o grupo já existe
        const { nome } = req.body
        let grupo = await Grupo.findOne({ nome })
        if (grupo)
            return res.status(200).json({
                errors: [{ message: "Já existe um grupo com o nome informado!" }]
            });

        try {
            let grupo = new Grupo(req.body)
            await grupo.save()
            res.send(grupo)
        } catch (err) {
            return res.status(500).json({
                errors: [{ message: `Erro ao salvar o grupo: ${err.message} ` }]      
            })
        }
    })

/* #####################################
// Apaga o grupo pelo ID
######################################## */
router.delete("/:id", auth, async (req, res) => {
    await Grupo.findByIdAndRemove(req.params.id)
        .then(grupo => {
            res.send({ message: `Grupo ${grupo.nome} removido com sucesso!` });
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível apagar o grupo com o ID ${req.params.id}` }]
            })
        })
})

/* #####################################
// Edita o grupo
######################################## */

router.put("/", auth, validaGrupo,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        let dados = req.body

        await Grupo.findByIdAndUpdate(req.body._id, {
            $set: dados
        }, { new: true })
        .then(grupo => {
            res.send({ message: `Grupo ${grupo.nome} alterado com sucesso!` });
        }).catch(err => {
            return res.status(500).send({
                errors: [{ message: `Não foi possível alterar o grupo com o ID ${req.body._id}` }]
            })
        })
    })

module.exports = router