const express = require("express")
const router = express.Router()
const usersController = require("./controllers/UsersController.js")
const schedulesController = require("./controllers/SchedulesController.js")
const adminController = require("./controllers/AdminsController.js")
const servicesController = require("./controllers/ServicesController.js")
const appointmentsController = require("./controllers/AppointmentsController.js")
const evolutionsController = require("./controllers/EvolutionsController.js")
const financesController = require("./controllers/FinancesController.js")
const filesController = require("./controllers/FilesController.js")

const loginMiddleware = require("./middlewares/login")
const filter = require("./middlewares/filter")


router.get("/", (req, res) => {
  res.render("index")
})

router.get("/admin", (req, res) => {
  res.render("admin/login")
})

router.post("/create/file", loginMiddleware, filesController.createFile)
router.post("/delete/file", loginMiddleware, filesController.deleteFile)
router.get("/create/all/finance-excel", loginMiddleware, financesController.createExcel)
router.post("/create/finance/record", loginMiddleware, financesController.createExcelDate)

router.get("/admin/finances", loginMiddleware, financesController.allFinances)
router.post("/create/finance", loginMiddleware, financesController.createFinance)
router.post("/delete/finance", loginMiddleware, financesController.deleteFinance)
router.get("/admin/finances/search", loginMiddleware, financesController.searchFinance)

router.get("/privacy-policy", (req, res) => {
  res.render("privacyPolicy")
})

router.get("/admin/user/create", loginMiddleware, (req, res) => {
  res.render("admin/user/create")
})

router.post("/create/user", loginMiddleware, usersController.PostCreateUser)
router.get("/admin/user/view/:id", loginMiddleware, usersController.GetViewUser)

router.get("/admin/users", loginMiddleware, usersController.GetFindAllUsers)
router.get("/admin/users/search", loginMiddleware, usersController.GetSearchUsers)

router.get("/admin/services", filter, servicesController.GetFindAllServices)
router.post("/create/service", filter, servicesController.PostCreateService)
router.post("/delete/service", filter, servicesController.PostDeleteService)

router.get("/admin/schedules", loginMiddleware, schedulesController.findSchedule)
router.get("/admin/create/schedule", loginMiddleware, schedulesController.viewSchedule)
router.get("/admin/view/schedule/:id", loginMiddleware, schedulesController.viewScheduleOne)
router.post("/create/schedule", loginMiddleware, schedulesController.createSchedule)
router.post("/delete/schedule", loginMiddleware, schedulesController.deleteSchedule)
router.post("/admin/schedule/:id/edit", loginMiddleware, schedulesController.editSchedule)
router.get("/admin/schedules/search", loginMiddleware, schedulesController.searchSchedules)

router.get("/admin/admins/list", filter, adminController.GetFindAllAdmins)
router.get("/admin/edit/:id", filter, adminController.GetUpdateAdmin)
router.post("/delete/admin", filter, adminController.PostDeleteAdmin)
router.post("/create/admin", filter, adminController.PostCreateAdmin)
router.post("/update/admin", filter, adminController.PostUpdateAdmin)

router.post("/login", adminController.PostLoginAdmin)
router.post("/logout", adminController.PostLogoutAdmin)

router.post("/delete/user", loginMiddleware, usersController.PostDeleteUser)
router.post("/update/user", loginMiddleware, usersController.PostUpdateUser)

router.post("/create/appointment", loginMiddleware, appointmentsController.createAppointment)
router.get("/admin/appointments", loginMiddleware, appointmentsController.fistAppointment)
router.get("/admin/create/appointment", loginMiddleware, appointmentsController.viewCreate)
router.get(
  "/admin/view/appointment/:id", loginMiddleware,
  appointmentsController.viewAppointment
)

router.post("/create/evolution", loginMiddleware, evolutionsController.createEvolution)
router.post("/delete/evolution", filter, evolutionsController.deleteEvolution)
router.post("/update/evolution", filter, evolutionsController.updateEvolution)

router.get("/acesso-negado", (req, res) => {
  res.render("admin/accessdenied")
})

//Evoluções
router.get("/admin/evolutions", loginMiddleware, evolutionsController.allEvolutions)

router.use((req, res) => {
  res.status(404)
  res.render("404")
})

module.exports = router
