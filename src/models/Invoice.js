const db = require("../database/db")
const Invoice = db.Sequelize.define("invoices", {
  mode: {
    type: db.sequelize.STRING,
  },
  type: {
    type: db.sequelize.STRING,
  },
  value: {
    type: db.sequelize.INTEGER,
  },
  date: {
    type: db.sequelize.STRING,
  },
  status: {
    type: db.sequelize.STRING,
  },
})


module.exports = Invoice
