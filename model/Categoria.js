const mongoose = require('mongoose');

//Criando o Schema Categoria
const CategoriaSchema = mongoose.Schema({
    "nome": {
        type: String,
        unique: true, //Criamos um índice único
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('categoria', CategoriaSchema);

/*
[
        {
            "nome": "Prato Feito",
            "status": "ativo"
        },
        {
            "nome": "Massas",
            "status": "ativo"
        },
        {
            "nome": "Lanches",
            "status": "ativo"
        },
        {
            "nome": "Saladas",
            "status": "ativo"
        },
        {
            "nome": "Burgers",
            "status": "ativo"
        },
        {
            "nome": "Pizza",
            "status": "ativo"
        },
        {
            "nome": "Porções",
            "status": "ativo"
        },
        {
            "nome": "Sushi",
            "status": "ativo"
        },
        {
            "nome": "Sobremesas",
            "status": "ativo"
        },
        {
            "nome": "Sucos",
            "status": "ativo"
        },
        {
            "nome": "Açai",
            "status": "inativo"
        }

    ]

*/

