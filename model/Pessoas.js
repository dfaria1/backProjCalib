const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Criamos o schema Pessoas (clientes/fornecedores)
const PessoasSchema = mongoose.Schema({
    razaoSocial: {type: String}, 
    cnpj: { type: String },
    logradouro: {type: String},
    numeroLogradouro: {type: String}, 
    complemento: {type: String},
    bairro: {type: String},
    cep: {type: String},
    cidade: {type: String},
    uf: {type: String},
    email: {type: String},
    telefone: {type: String},
    contato: {type: String},
    fornecedor: {type: Boolean},
    inativo: {type: Boolean}
},
{timestamps: true}
)

module.exports = mongoose.model('pessoas',PessoasSchema) //3o parâmetro é o nome da Collection no Mongo (default é pluralizado)
