const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")
const alert = require("../middlewares/alert")

const AdminsController = {
  async allAdmins(req, res) {
    try {
      const admins = await Admin.findAll()
      res.render("admin/settings/admins", {
        admin: admins.map((admin) => admin.toJSON()),
      })
    } catch (error) {
      req.flash("error_msg", "Erro ao buscar administradores: " + error.message)
      res.redirect("/admin/admins/list")
    }
  },

  async updateAdmin(req, res) {
    const id = req.params.id
    try {
      const admin = await Admin.findByPk(id)
      if (admin) {
        res.render("admin/settings/update", { admin: admin.toJSON() })
      } else {
        req.flash("error_msg", "Administrador não encontrado.")
        res.redirect("/admin/settings")
      }
    } catch (error) {
      req.flash("error_msg", "Erro ao buscar administrador: " + error.message)
      res.redirect("/admin/settings")
    }
  },

  async createAdmin(req, res) {
    const { name, email, filter, password, coffito } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    try {
      const existingAdmin = await Admin.findOne({ where: { email: email } })
      if (existingAdmin) {
        req.flash("error_msg", "Este email já está cadastrado.")
        res.redirect("/admin/admins/list")
        return
      }
      await Admin.create({
        name: name ? name.toLowerCase() : "",
        coffito: coffito,
        email: email,
        password: hash,
        filter: filter,
      })
      req.flash("success_msg", "Administrador criado com sucesso.")
      res.redirect("/admin/admins/list")
    } catch (error) {
      req.flash("error_msg", "Erro ao criar administrador: " + error.message)
      res.redirect("/admin/admins/list")
    }
  },

  async deleteAdmin(req, res) {
    const id = req.body.id
    if (!isNaN(id)) {
      try {
        await Admin.destroy({
          where: {
            id: id,
          },
        })
        req.flash("success_msg", "Administrador excluído com sucesso.")
        res.redirect("/admin/admins/list")
      } catch (error) {
        req.flash(
          "error_msg",
          "Erro ao deletar administrador: " + error.message
        )
        res.redirect("/admin/admins/list")
      }
    } else {
      req.flash("error_msg", "ID de administrador inválido.")
      res.redirect("/admin/admins/list")
    }
  },

  async editAdmin(req, res) {
    const { id, name, email, password, filter, coffito } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    try {
      await Admin.update(
        {
          name: name.toLowerCase(),
          coffito: coffito,
          email: email,
          password: hash,
          filter: filter,
        },
        {
          where: {
            id: id,
          },
        }
      )
      req.flash("success_msg", "Administrador atualizado com sucesso.")
      res.redirect("/admin/admins/list")
    } catch (error) {
      req.flash(
        "error_msg",
        "Erro ao atualizar administrador: " + error.message
      )
      res.redirect("/admin/admins/list")
    }
  },

  async login(req, res) {
    const { email, password } = req.body
    try {
      const admin = await Admin.findOne({ where: { email: email } })
      if (admin) {
        const correct = bcrypt.compareSync(password, admin.password)
        if (correct) {
          req.session.admin = {
            name: admin.name,
            email: email.email,
            filter: admin.filter,
            id: admin.id,
          }
          res.redirect("/admin/schedules")
        } else {
          req.flash("error_msg", alert.INVALID_PASSWORD)
          res.redirect("/admin")
        }
      } else {
        req.flash("error_msg", alert.INVALID_LOGIN)
        res.redirect("/admin")
      }
    } catch (error) {
      req.flash("error_msg", "Erro ao fazer login: " + error.message)
      res.redirect("/admin")
    }
  },

  logout(req, res) {
    req.session.admin = undefined
    res.redirect("/admin")
  },
}

module.exports = AdminsController
