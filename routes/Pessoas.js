const Pessoa = require('../model/Pessoas')
const express = require('express')
const { check, validationResult } = require("express-validator")
const router = express.Router()
const auth = require('../middleware/auth')
//const Produto = require('../model/Produto')

const validaPessoa = [
    check("razaoSocial","Informe a razão social").not().isEmpty
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
    })

module.exports = router