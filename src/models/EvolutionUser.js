const db = require("../database/db")
const Evolution = db.Sequelize.define("evolutions", {
  date: {
    type: db.sequelize.STRING,
  },
  pa: {
    type: db.sequelize.STRING,
  },
  painUser: {
    type: db.sequelize.STRING,
  },
  conduct: {
    type: db.sequelize.STRING,
  },
  evolution: {
    type: db.sequelize.STRING,
  },
  appointmentId: {
    type: db.sequelize.INTEGER,
  },
})

module.exports = Evolution
