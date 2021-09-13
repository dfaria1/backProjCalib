//cSpell:Ignore termohigrômetro
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Criamos o schema Padroes (pesos/barômetro/termohigrômetro)
const PadroesSchema = mongoose.Schema({
    descricao: {type: String}, 
    statusPadrao: {
        type: String,
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    },
    tipo: {
        type: String,
        enum: ['Peso Padrão', 'Barômetro', 'Termohigrômetro'],
        default: 'Peso Padrão'
    },
    identificacao: {type: String},
    classeExatidao: {type: String},
    calibracoes: {type: Array}
},
{timestamps: true}
)

module.exports = mongoose.model('padroes',PadroesSchema) //3o parâmetro é o nome da Collection no Mongo (default é pluralizado)
