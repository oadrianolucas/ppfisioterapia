const { Sequelize } = require("./db")
const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin")
const Address = require("../models/Address")
const Appointment = require("../models/Appointment")
const Evolution = require("../models/Evolution")
const File = require("../models/File")
const Invoice = require("../models/Invoice")
const InvoiceFile = require("../models/InvoiceFile")
const Schedule = require("../models/Schedule")
const Service = require("../models/Service")
const User = require("../models/User")

File.hasMany(InvoiceFile)
Appointment.hasMany(Evolution)
User.hasMany(Address)
User.hasMany(Schedule)
Admin.hasMany(Schedule)
Service.hasMany(Schedule)
Invoice.hasMany(InvoiceFile)
Schedule.hasMany(Appointment)

async function create() {
    try {
      await Sequelize.sync({ force: true }) 
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync("password", salt)
      await Admin.create({
        name: "Admin",
        email: "admin@ppfisioterapia.com",
        password: hash,
        filter: "1",
      }); 
      console.log("Tabelas criadas com sucesso!")
    } catch (error) {
      console.error("Erro ao criar tabelas:", error)
    } finally {
      await Sequelize.close()
    }
  }
  
create()