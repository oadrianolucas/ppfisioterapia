const EvolutionUser = require("../models/EvolutionUser")
const EvolutionUserController = {
  async createEvolutionUser(req, res) {
    const { date, pa, painUser, conduct, evolution, appointmentId } = req.body
    try {
      await EvolutionUser.create({
        date: date,
        pa: pa,
        painUser: painUser,
        conduct: conduct,
        evolution: evolution,
        appointmentId: appointmentId,
      })
      res.redirect("/admin/appointments")
    } catch (error) {
      res.send("Erro ao criar evolução: " + error)
    }
  },
}

module.exports = EvolutionUserController
