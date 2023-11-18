const Service = require("../models/Service")

const ServiceController = {
  async allService(req, res) {
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

  async createService(req, res) {
    const { name } = req.body

    try {
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

  async deleteService(req, res) {
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

  async updateService(req, res) {
    const serviceId = req.params.id
    try {
      const service = await Service.findByPk(serviceId)
      if (!service) {
        req.flash("error_msg", "Serviço não encontrado.")
        res.redirect("/admin/services")
        return
      }
      res.render("admin/service/update", {
        service: service.toJSON(),
      })
    } catch (error) {
      console.error("Erro ao editar serviço:", error)
      req.flash("error_msg", "Erro ao editar serviço.")
      res.redirect("/admin/services")
    }
  },

  async editService(req, res) {
    const { name, id } = req.body
    try {
      const service = await Service.findByPk(id)
      if (!service) {
        req.flash("error_msg", "Serviço não encontrado.")
        res.redirect("/admin/services")
        return
      }
      service.name = name.toLowerCase()
      await service.save()
      req.flash("success_msg", "Serviço atualizado com sucesso.")
      res.redirect("/admin/services")
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error)
      req.flash("error_msg", "Erro ao atualizar serviço.")
      res.redirect("/admin/services")
    }
  },
}

module.exports = ServiceController
