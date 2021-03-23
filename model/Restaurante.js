const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Criando o Schema Restaurante
const RestauranteSchema = mongoose.Schema({
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
    notaMedia: {type: Number},
    categoria:  {type: Schema.Types.ObjectId, ref: 'categoria'},
    faixaPreco: {type: String, enum: ['barato', 'médio','luxo']},
    tempoEntrega: {type: String},
    telefone: {type: String},
    endereco: {
        logradouro: {type: String},
        bairro: {type: String},
        cep: {type: String},
        municipio: {type: String},
        estado: {type: String},
        complemento: {type: String} 
    },
    geoLocalizacao: {
        latitude: {type: Number},
        longitude: {type: Number}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('restaurante', RestauranteSchema);