const db = require("../database/db")
const File = db.Sequelize.define("files", {
  name: {
    type: db.sequelize.STRING,
  },
  location: {
    type: db.sequelize.STRING,
  },
  financeId:{
    type: db.sequelize.INTEGER
  }
})

module.exports = File
