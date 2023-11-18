const Evolution = require("../models/Evolution")
const Schedule = require("../models/Schedule")
const User = require("../models/User")

const EvolutionsController = {
  async createEvolution(req, res) {
    const { date, pa, painUser, conduct, evolution, scheduleId } = req.body
    try {
      const existingEvolution = await Evolution.findOne({
        where: { scheduleId: scheduleId },
      })
      if (existingEvolution) {
        req.flash("error_msg", "Já existe uma evolução para para esta agenda.")
        return res.redirect("/admin/evolutions")
      }
      await Evolution.create({
        date: date,
        pa: pa,
        painUser: painUser,
        conduct: conduct,
        evolution: evolution,
        scheduleId: scheduleId,
      })

      req.flash("success_msg", "Evolução criada com sucesso.")
      res.redirect("/admin/evolutions")
    } catch (error) {
      req.flash("error_msg", "Erro ao criar evolução: " + error.message)
      res.redirect("/admin/evolutions")
    }
  },

  async editEvolution(req, res) {
    const { pa, painUser, conduct, evolution, evolutionId, scheduleId } =
      req.body
    try {
      const existingEvolution = await Evolution.findByPk(evolutionId)
      if (!existingEvolution) {
        req.flash("error_msg", "Evolução não encontrada.")
        return res.status(404).send("Evolução não encontrada.")
      }
      existingEvolution.scheduleId = scheduleId
      existingEvolution.pa = pa
      existingEvolution.painUser = painUser
      existingEvolution.conduct = conduct
      existingEvolution.evolution = evolution
      await existingEvolution.save()
      req.flash("success_msg", "Evolução atualizada com sucesso.")
      res.redirect("/admin/evolutions")
    } catch (error) {
      req.flash("error_msg", "Erro ao atualizar evolução: " + error.message)
      res.redirect("/admin/evolutions")
    }
  },

  async deleteEvolution(req, res) {
    const evolutionId = req.body.id
    try {
      const deletedEvolution = await Evolution.findByPk(evolutionId)
      if (!deletedEvolution) {
        req.flash("error_msg", "Evolução não encontrada.")
        return res.status(404).send("Evolução não encontrada.")
      }
      await deletedEvolution.destroy()
      req.flash("success_msg", "Evolução excluída com sucesso.")
      res.redirect("/admin/evolutions")
    } catch (error) {
      req.flash("error_msg", "Erro ao excluir evolução: " + error.message)
      res.redirect("/admin/evolutions")
    }
  },

  async allEvolutions(req, res) {
    try {
      const evolutions = await Evolution.findAll()
      const [schedules] = await Promise.all([Schedule.findAll()])
      const evolutionList = []
      if (evolutions.length === 0) {
        return res.render("admin/evolution/evolutions", {
          schedules: schedules.map((schedule) => schedule.toJSON()), // Adicione esta linha
          evolutions: [],
        })
      }
      for (const evolution of evolutions) {
        const evolutionData = evolution.toJSON()
        const scheduleData = await getData(evolutionData.scheduleId, Schedule)
        const userData = await getData(scheduleData.userId, User)
        if (scheduleData) {
          evolutionList.push({
            id: evolutionData.id,
            date: scheduleData.date,
            name: userData.name,
          })
        } else {
          console.warn(
            `Não foi possível encontrar Schedule com o id ${evolutionData.scheduleId}`
          )
        }
      }
      res.render("admin/evolution/evolutions", {
        schedules: schedules.map((schedule) => schedule.toJSON()),
        evolutions: evolutionList,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async updateEvolution(req, res) {
    const evolutionId = req.params.id
    try {
      const evolution = await Evolution.findByPk(evolutionId)
      const [schedules] = await Promise.all([Schedule.findAll()])
      if (!evolution) {
        req.flash("error_msg", "Evolução não encontrado.")
        return res.redirect("/admin/evolutions")
      }
      const evolutionData = evolution.toJSON()
      const scheduleData = await getData(evolutionData.scheduleId, Schedule)
      const userData = await getData(scheduleData.userId, User)

      const evolutionDetails = {
        id: evolutionData.id,
        date: scheduleData.date,
        hours: scheduleData.hours,
        evolution: evolutionData.evolution,
        pa: evolutionData.pa,
        painUser: evolutionData.painUser,
        conduct: evolutionData.conduct,
        schedule: scheduleData,
        user: userData,
      }
      res.render("admin/evolution/view", {
        evolution: evolutionDetails,
        schedules: schedules.map((schedule) => schedule.toJSON()),
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

async function getData(id, Model) {
  const data = await Model.findOne({ where: { id } })
  return data ? data.toJSON() : null
}
module.exports = EvolutionsController
