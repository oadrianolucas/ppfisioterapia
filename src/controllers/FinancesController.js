const Finance = require("../models/Finance")
const Appointment = require("../models/Appointment")
const File = require("../models/File")
const alert = require("../middlewares/alert")
const REDIRECT_FINANCES = "/admin/finances"

const FinanceController = {
  async createFinance(req, res) {
    const { type, date, value, category, description, appointmentId } = req.body
    try {
      await Finance.create({
        type: type,
        date: date,
        value: value,
        category: category,
        description: description,
        appointmentId: appointmentId,
      })
      res.redirect(REDIRECT_FINANCES);
    } catch (error) {
      req.flash("error_msg", alert.FINANCE_ERROR)
      res.redirect(REDIRECT_FINANCES);
    }
  },
  async allFinances (req, res) {
    Finance.findAll({
      raw: true, // Retorna apenas os dados brutos, sem mapear para modelos
    })
      .then((finances) => {
        Appointment.findAll().then((appointments) => {
          const financePromises = finances.map((finance) => {
            return File.findAll({
              where: { financeId: finance.id }, // Filtra arquivos pelo ID da entrada financeira
              raw: true,
            }).then((files) => {
              finance.files = files;
              return finance;
            });
          });
  
          Promise.all(financePromises).then((financeData) => {
            res.render("admin/finance/finances", {
              finances: financeData,
              appointments: appointments.map((appointment) => appointment.toJSON()),
            });  
          });
        });
      })
      .catch((error) => {
        req.flash("error_msg", alert.FINANCE_ERROR_ALL);
        res.redirect(REDIRECT_FINANCES);
      });
  },
  async deleteFinance(req, res) {
    const { id } = req.body;
    try {
      const finance = await Finance.findByPk(id);
      if (!finance) {
        req.flash("error_msg", alert.FINANCE_NOT_FOUND);
        return res.redirect(REDIRECT_FINANCES);
      }
      await finance.destroy();
      res.redirect(REDIRECT_FINANCES);
    } catch (error) {
      req.flash("error_msg", alert.FINANCE_ERROR_DELETE);
      res.redirect(REDIRECT_FINANCES);
    }
  },
  async updateFinance(req, res) {
    const financeId = req.params.id;
    const { date, value, category, description, appointmentId } = req.body;
    try {
      const updatedFinance = await Finance.findByIdAndUpdate(
        financeId,
        {
          date: date,
          value: value,
          category: category,
          description: description,
          appointmentId: appointmentId,
        },
        { new: true }
      );

      if (!updatedFinance) {
        req.flash("error_msg", alert.FINANCE_NOT_FOUND);
        return res.redirect(REDIRECT_FINANCES);
      }

      res.redirect(REDIRECT_FINANCES);
    } catch (error) {
      req.flash("error_msg", alert.FINANCE_ERROR_UPDATE);
      res.redirect(REDIRECT_FINANCES);
    }
  },
}

module.exports = FinanceController
