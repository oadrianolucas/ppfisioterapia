const db = require("../database/db")
// const User = require("../models/User")
const Address = db.Sequelize.define("address", {
  zipcode: {
    type: db.sequelize.STRING,
  },
  address: {
    type: db.sequelize.STRING,
  },
  district: {
    type: db.sequelize.STRING,
  },
  city: {
    type: db.sequelize.STRING,
  },
  state: {
    type: db.sequelize.STRING,
  },
  number: {
    type: db.sequelize.STRING,
  },
  userId: {
    type: db.sequelize.INTEGER,
  },
})

//User.hasMany(Address)
//Address.sync({ force: true })

module.exports = Address
