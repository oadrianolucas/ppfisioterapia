const Appointment = require("../models/Appointment")
const Schedule = require("../models/Schedule")
const User = require("../models/User")

const AppointmentsController = {
  async allAppointments(req, res) {
    try {
      const [schedules] = await Promise.all([Schedule.findAll()])
      res.render("admin/appointment/create", {
        schedules: schedules.map((schedule) => schedule.toJSON()),
      })
    } catch (error) {
      req.flash("error_msg", "Erro ao buscar dados: " + error.message)
      res.status(500).send("Erro ao buscar dados.")
    }
  },

  async appointment(req, res) {
    const id = req.params.id
    const [schedules] = await Promise.all([Schedule.findAll()])
    try {
      const appointment = await Appointment.findByPk(id)

      if (!appointment) {
        req.flash("error_msg", "Agendamento não encontrado.")
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
      req.flash("error_msg", "Erro ao buscar dados: " + error.message)
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
      req.flash("success_msg", "Consulta criada com sucesso.")
      res.redirect("/admin/appointments")
    } catch (error) {
      req.flash("error_msg", "Erro ao criar consulta: " + error.message)
      res.redirect("/admin/appointments")
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
      req.flash("error_msg", "Erro ao buscar dados: " + error.message)
      res.status(500).send("Erro ao buscar dados.")
    }
  },
  async editAppointment(req, res) {
    const { hd, hmp, hma, text, scheduleId, id } = req.body
    try {
      const appointment = await Appointment.findByPk(id)

      if (!appointment) {
        req.flash("error_msg", "Agendamento não encontrado.")
        return res.status(404).send("Agendamento não encontrado.")
      }
      appointment.hd = hd
      appointment.hmp = hmp
      appointment.hma = hma
      appointment.text = text
      appointment.scheduleId = scheduleId
      await appointment.save()
      req.flash("success_msg", "Consulta editada com sucesso.")
      res.redirect(`/admin/view/appointment/${id}`)
    } catch (error) {
      req.flash("error_msg", "Erro ao editar consulta.")
      res.redirect(`/admin/view/appointment/${id}`)
    }
  },
}

module.exports = AppointmentsController
