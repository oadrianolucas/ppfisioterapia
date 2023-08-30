const app = require("./src/app")
app.listen(app.get("port"))
console.log("Servidor rodando", process.env.PUBLIC_URL)
