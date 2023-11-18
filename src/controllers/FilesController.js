const File = require("../models/File")
const multer = require("multer")
const path = require("path")
const fs = require("fs/promises")

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/assets/files/receipts")
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname)
    callback(null, `arquivo_${Date.now()}${ext}`)
  },
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (allowedFileTypes.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(new Error("Formato de arquivo não suportado."))
    }
  },
})

const FileController = {
  async createFile(req, res) {
    upload.single("filename")(req, res, async (err) => {
      if (err) {
        console.error("Erro ao fazer o upload do arquivo:", err)
        res.status(500).send("Erro ao fazer o upload do arquivo.")
      } else {
        const { userId } = req.body
        try {
          const { filename, path } = req.file
          await File.create({
            name: filename,
            location: path,
            userId: userId,
          })
          res.redirect("/admin/users")
        } catch (error) {
          console.error("Erro ao criar arquivo:", error)
          res.status(500).send("Erro ao criar arquivo.")
        }
      }
    })
  },

  async deleteFile(req, res) {
    const { fileId } = req.body
    try {
      const fileToDelete = await File.findByPk(fileId)
      if (!fileToDelete) {
        return res.status(404).send("Arquivo não encontrado.")
      }
      await fs.unlink(fileToDelete.location)
      await File.destroy({
        where: {
          id: fileId,
        },
      })
      res.redirect("/admin/users")
    } catch (error) {
      console.error("Erro ao excluir arquivo:", error)
      res.status(500).send("Erro ao excluir arquivo.")
    }
  },
}

module.exports = FileController
