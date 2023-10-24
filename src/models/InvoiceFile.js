const db = require("../database/db")
const InvoiceFile = db.Sequelize.define("invoiceFiles", {
  fileId: {
    type: db.sequelize.INTEGER,
  },
  invoiceId: {
    type: db.sequelize.INTEGER,
  },
})

module.exports = InvoiceFile
