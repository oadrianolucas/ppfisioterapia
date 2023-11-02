const sequelize = require("sequelize")
const Sequelize = new sequelize(
  "ppfisioterapia",
  "root",
  "root",
  {
    host: "localhost",
    dialect: "mysql",
    port: 3308,
  }
)

module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,
}

Sequelize.authenticate()
  .then(() => {
    console.log("Conexão realizada com sucesso ao banco de dados")
  })
  .catch((err) => {
    console.log("Error ao se conectar com o banco de dados" + err)
  })
