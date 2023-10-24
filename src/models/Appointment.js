const db = require("../database/db")
const Appointment = db.Sequelize.define("appointments", {
  hd: {
    type: db.sequelize.STRING,
  },
  hmp: {
    type: db.sequelize.STRING,
  },
  hma: {
    type: db.sequelize.STRING,
  },
  text: {
    type: db.sequelize.TEXT,
  },
  scheduleId: {
    type: db.sequelize.INTEGER,
  },
})

module.exports = Appointment
