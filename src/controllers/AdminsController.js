const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")
const alert = require("../middlewares/alert")

const AdminsController = {
  async GetFindAllAdmins(req, res) {
    try {
      const admins = await Admin.findAll()
      res.render("admin/settings/admins", {
        admin: admins.map((admin) => admin.toJSON()),
      })
    } catch (error) {
      res.send("Erro ao buscar administradores: " + error)
    }
  },

  async GetUpdateAdmin(req, res) {
    const id = req.params.id
    try {
      const admin = await Admin.findByPk(id)
      if (admin) {
        res.render("admin/settings/update", { admin: admin.toJSON() })
      } else {
        res.redirect("/admin/settings")
      }
    } catch (error) {
      res.send("Erro ao buscar administrador: " + error)
    }
  },

  async PostCreateAdmin(req, res) {
    const { name, email, filter, password } = req.body
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
        email: email,
        password: hash,
        filter: filter,
      })
      res.redirect("/admin/admins/list")
    } catch (error) {
      res.send("Erro ao criar administrador: " + error)
    }
  },

  async PostDeleteAdmin(req, res) {
    const id = req.body.id
    if (!isNaN(id)) {
      try {
        await Admin.destroy({
          where: {
            id: id,
          },
        })
        res.redirect("/admin/admins/list")
      } catch (error) {
        res.send("Erro ao deletar administrador: " + error)
      }
    } else {
      res.redirect("/admin/admins/list")
    }
  },

  async PostUpdateAdmin(req, res) {
    const { id, name, login, email, password, filter } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    try {
      await Admin.update(
        {
          name: name.toLowerCase(),
          login: login,
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
      res.redirect("/admin/settings")
    } catch (error) {
      res.send("Erro ao atualizar administrador: " + error)
    }
  },

  async PostLoginAdmin(req, res) {
    const {email, password} = req.body
    try {
      const admin = await Admin.findOne({ where: { email: email } })
      if (admin) {
        const correct = bcrypt.compareSync(password, admin.password)
        if (correct) {
          req.session.admin = {
            name: admin.name,
            email: email.email,
            filter: admin.filter,
          }
          res.redirect("/admin/schedules")
        } else {
          req.flash("error_msg", alert.INVALID_PASSWORD)
          res.redirect("/")
        }
      } else {
        req.flash("error_msg", alert.INVALID_LOGIN)
        res.redirect("/")
      }
    } catch (error) {
      res.send("Erro ao fazer login: " + error)
    }
  },

  PostLogoutAdmin(req, res) {
    req.session.admin = undefined
    res.redirect("/")
  },
}

module.exports = AdminsController
