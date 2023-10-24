const { sequelize } = require("./db")

const Admin = require("../models/Admin")
const Address = require("../models/Address")
const Appointment = require("../models/Appointment")
const Evolution = require("../models/EvolutionUser")
const File = require("../models/File")
const Invoice = require("../models/Invoice")
const InvoiceFile = require("../models/InvoiceFile")
const Schedule = require("../models/Schedule")
const Service = require("../models/Service")
const User = require("../models/User")

Admin.sync({ force: true })
User.sync({ force: true })
Service.sync({ force: true })
File.sync({ force: true })
Invoice.sync({ force: true })

User.hasMany(Address)
Address.sync({ force: true })

User.hasMany(Schedule)
Admin.hasMany(Schedule)
Service.hasMany(Schedule)
Schedule.sync({ force: true })

File.hasMany(InvoiceFile)
Invoice.hasMany(InvoiceFile)
InvoiceFile.sync({ force: true })

Schedule.hasMany(Appointment)
Appointment.sync({ force: true })

Appointment.hasMany(Evolution)
Evolution.sync({ force: true })

async function create() {
    try {
      await sequelize.sync({ force: true }) 
      console.log("Tabelas criadas com sucesso!")
    } catch (error) {
      console.error("Erro ao criar tabelas:", error)
    } finally {
      await sequelize.close()
    }
  }
  
  create()