const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Criando o Schema Cardapio
const CardapioSchema = mongoose.Schema({
    nome: {
        type: String,
        unique: true //Criamos um índice único
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    },
    foto: { type: Buffer, contentType: String}, /*Para converter a foto: https://www.base64-image.de/ */
    descricao: {type: String },
    calorias:  {type: Number },
    preco:  {type: Number },
    restaurante:  {type: Schema.Types.ObjectId, ref: 'restaurante'},
}, {
    timestamps: true
});

module.exports = mongoose.model('cardapio', CardapioSchema);

