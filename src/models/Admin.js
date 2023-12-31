const db = require("../database/db")
const Admin = db.Sequelize.define("admins", {
  name: {
    type: db.sequelize.STRING,
  },
  coffito: {
    type: db.sequelize.STRING,
  },
  email: {
    type: db.sequelize.STRING,
  },
  password: {
    type: db.sequelize.STRING,
  },
  filter: {
    type: db.sequelize.STRING,
  },
})

module.exports = Admin
