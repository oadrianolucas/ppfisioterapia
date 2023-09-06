const db = require("../database/db")
//const Appointment = require("../models/Appointment")
const EvolutionUser = db.Sequelize.define("evolutionUsers", {
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

//Appointment.hasMany(EvolutionUser)
//EvolutionUser.sync({ force: true })

module.exports = EvolutionUser
