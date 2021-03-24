const express = require('express')
const router = express.Router()
const multer = require('multer')

//Definindo a pasta padrão
const upload = multer({
    dest: './public/uploads',
  });

/*#############################################
* Processo de Upload
*################################################ */
router.post("/", upload.array('file'), async (req, res) => {
    console.log(`Arquivos recebidos: ${req.files.length}`);
    res.send({
      upload: true,
      files: req.files,
    })
  })

module.exports = router