const db = require("../database/db")
const Service = db.Sequelize.define("services", {
  name: {
    type: db.sequelize.STRING,
  },
})


module.exports = Service
