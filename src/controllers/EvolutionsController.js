const Evolution = require("../models/Evolution");
const Schedule = require("../models/Schedule");

const EvolutionsController = {
  async createEvolution(req, res) {
    const { date, pa, painUser, conduct, evolution, userId } = req.body;
    try {
      await Evolution.create({
        date: date,
        pa: pa,
        painUser: painUser,
        conduct: conduct,
        evolution: evolution,
        userId: userId,
      });
      res.redirect("/admin/evolutions");
    } catch (error) {
      res.status(500).send("Erro ao criar evolução: " + error);
    }
  },

  async updateEvolution(req, res) {
    const evolutionId = req.params.id;
    const { date, pa, painUser, conduct, evolution, userId } = req.body;
    try {
      const updatedEvolution = await Evolution.findByIdAndUpdate(
        evolutionId,
        {
          date: date,
          pa: pa,
          painUser: painUser,
          conduct: conduct,
          evolution: evolution,
          userId: userId,
        },
        { new: true }
      );

      if (!updatedEvolution) {
        return res.status(404).send("Evolução não encontrada");
      }

      res.redirect("/admin/evolutions");
    } catch (error) {
      res.status(500).send("Erro ao atualizar evolução: " + error);
    }
  },

  async deleteEvolution(req, res) {
    const evolutionId = req.body.id;
    try {
      const deletedEvolution = await Evolution.findByPk(evolutionId);
      if (!deletedEvolution) {
        return res.status(404).send("Evolução não encontrada");
      }
      await deletedEvolution.destroy()
      res.redirect("/admin/evolutions");
    } catch (error) {
      res.status(500).send("Erro ao excluir evolução: " + error);
    }
  },
  async allEvolutions(req, res) {
    try {
      const evolutions = await Evolution.findAll()
      const schedules = await Schedule.findAll()
      res.render("admin/evolution/evolutions", {
        evolution: evolutions.map((evolution) => evolution.toJSON()),
        schedule: schedules.map((schedule) => schedule.toJSON()),
      })
    } catch (error) {
      console.error("Erro ao buscar evoluções:", error)
      res.status(500).send("Erro ao buscar evoluções.")
    }
  },
};

module.exports = EvolutionsController;
