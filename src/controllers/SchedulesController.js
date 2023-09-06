const Schedule = require("../models/Schedule")
const Admin = require("../models/Admin")
const Service = require("../models/Service")
const User = require("../models/User")
const moment = require("moment")
const sequelize = require("sequelize")

const SchedulesController = {
  async viewSchedule(req, res) {
    try {
      const [users, services, admins] = await Promise.all([
        User.findAll(),
        Service.findAll(),
        Admin.findAll(),
      ])
      res.render("admin/schedule/create", {
        admins: admins.map((admin) => admin.toJSON()),
        services: services.map((service) => service.toJSON()),
        users: users.map((user) => user.toJSON()),
      })
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      res.status(500).send("Erro ao buscar dados.")
    }
  },

  async createSchedule(req, res) {
    const { date, hours, type, desc, userId, adminId, serviceId } = req.body
    const formattedDate = moment(date, "YYYY-MM-DD").format("DD/MM/YYYY")

    try {
      const existingSchedule = await Schedule.findOne({
        where: {
          date: formattedDate,
          hours: hours,
        },
      })

      if (existingSchedule) {
        req.flash("error_msg", "Horário já cadastrado para essa data.")
        return res.redirect("/admin/schedules")
      }

      await Schedule.create({
        date: formattedDate,
        hours: hours,
        type: type,
        desc: desc,
        status: 0,
        userId: userId,
        adminId: adminId,
        serviceId: serviceId,
      })
      req.flash("success_msg", "Consulta agendada com sucesso.")
      res.redirect("/admin/schedules")
    } catch (error) {
      console.error("Erro ao criar agendamento:", error)
      res.status(500).send("Erro ao criar agendamento.")
    }
  },

  async findSchedule(req, res) {
    try {
      const schedules = await Schedule.findAll({})
      const scheduleList = []

      if (schedules.length === 0) {
        return res.render("admin/schedule/schedules", { schedules: [] })
      }

      for (const schedule of schedules) {
        const scheduleData = schedule.toJSON()
        const userData = await getData(scheduleData.userId, User)
        const adminData = await getData(scheduleData.adminId, Admin)
        const serviceData = await getData(scheduleData.serviceId, Service)

        scheduleList.push({
          id: scheduleData.id,
          date: scheduleData.date,
          hours: scheduleData.hours,
          desc: scheduleData.desc,
          user: userData,
          admin: adminData,
          service: serviceData,
        })
      }

      res.render("admin/schedule/schedules", { schedules: scheduleList })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async deleteSchedule(req, res) {
    const { id } = req.body
    try {
      const schedule = await Schedule.findByPk(id)

      if (!schedule) {
        req.flash("error_msg", "Agendamento não encontrado.")
        return res.redirect("/admin/schedules")
      }

      await schedule.destroy()

      req.flash("success_msg", "Agendamento excluído com sucesso.")
      res.redirect("/admin/schedules")
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error)
      res.status(500).send("Erro ao excluir agendamento.")
    }
  },

  async viewScheduleOne(req, res) {
    const scheduleId = req.params.id
    try {
      const schedule = await Schedule.findByPk(scheduleId)
      const [users, services, admins] = await Promise.all([
        User.findAll(),
        Service.findAll(),
        Admin.findAll(),
      ])

      if (!schedule) {
        req.flash("error_msg", "Agendamento não encontrado.")
        return res.redirect("/admin/schedules")
      }

      const scheduleData = schedule.toJSON()
      const userData = await getData(scheduleData.userId, User)
      const adminData = await getData(scheduleData.adminId, Admin)
      const serviceData = await getData(scheduleData.serviceId, Service)

      const scheduleDetails = {
        id: scheduleData.id,
        date: scheduleData.date,
        hours: scheduleData.hours,
        desc: scheduleData.desc,
        user: userData,
        admin: adminData,
        service: serviceData,
        serviceId: scheduleData.serviceId,
        userId: scheduleData.userId,
        adminId: scheduleData.adminId,
      }

      res.render("admin/schedule/view", {
        schedule: scheduleDetails,
        admins: admins.map((admin) => admin.toJSON()),
        services: services.map((service) => service.toJSON()),
        users: users.map((user) => user.toJSON()),
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async editSchedule(req, res) {
    const scheduleId = req.params.id
    const { date, hours, type, desc, status, userId, adminId, serviceId } =
      req.body

    try {
      const schedule = await Schedule.findByPk(scheduleId)

      if (!schedule) {
        req.flash("error_msg", "Agendamento não encontrado.")
        return res.redirect("/admin/schedules")
      }

      // Check for existing schedule with the same date and hours
      const existingSchedule = await Schedule.findOne({
        where: {
          date: date,
          hours: hours,
        },
      })

      if (existingSchedule) {
        req.flash("error_msg", "Já existe um agendamento nesse horário.")
        return res.redirect(`/admin/view/schedule/${scheduleId}`)
      }

      schedule.date = date
      schedule.hours = hours
      schedule.type = type
      schedule.desc = desc
      schedule.status = status
      schedule.userId = userId
      schedule.adminId = adminId
      schedule.serviceId = serviceId

      await schedule.save()

      req.flash("success_msg", "Agendamento atualizado com sucesso.")
      res.redirect("/admin/schedules")
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  async searchSchedules(req, res) {
    try {
      const { term } = req.query
      const Op = sequelize.Op

      const termsFilter = {
        date: {
          [Op.like]: `%${term}%`,
        },
      }

      const schedules = await Schedule.findAll({
        where: termsFilter,
      })

      const scheduleList = []

      for (const schedule of schedules) {
        const scheduleData = schedule.toJSON()
        const userData = await getData(scheduleData.userId, User)
        const adminData = await getData(scheduleData.adminId, Admin)
        const serviceData = await getData(scheduleData.serviceId, Service)

        scheduleList.push({
          id: scheduleData.id,
          date: scheduleData.date,
          hours: scheduleData.hours,
          desc: scheduleData.desc,
          user: userData,
          admin: adminData,
          service: serviceData,
        })
      }

      res.render("admin/schedule/schedules", { schedules: scheduleList })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

async function getData(id, model) {
  const data = await model.findByPk(id)
  return data ? data.name : "N/A"
}

module.exports = SchedulesController
