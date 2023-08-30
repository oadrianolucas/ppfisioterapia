require("dotenv").config()
const express = require("express")
const path = require("path")
const handlebars = require("express-handlebars")
const moment = require("moment")
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")
const app = express()
const routes = require("./routes")

app.set("port", process.env.PORT || 3000)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  session({
    secret: "erg0eg65256ge",
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
)
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.user = req.session.user
  next()
})

app.use(express.static("public"))
app.use(express.static(path.join(__dirname, "/public")))

app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "views"))
app.engine(
  ".hbs",
  handlebars({
    defaultLayout: "main",
    extname: "hbs",
  })
)

app.use("/", routes)

module.exports = app
