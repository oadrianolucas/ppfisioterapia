const sequelize = require("sequelize");
const User = require("../models/User");
const Address = require("../models/Address");
const File = require("../models/File");
const REDIRECT_USERS = "/admin/users";

const UsersController = {
  async GetFindAllUsers(req, res) {
    try {
      const users = await User.findAll({
        raw: true
      });
      const usersPromises = users.map(async (user) => {
        const files = await File.findAll({
          where: { userId: user.id },
          raw: true,
        });
        return {
          ...user,
          files: files,
        };
      });
      const userData = await Promise.all(usersPromises);
      res.render("admin/user/users", {
        user: userData,
      });
    } catch (error) {
      console.error("Error:", error);
      res.redirect(REDIRECT_USERS);
    }
  },

  async GetViewUser(req, res) {
    try {
      const id = req.params.id;
      const user = await User.findByPk(id);
      if (!user) {
        return res.redirect(REDIRECT_USERS);
      }
      const userData = user.toJSON();
      const address = await Address.findOne({ where: { userId: user.id } });
      if (address) {
        userData.Address = address.toJSON();
      }

      res.render("admin/user/view", { user: userData });
    } catch (error) {
      console.error("Error:", error);
      res.redirect(REDIRECT_USERS);
    }
  },

  async PostCreateUser(req, res) {
    try {
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
      } = req.body;

      const createdUser = await User.create({
        name: name.toLowerCase(),
        birth: birth.toLowerCase(),
        cpf: cpf,
        phone: phone,
        note: note.toLowerCase(),
      });

      await Address.create({
        userId: createdUser.id,
        zipcode: zipcode,
        address: address,
        district: district,
        city: city,
        state: state,
        number: number,
      });

      res.redirect(REDIRECT_USERS);
    } catch (error) {
      console.error("Error:", error);
      res.send("Error ao realizar o cadastro: " + error.message);
    }
  },

  async PostDeleteUser(req, res) {
    try {
      const { id } = req.body;
      if (id != undefined && !isNaN(id)) {
        const files = await File.findAll({
          where: { userId: id },
        });
        if (files.length > 0) {
          req.flash("error_msg", "Não é possível excluir este cliente, pois há arquivos relacionados a ele.");
          return res.redirect(REDIRECT_USERS);
        }
        await User.destroy({
          where: { id: id },
        });
      }
      res.redirect(REDIRECT_USERS);
    } catch (error) {
      console.error("Error:", error);
      res.redirect(REDIRECT_USERS);
    }
  },

  async PostUpdateUser(req, res) {
    try {
      const { id, name, birth, phone } = req.body;
      await User.update(
        {
          name: name,
          birth: birth,
          phone: phone,
        },
        {
          where: { id: id },
        }
      );
      res.redirect("/admin/user");
    } catch (error) {
      console.error("Error:", error);
      res.redirect(REDIRECT_USERS);
    }
  },

  async GetSearchUsers(req, res) {
    try {
      const { term } = req.query;
      const Op = sequelize.Op;

      const termsFilter = {
        name: {
          [Op.like]: `%${term}%`,
        },
      };

      const filteredUsers = await User.findAll({ where: termsFilter });
      res.render("admin/user/users", {
        user: filteredUsers.map((user) => user.toJSON()),
      });
    } catch (error) {
      console.error("Error:", error);
      res.redirect(REDIRECT_USERS);
    }
  },
};

module.exports = UsersController;
