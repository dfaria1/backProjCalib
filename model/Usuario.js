const mongoose = require("mongoose");

const UsuarioSchema = mongoose.Schema({
  nome: { type: String },
  email: { type: String },
  senha: { type: String },
  tipo: { type: String }
},
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'alterado_em' }
  }
);

//Exportando o usuario através do UsuarioSchema
module.exports = mongoose.model("usuario", UsuarioSchema);
