function filter(req, res, next) {
  next()
  /*
  const user = req.session.user
  const filter = req.session.user.filter
  if (user && filter == 3) {
    next()
  } else {
    res.render("admin/accessdenied")
  }
  */
}
module.exports = filter
