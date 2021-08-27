const mongoose = require("mongoose");

const UsuarioSchema = mongoose.Schema({
  nome: { type: String },
  email: { type: String },
  senha: { type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['admin', 'profissional'],
    default: 'profissional'
  }
},
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'alterado_em' }
  }
);

//Exportando o usuario através do UsuarioSchema
module.exports = mongoose.model("usuario", UsuarioSchema);
