const Pessoa = require('../model/Pessoas')
const express = require('express')
const { check, validationResult } = require("express-validator")
const router = express.Router()
const auth = require('../middleware/auth')
//const Produto = require('../model/Produto')

const validaPessoa = [
    check("razaoSocial", "Informe a razão social").not().isEmpty
    //realiza a validação através do express-validator
]

//Lista todas as pessoas
router.get("/", auth, async (req, res) => {
    try {

        const pessoas = await Pessoa.find()
        res.json(pessoas)
    } catch (err) {
        res.status(500).send({
            errors: [{ message: `Não foi possível obter os cadastros de pessoas! - ${err.message}` }]
        })
    }
})

/**
 * @method - GET
 * @description - Obter informações de uma determinada pessoa
 * @param - /pessoas/:id
 */

router.get("/:id", auth, async (req, res) => {
    try {
        // auth garantirá que foi enviado o token.
        const pessoa = await Pessoa.findById(req.params.id)
        res.json(pessoa);
    } catch (e) {
        res.send({ mensagem: `Erro ao obter os dados da pessoa: ${e.message}` });
    }
});

/**
 * @method - GET
 * @description - Obter informações de um determinado equipamento
 * @param - /pessoas/equipamento/:id
 */

router.get("/equipamento/:id", auth, async (req, res) => {
    try {
        // auth garantirá que foi enviado o token.
        const mongoose = require("mongoose")
        const ObjectId = mongoose.Types.ObjectId
        const pessoa = await Pessoa.aggregate([
            {
                $unwind: '$equipamentos'
            },
            {
                $match: {
                    'equipamentos._id': ObjectId(req.body._id)
                }
            },
            {
                $project: {
                    'equipamentos': 1
                }
            }
        ]);
        res.json(pessoa);
    } catch (e) {
        res.send({ mensagem: `Erro ao obter os dados do equipamento: ${e.message}` });
    }
});


//Inclui nova pessoa
router.post("/", auth, /*validaPessoa,*/
    async (req, res) => {
        /*const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }*/
        //Verifica se o CNPJ já existe
        const { cnpj } = req.body
        let pessoa = await Pessoa.findOne({ cnpj })
        if (pessoa)
            return res.status(200).json({
                errors: [{ message: "Já existe uma empresa cadastrada com o CNPJ informado!" }]
            });

        try {
            let pessoa = new Pessoa(req.body)
            await pessoa.save()
            res.send(pessoa)
        } catch (err) {
            return res.status(500).json({
                errors: [{ message: `Erro ao salvar a pessoa: ${err.message} ` }]
            })
        }
    });


//Alterar os dados da pessoa informada
router.put('/', /*validaPessoa,*/
    async (req, res) => {
        /*const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }*/
        let dados = req.body
        await Pessoa.findByIdAndUpdate(req.body._id, {
            $set: dados
        }, { new: true })
            .then(pessoa => {
                res.send({ message: `Pessoa ${pessoa.razaoSocial} alterada com sucesso!` })
            }).catch(err => {
                return res.status(500).send({
                    errors: [{
                        message: `Não foi possível alterar a pessoa com o id ${req.body._id}. Erro: ${err}`
                    }]
                })
            })
    })

//Alterar os dados do equipamento informado
router.put('/equipamento', /*validaPessoa,*/
    async (req, res) => {
        /*const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }*/
        let dados = req.body
        const mongoose = require("mongoose")
        const ObjectId = mongoose.Types.ObjectId
        await Pessoa.updateOne(
            {
                "equipamentos._id": ObjectId(dados._id)
            },
            {
                $set: {
                    "equipamentos.$.nSerie": dados.nSerie,
                    "equipamentos.$.marca": dados.marca,
                    "equipamentos.$.modelo": dados.modelo,
                    "equipamentos.$.tipo": dados.tipo,
                    "equipamentos.$.capacidade": dados.capacidade,
                    "equipamentos.$.divisao": dados.divisao,
                    "equipamentos.$.cargaMin": dados.cargaMin,
                    "equipamentos.$.unidade": dados.unidade,
                    "equipamentos.$.tag": dados.tag,
                    "equipamentos.$.local": dados.local
                }
            }, { new: true })
            .then(equipamentos => {
                res.send({ message: `Equipamento ${dados._id} alterado com sucesso!` })
            }).catch(err => {
                return res.status(500).send({
                    errors: [{
                        message: `Não foi possível alterar a pessoa com o id ${req.body._id}. Erro: ${err}`
                    }]
                })
            })
    })


//Adicionar um novo equipamento para a pessoa informada
router.put('/equipamento/novo', /*validaPessoa,*/
    async (req, res) => {
        /*const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }*/
        let dados = req.body
        const mongoose = require("mongoose")
        const ObjectId = mongoose.Types.ObjectId
        await Pessoa.updateOne(
            {
                "_id": ObjectId(dados._id)
            },
            {
                $push: {
                    equipamentos: {
                        _id: ObjectId(),
                        nSerie: dados.nSerie,
                        marca: dados.marca,
                        modelo: dados.modelo,
                        tipo: dados.tipo,
                        capacidade: dados.capacidade,
                        divisao: dados.divisao,
                        cargaMin: dados.cargaMin,
                        casasDecimais: dados.casasDecimais,
                        unidade: dados.unidade,
                        tag: dados.tag,
                        local: dados.local
                    }
                }
            })
            .then(pessoa => {
                res.send({ message: `Pessoa ${JSON.stringify(pessoa)} alterada com sucesso!` })
            }).catch(err => {
                return res.status(500).send({
                    errors: [{
                        message: `Não foi possível alterar a pessoa com o id ${req.body._id}. Erro: ${err}`
                    }]
                })
            })
    })

module.exports = router