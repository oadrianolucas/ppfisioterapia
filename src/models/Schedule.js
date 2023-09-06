const db = require("../database/db")
/*
const Admin = require("../models/Admin")
const User = require("../models/User")
const Service = require("../models/Service")
*/
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
/*
User.hasMany(Schedule)
Admin.hasMany(Schedule)
Service.hasMany(Schedule)

Schedule.sync({ force: true })
*/
module.exports = Schedule
