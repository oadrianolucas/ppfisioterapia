const Appointment = require("../models/Appointment")
const Schedule = require("../models/Schedule")
const User = require("../models/User")

const AppointmentsController = {
  async viewCreate(req, res) {
    try {
      const [schedules] = await Promise.all([Schedule.findAll()])
      res.render("admin/appointment/create", {
        schedules: schedules.map((schedule) => schedule.toJSON()),
      })
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      res.status(500).send("Erro ao buscar dados.")
    }
  },
  async viewAppointment(req, res) {
    const id = req.params.id
    const [schedules] = await Promise.all([Schedule.findAll()])
    try {
      const appointment = await Appointment.findByPk(id)

      if (!appointment) {
        return res.status(404).send("Agendamento não encontrado.")
      }

      const result = { ...appointment.toJSON() }

      if (appointment.scheduleId) {
        const schedule = await Schedule.findByPk(appointment.scheduleId)

        if (schedule) {
          result.schedule = schedule.toJSON()

          if (schedule.userId) {
            const user = await User.findByPk(schedule.userId)
            result.schedule.user = user ? user.toJSON() : null
          }
        }
      }
      res.render("admin/appointment/view", {
        schedules: schedules.map((schedule) => schedule.toJSON()),
        appointment: result,
      })
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      res.status(500).send("Erro ao buscar dados.")
    }
  },

  async createAppointment(req, res) {
    const { hd, hmp, hma, text, scheduleId } = req.body
    try {
      await Appointment.create({
        hd: hd,
        hmp: hmp,
        hma: hma,
        text: text,
        scheduleId: scheduleId,
      })
      res.redirect("/admin/appointments")
    } catch (error) {
      res.send("Erro ao criar consulta: " + error)
    }
  },
  async fistAppointment(req, res) {
    try {
      const appointments = await Appointment.findAll()
      const appointmentsWithSchedulesAndUsers = await Promise.all(
        appointments.map(async (appointment) => {
          const result = { ...appointment.toJSON() }
          if (appointment.scheduleId) {
            const schedule = await Schedule.findOne({
              where: { id: appointment.scheduleId },
            })
            result.schedule = schedule ? schedule.toJSON() : null
            if (schedule && schedule.userId) {
              const user = await User.findOne({
                where: { id: schedule.userId },
              })
              result.schedule.user = user ? user.toJSON() : null
            }
          }
          return result
        })
      )
      res.render("admin/appointment/appointments", {
        appointments: appointmentsWithSchedulesAndUsers,
      })
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      res.status(500).send("Erro ao buscar dados.")
    }
  },
}

module.exports = AppointmentsController
