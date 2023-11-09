const db = require("../database/db")
const Evolution = db.Sequelize.define("evolutions", {
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
  scheduleId: {
    type: db.sequelize.INTEGER,
  },
})

module.exports = Evolution
