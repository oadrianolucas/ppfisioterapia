const sequelize = require("sequelize")
const Sequelize = new sequelize(
  process.env.DB_SCHEMA,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT,
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
