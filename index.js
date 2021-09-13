// cSpell:Ignore usuario, versao   
require('dotenv').config()
const express = require("express")
const InicializaMongoServer = require("./config/db")
//Definindo as rotas da aplicação
const rotasUsuario = require("./routes/Usuario")
const rotasGrupo = require('./routes/Grupo')
const rotasProduto = require('./routes/Produto')
const rotasCategoria = require('./routes/Categoria')
const rotasRestaurante = require('./routes/Restaurante')
const rotasCardapio = require('./routes/Cardapio')
const rotasUpload = require('./routes/Upload')
const rotasPessoa = require('./routes/Pessoas')
const rotasPadrao = require('./routes/Padroes')
//const Pessoas = require('./model/Pessoas')

// Inicializamos o servidor MongoDb. Realizamos esta inicialização primeiro pois é externa e demora mais e é realizada de forma assíncrona
InicializaMongoServer();

const app = express();

// Porta Default
const PORT = process.env.PORT || 4000;



// Exemplo de Middleware 
app.use(function(req, res, next) {
   // Em produção, remova o '*' e atualize com o domínio do seu app
  res.setHeader("Access-Control-Allow-Origin", '*');
  // Cabeçalhos que serão permitidos
  //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-token");
  res.setHeader("Access-Control-Allow-Headers", "*");
  // Métodos que serão permitidos
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();  
});

// parse application/json
app.use(express.json())


app.get("/", (req, res) => {
  const languages = req.headers['accept-language']
  res.json({ message: "👏 API 100% funcional!", 
             version: "1.1.01",
             languages: languages })

})

/* Rotas do Usuário */
app.use("/usuarios", rotasUsuario)
/* Rotas do Grupo */
app.use("/grupos", rotasGrupo)
/* Rotas do Produto */
app.use("/produtos", rotasProduto)
/* Rotas da Categoria */
app.use("/categorias", rotasCategoria)
/* Rotas do Restaurante */
app.use("/restaurantes", rotasRestaurante)
/* Rotas do Cardápio */
app.use("/cardapios", rotasCardapio)
/* Rotas de Upload */
app.use("/upload", rotasUpload)
/* Rotas do conteúdo público */
app.use('/public', express.static('public'))
/* Rotas da Pessoa */
app.use("/pessoas", rotasPessoa)
/* Rotas do Padrão */
app.use("/padroes", rotasPadrao)

/* A rota para tratar o erro 404 deve obrigatoriamente ser a última */
app.use(function(req, res, next) {
  res.status(404).json({message: `Desculpe, a rota ${req.originalUrl} não existe`});
});

app.listen(PORT, (req, res) => {
  console.log(`🖥️ Servidor iniciado na porta ${PORT}`);
});


