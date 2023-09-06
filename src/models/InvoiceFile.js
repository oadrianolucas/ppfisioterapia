const db = require("../database/db")
/*
const File = require("../models/File")
const Invoice = require("../models/Invoice")
*/
const InvoiceFile = db.Sequelize.define("invoiceFiles", {
  FileId: {
    type: db.sequelize.INTEGER,
  },
  InvoiceId: {
    type: db.sequelize.INTEGER,
  },
})

/*
File.hasMany(InvoiceFile)
Invoice.hasMany(InvoiceFile)
InvoiceFile.sync({ force: true })
*/
module.exports = InvoiceFile
