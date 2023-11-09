const Finance = require("../models/Finance")
const User = require("../models/User")
const alert = require("../middlewares/alert")
const REDIRECT_FINANCES = "/admin/finances"
const sequelize = require("sequelize")
const ExcelJS = require('exceljs');

const categoryMapping = {
  1: 'Dinheiro',
  2: 'Pix',
  3: 'Cheque',
  4: 'Cartão de Crédito/Débito',
};

const FinanceController = {
  async createFinance(req, res) {
    const { type, date, value, category, description, userId } = req.body
    const admin = req.session.admin.id
    console.log(admin)
    try {
      await Finance.create({
        type: type,
        date: date,
        value: value,
        category: category,
        description: description,
        userId: userId,
        adminId: admin
      })
      res.redirect(REDIRECT_FINANCES);
    } catch (error) {
      req.flash("error_msg", alert.FINANCE_ERROR)
      res.redirect(REDIRECT_FINANCES);
    }
  },
  async allFinances(req, res) {
    try {
      let finances
      const filter = req.session.admin.filter
      console.log(filter)
        if (filter === 3) {
          finances = await Finance.findAll({
            raw: true,
          });
        } else {
          finances = await Finance.findAll({
            where: {
              adminId: req.session.admin.id,
            },
            raw: true,
          });
        }
     
      const type1Finances = finances.filter((finance) => finance.type === 1);
      const type2Finances = finances.filter((finance) => finance.type === 2);
      const totalType1 = type1Finances.reduce((total, finance) => total + finance.value, 0);
      const totalType2 = type2Finances.reduce((total, finance) => total + finance.value, 0);
      const difference = totalType1 - totalType2;
      const users = await User.findAll();
  
      res.render("admin/finance/finances", {
        finances: finances,
        users: users.map((user) => user.toJSON()),
        totalType1: totalType1,
        totalType2: totalType2,
        difference: difference,
      });
    } catch (error) {
      req.flash("error_msg", alert.FINANCE_ERROR_ALL);
      res.redirect(REDIRECT_FINANCES);
    }
  },  
  async deleteFinance(req, res) {
    const { id } = req.body;
    try {
      const finance = await Finance.findByPk(id);
      if (!finance) {
        req.flash("error_msg", alert.FINANCE_NOT_FOUND);
        return res.redirect(REDIRECT_FINANCES);
      }
      await finance.destroy()
      res.redirect(REDIRECT_FINANCES);
    } catch (error) {
      req.flash("error_msg", alert.FINANCE_ERROR_DELETE);
      res.redirect(REDIRECT_FINANCES);
    }
  },

  async updateFinance(req, res) {
    const financeId = req.params.id;
    const { date, type, value, category, description, userId } = req.body;
    try {
      const updatedFinance = await Finance.findByIdAndUpdate(
        financeId,
        {
          date: date,
          type: type,
          value: value,
          category: category,
          description: description,
          userId: userId,
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
  async searchFinance(req, res) {
    try {
      const { term } = req.query;
      const Op = sequelize.Op;

      const finances = await Finance.findAll({
        where: {
          date: {
            [Op.like]: `%${term}%`,
          },
        },
        raw: true,
      });

      const users = await User.findAll();
    
      res.render("admin/finance/finances", {
        finances: finances,
        users: users.map((user) => user.toJSON()),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async createExcel(req, res) {
    try {
      const finances = await Finance.findAll({
        raw: true,
      });

      const type1Finances = finances.filter((finance) => finance.type === 1);
      const type2Finances = finances.filter((finance) => finance.type === 2);
      const totalType1 = type1Finances.reduce((total, finance) => total + finance.value, 0);
      const totalType2 = type2Finances.reduce((total, finance) => total + finance.value, 0);
      const difference = totalType1 - totalType2;
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Relatório Financeiro');
  
      worksheet.addRow(['Nome', 'CPF', 'Tipo', 'Data', 'Valor', 'Categoria', 'Descrição', 'Total Entrada', 'Total Saída', "Relação"]); // Substitua 'ID' por 'CPF'
  
      for (const finance of finances) {
        const tipo = finance.type === 1 ? 'Saída' : 'Entrada';
        const categoria = categoryMapping[finance.category] || 'Desconhecida';
        const user = await User.findOne({ where: { id: finance.userId } });
  
        worksheet.addRow([
          user ? user.name.toUpperCase() : 'Desconhecido',
          user ? user.cpf : 'Desconhecido',
          tipo,
          finance.date,
          finance.value,
          categoria,
          finance.description,
          totalType1,
          totalType2,
          difference
        ]);
      }
  
      const excelFileName = 'relatorio_financeiro_total.xlsx';
      const excelBuffer = await workbook.xlsx.writeBuffer();
  
      res.setHeader('Content-Disposition', `attachment; filename=${excelFileName}`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
      res.send(excelBuffer);
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Erro ao criar o arquivo Excel');
      res.redirect(REDIRECT_FINANCES);
    }
  },

  async createExcelDate(req, res) {
    try {
      const { datastart, datafinal } = req.body;
      const finances = await Finance.findAll({
        raw: true,
        where: {
          date: {
            [sequelize.Op.between]: [datastart, datafinal],
          },
        },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Relatório Financeiro');

      worksheet.addRow(['Nome', 'CPF', 'Tipo', 'Data', 'Valor', 'Categoria', 'Descrição']);

      for (const finance of finances) {
        const tipo = finance.type === 1 ? 'Saída' : 'Entrada';
        const categoria = categoryMapping[finance.category] || 'Desconhecida';
        const user = await User.findOne({ where: { id: finance.userId } });

        worksheet.addRow([
          user ? user.name.toUpperCase() : 'Desconhecido',
          user ? user.cpf : 'Desconhecido',
          tipo,
          finance.date,
          finance.value,
          categoria,
          finance.description,
        ]);
      }
      const excelFileName = 'relatorio_financeiro.xlsx';
      const excelBuffer = await workbook.xlsx.writeBuffer();

      res.setHeader('Content-Disposition', `attachment; filename=${excelFileName}`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      res.send(excelBuffer);
    } catch (error) {
      console.error(error)
      req.flash('error_msg', 'Erro ao criar o arquivo Excel');
      res.redirect(REDIRECT_FINANCES);
    }
  },

}

module.exports = FinanceController
