const db = require("../database/db")
const Schedule = db.Sequelize.define("schedules", {
  date: {
    type: db.sequelize.STRING,
  },
  hours: {
    type: db.sequelize.STRING,
  },
  desc: {
    type: db.sequelize.STRING,
  },
  status: {
    type: db.sequelize.INTEGER,
  },
  userId: {
    type: db.sequelize.INTEGER,
  },
  adminId: {
    type: db.sequelize.INTEGER,
  },
  serviceId: {
    type: db.sequelize.INTEGER,
  },
})

module.exports = Schedule
