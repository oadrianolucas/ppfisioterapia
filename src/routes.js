const express = require("express")
const router = express.Router()
const usersController = require("./controllers/UsersController.js")
const schedulesController = require("./controllers/SchedulesController.js")
const adminController = require("./controllers/AdminsController.js")
const servicesController = require("./controllers/ServicesController.js")

const loginMiddleware = require("./middlewares/login")
const filterMiddleware = require("./middlewares/filter")

// Rota inicial
router.get("/", (req, res) => {
  res.render("admin/login")
})

router.get("/admin/finances", (req, res) => {
  res.render("admin/dev")
})

router.get("/privacy-policy", (req, res) => {
  res.render("privacyPolicy")
})

// Rotas de criação e visualização de usuários
router.get("/admin/user/create", (req, res) => {
  res.render("admin/user/create")
})
router.post("/create/user", usersController.PostCreateUser)
router.get("/admin/user/view/:id", usersController.GetViewUser)

// Rotas de listagem e busca de usuários
router.get("/admin/users", usersController.GetFindAllUsers)
router.get("/admin/users/search", usersController.GetSearchUsers)

//Rotas de serviços
router.get("/admin/services", servicesController.GetFindAllServices)
router.post("/create/service", servicesController.PostCreateService)
router.post("/delete/service", servicesController.PostDeleteService)

// Rotas de agendamento
router.get("/admin/schedules", schedulesController.findSchedule)
router.get("/admin/create/schedule", schedulesController.viewSchedule)
router.get("/admin/view/schedule/:id", schedulesController.viewScheduleOne)
router.post("/create/schedule", schedulesController.createSchedule)
router.post("/delete/schedule", schedulesController.deleteSchedule)
router.post("/admin/schedules/:id/edit", schedulesController.editSchedule)
router.get("/admin/schedules/search", schedulesController.searchSchedules)

// Rotas de administração
router.get("/admin/admins/list", adminController.GetFindAllAdmins)
router.get("/admin/edit/:id", adminController.GetUpdateAdmin)
router.post("/delete/admin", adminController.PostDeleteAdmin)
router.post("/create/admin", adminController.PostCreateAdmin)
router.post("/update/admin", adminController.PostUpdateAdmin)

// Rotas de autenticação
router.post("/login", adminController.PostLoginAdmin)
router.post("/logout", adminController.PostLogoutAdmin)

// Rotas de exclusão e atualização de usuários
router.post("/delete/user", usersController.PostDeleteUser)
router.post("/update/user", usersController.PostUpdateUser)

// Rota de erro 404
router.use((req, res) => {
  res.status(404)
  res.render("404")
})

module.exports = router
