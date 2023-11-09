const db = require("../database/db")
const Finance = db.Sequelize.define("finances", {
  type: {
    type: db.sequelize.INTEGER,
  },
  date: {
    type: db.sequelize.STRING,
  },
  value: {
    type: db.sequelize.FLOAT,
  },
  category: {
    type: db.sequelize.INTEGER,
  },
  description: {
    type: db.sequelize.STRING,
  },
  userId: {
    type: db.sequelize.INTEGER,
  },
  adminId: {
    type: db.sequelize.INTEGER,
  },
})

module.exports = Finance
