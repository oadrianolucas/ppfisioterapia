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
const handlebarsHelpers = require("handlebars-helpers")();
const numberFormatter = require("number-formatter");

app.set("port", process.env.PORT || 3000)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "erg0eg65256ge",
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
)
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.admin = req.session.admin
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
    helpers: {
      formatDate: function (date) {
        if (moment(date, 'YYYY-MM-DD', true).isValid()) {
          return moment(date).format('DD/MM/YYYY');
        } else {
          return '';
        }
      },
      formatMoney: function (value) {
        return numberFormatter("#,##0.00", value, "R$");
      },
      ...handlebarsHelpers
    },
  })
)


app.use("/", routes)

module.exports = app
