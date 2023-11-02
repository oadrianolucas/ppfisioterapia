const File = require("../models/File");
const multer = require('multer');
const pdf2pic = require("pdf2pic");
const path = require("path");
const fs = require("fs/promises"); // Módulo fs com suporte a promessas

// Configure o armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/assets/files/receipts"); // Pasta de destino para os arquivos enviados
  },
  filename: (req, file, callback) => {
    // Gere um nome de arquivo único para evitar substituições
    const ext = path.extname(file.originalname);
    callback(null, `comprovante_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedFileTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Formato de arquivo não suportado."));
    }
  },
});

const FileController = {
  async createFileFinance(req, res) {
    upload.single('filename')(req, res, async (err) => {
      if (err) {
        console.error("Erro ao fazer o upload do arquivo:", err);
        res.status(500).send("Erro ao fazer o upload do arquivo.");
      } else {
        const { financeId } = req.body;
        try {
          const { filename, path } = req.file;
          await File.create({
            name: filename,
            location: path,
            financeId: financeId,
          });
          res.redirect("/admin/finances");
        } catch (error) {
          console.error("Erro ao criar arquivo:", error);
          res.status(500).send("Erro ao criar arquivo.");
        }
      }
    });
  },

  async deleteFileFinance(req, res) {
    const { fileId } = req.body;
    try {
      const fileToDelete = await File.findByPk(fileId);
      if (!fileToDelete) {
        return res.status(404).send("Arquivo não encontrado.");
      }
      await fs.unlink(fileToDelete.location);
      await File.destroy({
        where: {
          id: fileId,
        },
      });
      res.redirect("/admin/finances");
    } catch (error) {
      console.error("Erro ao excluir arquivo:", error);
      res.status(500).send("Erro ao excluir arquivo.");
    }
  },
};

module.exports = FileController;
