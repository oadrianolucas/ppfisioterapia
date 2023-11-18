const alert = require("../middlewares/alert")
const login = (req, res, next) => {
  const admin = req.session.admin
  if (admin) {
    next()
  } else {
    req.flash("error_msg", alert.LOGIN_ERROR_LOGIN)
    res.redirect("/admin")
  }
}

module.exports = login
