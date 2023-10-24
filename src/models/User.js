const db = require("../database/db")
const User = db.Sequelize.define("users", {
  name: {
    type: db.sequelize.STRING,
  },
  birth: {
    type: db.sequelize.STRING,
  },
  phone: {
    type: db.sequelize.STRING,
  },
  cpf: {
    type: db.sequelize.STRING,
  },
  note: {
    type: db.sequelize.STRING,
  },
})

module.exports = User
