const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Criamos o schema Produto
const ProdutoSchema = mongoose.Schema({
    codigo: {type: String},
    nome: {type: String}, 
    preco: { type: Number },
    validade: {type: Date},
    descricao: {type: String}, 
    inativo: {type: Boolean},
    unidade: {type: String},
    grupo: {type: Schema.Types.ObjectId, ref: 'grupo'}
},
{timestamps: true}
)

module.exports = mongoose.model('produto',ProdutoSchema) //3o parâmetro é o nome da Collection no Mongo (default é pluralizado)
