const express = require("express")
const router = express.Router()
const usersController = require("./controllers/UsersController.js")
const schedulesController = require("./controllers/SchedulesController.js")
const adminController = require("./controllers/AdminsController.js")
const servicesController = require("./controllers/ServicesController.js")
const appointmentsController = require("./controllers/AppointmentsController.js")
const evolutionController = require("./controllers/evolutionController.js")

const loginMiddleware = require("./middlewares/login")
const filter = require("./middlewares/filter")

// Rota inicial
router.get("/", (req, res) => {
  res.render("admin/login")
})

router.get("/admin/finances", loginMiddleware, (req, res) => {
  res.render("admin/dev")
})

router.get("/privacy-policy", (req, res) => {
  res.render("privacyPolicy")
})

// Rotas de criação e visualização de usuários
router.get("/admin/user/create", loginMiddleware, (req, res) => {
  res.render("admin/user/create")
})
router.post("/create/user", loginMiddleware, usersController.PostCreateUser)
router.get("/admin/user/view/:id", loginMiddleware, usersController.GetViewUser)

// Rotas de listagem e busca de usuários
router.get("/admin/users", loginMiddleware, usersController.GetFindAllUsers)
router.get("/admin/users/search", loginMiddleware, usersController.GetSearchUsers)

//Rotas de serviços
router.get("/admin/services", filter, servicesController.GetFindAllServices)
router.post("/create/service", filter,servicesController.PostCreateService)
router.post("/delete/service", filter, servicesController.PostDeleteService)

// Rotas de agendamento
router.get("/admin/schedules", loginMiddleware, schedulesController.findSchedule)
router.get("/admin/create/schedule", loginMiddleware, schedulesController.viewSchedule)
router.get("/admin/view/schedule/:id", loginMiddleware, schedulesController.viewScheduleOne)
router.post("/create/schedule", loginMiddleware, schedulesController.createSchedule)
router.post("/delete/schedule", loginMiddleware, schedulesController.deleteSchedule)
router.post("/admin/schedule/:id/edit", loginMiddleware, schedulesController.editSchedule)
router.get("/admin/schedules/search", loginMiddleware, schedulesController.searchSchedules)

// Rotas de administração
router.get("/admin/admins/list", filter,  adminController.GetFindAllAdmins)
router.get("/admin/edit/:id", filter,adminController.GetUpdateAdmin)
router.post("/delete/admin", filter,adminController.PostDeleteAdmin)
router.post("/create/admin",  filter,adminController.PostCreateAdmin)
router.post("/update/admin",  filter,adminController.PostUpdateAdmin)

// Rotas de autenticação
router.post("/login", adminController.PostLoginAdmin)
router.post("/logout", adminController.PostLogoutAdmin)

// Rotas de exclusão e atualização de usuários
router.post("/delete/user", loginMiddleware, usersController.PostDeleteUser)
router.post("/update/user", loginMiddleware, usersController.PostUpdateUser)

// Rotas Consultas
router.post("/create/appointment", loginMiddleware, appointmentsController.createAppointment)
router.get("/admin/appointments", loginMiddleware, appointmentsController.fistAppointment)
router.get("/admin/create/appointment", loginMiddleware, appointmentsController.viewCreate)
router.get(
  "/admin/view/appointment/:id", loginMiddleware, 
  appointmentsController.viewAppointment
)

router.post("/create/evolution", loginMiddleware, evolutionController.createEvolution)
router.get("/acesso-negado", (req, res)=>{
  res.render("admin/accessdenied")
})
// Rota de erro 404
router.use((req, res) => {
  res.status(404)
  res.render("404")
})

module.exports = router
