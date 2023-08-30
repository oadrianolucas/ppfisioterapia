const Service = require("../models/Service")

const ServiceController = {
  async GetFindAllServices(req, res) {
    try {
      const services = await Service.findAll()
      res.render("admin/service/services", {
        service: services.map((service) => service.toJSON()),
      })
    } catch (error) {
      console.error("Erro ao buscar serviços:", error)
      res.status(500).send("Erro ao buscar serviços.")
    }
  },

  async PostCreateService(req, res) {
    const { name } = req.body

    try {
      // Verifica se o serviço já existe pelo nome
      const existingService = await Service.findOne({
        where: { name: name.toLowerCase() },
      })

      if (existingService) {
        req.flash("error_msg", "Esse serviço já existe.")
        res.redirect("/admin/services")
        return
      }

      await Service.create({
        name: name.toLowerCase(),
      })
      res.redirect("/admin/services")
    } catch (error) {
      console.error("Erro ao criar serviço:", error)
      req.flash("error_msg", "Erro ao criar serviço.")
      res.redirect("/admin/services")
    }
  },
  async PostDeleteService(req, res) {
    const serviceId = req.body.id

    try {
      const service = await Service.findByPk(serviceId)

      if (!service) {
        req.flash("error_msg", "Serviço não encontrado.")
        res.redirect("/admin/services")
        return
      }

      await service.destroy()
      res.redirect("/admin/services")
    } catch (error) {
      console.error("Erro ao excluir serviço:", error)
      req.flash("error_msg", "Erro ao excluir serviço.")
      res.redirect("/admin/services")
    }
  },
}

module.exports = ServiceController
