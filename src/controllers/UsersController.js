const sequelize = require("sequelize")
const User = require("../models/User")
const Address = require("../models/Address")

const UsersController = {
  GetFindAllUsers(req, res) {
    User.findAll().then((user) => {
      res.render("admin/user/users", {
        user: user.map((user) => user.toJSON()),
      })
    })
  },
  GetViewUser(req, res) {
    const id = req.params.id
    User.findByPk(id)
      .then(async (user) => {
        if (!user) {
          return res.redirect("/admin/users")
        }
        const userData = user.toJSON()
        const address = await Address.findOne({
          where: { userId: user.id },
        })
        if (address) {
          const addressData = address.toJSON()
          userData.Address = addressData
        }
        res.render("admin/user/view", { user: userData })
      })
      .catch((err) => {
        console.error("Error:", err)
        res.redirect("/admin/users")
      })
  },
  PostCreateUser(req, res) {
    const {
      name,
      birth,
      phone,
      cpf,
      note,
      zipcode,
      address,
      district,
      city,
      state,
      number,
    } = req.body

    User.create({
      name: name.toLowerCase(),
      birth: birth.toLowerCase(),
      cpf: cpf,
      phone: phone,
      note: note.toLowerCase(),
    })
      .then((createdUser) => {
        Address.create({
          userId: createdUser.id,
          zipcode: zipcode,
          address: address,
          district: district,
          city: city,
          state: state,
          number: number,
        })
      })
      .then(() => {
        res.redirect("/admin/users")
      })
      .catch((error) => {
        console.error("Error:", error)
        res.send("Error ao realizar o cadastro: " + error.message)
      })
  },

  PostDeleteUser(req, res) {
    var id = req.body.id
    if (id != undefined) {
      if (!isNaN(id)) {
        User.destroy({
          where: {
            id: id,
          },
        }).then(() => {
          res.redirect("/admin/users")
        })
      } else {
        res.redirect("/admin/users")
      }
    } else {
      res.redirect("/admin/users")
    }
  },

  PostUpdateUser(req, res) {
    var id = req.body.id
    var name = req.body.name
    var birth = req.body.birth
    var phone = req.body.phone
    var mother = req.body.mother
    var zipcode = req.body.zipcode
    var address = req.body.address
    var district = req.body.district
    var city = req.body.city
    var state = req.body.state
    var number = req.body.number
    var note = req.body.note

    User.update(
      {
        name: name,
        birth: birth,
        phone: phone,
        users,
      },
      {
        where: {
          id: id,
        },
      }
    ).then(() => {
      res.redirect("/admin/user")
    })
  },

  GetSearchUsers(req, res) {
    const { term } = req.query
    const Op = sequelize.Op

    termsFilter = {
      name: {
        [Op.like]: `%${term}%`,
      },
    }

    User.findAll({
      where: termsFilter,
    }).then((termsFilter) => {
      res.render("admin/user/users", {
        user: termsFilter.map((user) => user.toJSON()),
      })
    })
  },
}

module.exports = UsersController
