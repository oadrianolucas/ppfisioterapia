const db = require("../database/db")
const InvoiceFile = db.Sequelize.define("invoiceFiles", {
  FileId: {
    type: db.sequelize.INTEGER,
  },
  InvoiceId: {
    type: db.sequelize.INTEGER,
  },
})

module.exports = InvoiceFile
