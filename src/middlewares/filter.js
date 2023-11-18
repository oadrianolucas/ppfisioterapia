const filter = (req, res, next) => {
  const admin = req.session.admin
  const filter = req.session.admin.filter
  if (admin && filter == 3) {
    next()
  } else {
    res.redirect("/acesso-negado")
  }
}
module.exports = filter
