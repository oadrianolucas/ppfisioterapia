const Evolution = require("../models/Evolution");

const EvolutionsController = {
  async createEvolution(req, res) {
    const { date, pa, painUser, conduct, evolution, appointmentId } = req.body;
    try {
      await Evolution.create({
        date: date,
        pa: pa,
        painUser: painUser,
        conduct: conduct,
        evolution: evolution,
        appointmentId: appointmentId,
      });
      res.redirect("/admin/appointments");
    } catch (error) {
      res.status(500).send("Erro ao criar evolução: " + error);
    }
  },

  async updateEvolution(req, res) {
    const evolutionId = req.params.id;
    const { date, pa, painUser, conduct, evolution, appointmentId } = req.body;
    try {
      const updatedEvolution = await Evolution.findByIdAndUpdate(
        evolutionId,
        {
          date: date,
          pa: pa,
          painUser: painUser,
          conduct: conduct,
          evolution: evolution,
          appointmentId: appointmentId,
        },
        { new: true }
      );

      if (!updatedEvolution) {
        return res.status(404).send("Evolução não encontrada");
      }

      res.redirect("/admin/appointments");
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
      res.redirect("/admin/appointments");
    } catch (error) {
      res.status(500).send("Erro ao excluir evolução: " + error);
    }
  },
};

module.exports = EvolutionsController;
