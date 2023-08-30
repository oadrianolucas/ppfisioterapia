const db = require("../database/db")
// const Schedule = require("../models/Schedule")
const Consult = db.Sequelize.define("consults", {
  name: {
    type: db.sequelize.STRING,
  },
})
// Associações entre modelos
//Schedule.hasMany(Consult)

//Consult.sync({ force: true })

module.exports = Consult
