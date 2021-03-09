const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Usuario = require("../model/Usuario");

//https://medium.com/tableless/entendendo-tokens-jwt-json-web-token-413c6d1397f6

/**
 * @method - POST
 * @param - /usuarios/new
 * @description - Novo Usuário
 */

router.post(
  "/new",
  [
    check("nome", "Informe o nome do usuário").not().isEmpty(),
    check("email", "Informe um e-mail válido").isEmail(),
    check("senha", "Informe uma senha com no mínimo 6 caracteres").isLength({ min: 6 }),
    check("tipo", "Informe um tipo de usuário válido!").isIn(['admin', 'usuario'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const { email, senha } = req.body;
    try {
      let usuario = await Usuario.findOne({email});
      if (usuario) {
        return res.status(400).json({
          errors: [{ msg: `O e-mail informado já existe em outro usuário!` }]
        });
      }

      usuario = new Usuario(req.body);
      
      //Faremos a criptografia da senha
      const salt = await bcrypt.genSalt(10); //impede que uma mesma senha tenha resultados iguais
      usuario.senha = await bcrypt.hash(senha, salt);

      await usuario.save();
      //O Payload é um objeto JSON com as Claims (informações) da entidade tratada, normalmente o usuário autenticado.
      const payload = {
        usuario: {
          id: usuario._id
        }
      };

      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: process.env.EXPIRES_IN
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            access_token: token,
            usuario: {
              id: usuario._id,
              nome: usuario.nome,
              tipo: usuario.tipo
            }
          });
        }
      );
    } catch (err) {
      return res.status(500).json({
        errors: [{ msg: `Erro ao salvar o usuário: ${err.message}` }]
      });
    }
  }
);

/**
 * @method - POST
 * @param - /usuario/login
 * @description - Login do usuário
 */
router.post(
  "/login",
  [
    check("email", "Por favor, informe um e-mail válido").isEmail(),
    check("senha", "Informe uma senha com no mínimo 6 caracteres").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        errors: errors.array()
      });
    }

    const { email, senha } = req.body;
    try {
      let usuario = await Usuario.findOne({
        email
      });
      if (!usuario)
        return res.status(200).json({
          errors: [{ msg: "Não existe nenhum usuário com o e-mail informado!" }]
        });

      const isMatch = await bcrypt.compare(senha, usuario.senha);
      if (!isMatch)
        return res.status(200).json({
          errors: [{ msg: "A senha informada está incorreta !" }]
        });

      const payload = {
        usuario: {
          id: usuario.id
        }
      };

      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: process.env.EXPIRES_IN
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            access_token: token,
            usuario: {
              id: usuario._id,
              nome: usuario.nome,
              tipo: usuario.tipo
            }
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        errors: [{ msg: `Erro no Servidor: ${e.message}` }]
      });
    }
  }
);

/**
 * @method - POST
 * @description - Obter informações do usuário atual
 * @param - /usuarios/access-token
 */

router.post("/access-token",  async (req, res) => {
  try {
    // O token é enviado junto com a requisição
    const { access_token } = req.body
    const decoded = jwt.verify(access_token, process.env.SECRET_KEY);
    const id = decoded.usuario.id
    try {
      const usuario = await Usuario.findById(id);
      res.status(200).json({
        access_token: access_token,
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          tipo: usuario.tipo
        }
      });
    } catch (err) {
      res.status(500).send({
        message: `Erro ao obter as informações do Usuário. Erro:${err.message}`
      });
    }
  } catch (e) {
    res.send(`Erro ao obter o token do usuário: ${e.message}`);
  }
});

module.exports = router;
