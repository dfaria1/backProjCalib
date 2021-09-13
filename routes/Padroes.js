const Padrao = require('../model/Padroes')
const express = require('express')
const { check, validationResult } = require("express-validator")
const router = express.Router()
const auth = require('../middleware/auth')

const validaPessoa = [
    check("razaoSocial", "Informe a razão social").not().isEmpty
    //realiza a validação através do express-validator
]

//Lista todos os padrões
router.get("/", auth, async (req, res) => {
    try {

        const padroes = await Padrao.find()
        res.json(padroes)
    } catch (err) {
        res.status(500).send({
            errors: [{ message: `Não foi possível obter os cadastros de padrões! - ${err.message}` }]
        })
    }
})

/**
 * @method - GET
 * @description - Obter informações de um determinado Padrão
 * @param - /pessoas/:id
 */

router.get("/:id", auth, async (req, res) => {
    try {
        // auth garantirá que foi enviado o token.
        const pessoa = await Padrao.findById(req.params.id)
        res.json(pessoa);
    } catch (e) {
        res.send({ mensagem: `Erro ao obter os dados do padrão: ${e.message}` });
    }
});

/**
 * @method - GET
 * @description - Obter informações de uma determinada calibração de um padrão
 * @param - /padroes/calibracoes/:id
 */

 router.get("/calibracoes/:id", auth, async (req, res) => {
    try {
        // auth garantirá que foi enviado o token.
        const mongoose = require("mongoose")
        const ObjectId = mongoose.Types.ObjectId
        const pessoa = await Padrao.aggregate([
            {
                $unwind: '$calibracoes'
            },
            {
                $match: {
                    'calibracoes._id': ObjectId(req.body._id)
                }
            },
            {
                $project: {
                    'calibracoes': 1
                }
            }
        ]);
        res.json(pessoa);
    } catch (e) {
        res.send({ mensagem: `Erro ao obter os dados da calibração: ${e.message}` });
    }
});

//Alterar os dados da calibração informada
router.put('/calibracao', /*validaPessoa,*/
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
        await Padrao.updateOne(
            {
                "calibracoes._id": ObjectId(dados._id)
            },
            {
                $set: {
                    "calibracoes.$.certificado": dados.certificado,
                    "calibracoes.$.laboratorioEmitente": dados.laboratorioEmitente,
                    "calibracoes.$.dataCalibracao": dados.dataCalibracao,
                    "calibracoes.$.validadeCalibracao": dados.validadeCalibracao,
                    "calibracoes.$.valorConvencional": dados.valorConvencional,
                    "calibracoes.$.unidade": dados.unidade,
                    "calibracoes.$.erroInstrumento": dados.erroInstrumento,
                    "calibracoes.$.desvio": dados.desvio,
                    "calibracoes.$.incertezaPadrao": dados.incertezaPadrao,
                    "calibracoes.$.fatorK": dados.fatorK,
                    "calibracoes.$.derivaPadrao": dados.derivaPadrao,
                    "calibracoes.$.tolerancia": dados.tolerancia,
                    "calibracoes.$.aprovado": dados.aprovado,
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

//Alterar os dados do padrão informado
router.put('/', /*validaPessoa,*/
    async (req, res) => {
        /*const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }*/
        let dados = req.body
        await Padrao.findByIdAndUpdate(req.body._id, {
            $set: dados
        }, { new: true })
            .then(padrao => {
                res.send({ message: `${padrao.tipo} ${padrao.identificacao} ${padrao.descricao} alterado com sucesso!` })
            }).catch(err => {
                return res.status(500).send({
                    errors: [{
                        message: `Não foi possível alterar o padrão com o id ${req.body._id}. Erro: ${err}`
                    }]
                })
            })
    })

//=======================================================================================================================================
//================================================== ABAIXO AINDA NÃO FORAM CORRIGIDOS ==================================================
//=======================================================================================================================================



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