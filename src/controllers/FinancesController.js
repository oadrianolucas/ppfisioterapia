const Finance = require("../models/Finance")
const User = require("../models/User")
const File = require("../models/File")
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
    try {
      await Finance.create({
        type: type,
        date: date,
        value: value,
        category: category,
        description: description,
        userId: userId,
      })
      res.redirect(REDIRECT_FINANCES);
    } catch (error) {
      req.flash("error_msg", alert.FINANCE_ERROR)
      res.redirect(REDIRECT_FINANCES);
    }
  },
  async allFinances(req, res) {
    try {
      const finances = await Finance.findAll({
        raw: true,
      });
      const type1Finances = finances.filter((finance) => finance.type === 1);
      const type2Finances = finances.filter((finance) => finance.type === 2);
      const totalType1 = type1Finances.reduce((total, finance) => total + finance.value, 0);
      const totalType2 = type2Finances.reduce((total, finance) => total + finance.value, 0);
      const difference = totalType1 - totalType2;

      const users = await User.findAll();
      const financePromises = finances.map(async (finance) => {
        const files = await File.findAll({
          where: { financeId: finance.id },
          raw: true,
        });
        return {
          ...finance,
          files: files,
        };
      });
  
      const financeData = await Promise.all(financePromises);
  
      res.render("admin/finance/finances", {
        finances: financeData,
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

      // Verifique se existem arquivos relacionados a esta entrada financeira
      const files = await File.findAll({
        where: { financeId: finance.id },
      });

      if (files.length > 0) {
        // Se houver arquivos relacionados, envie uma mensagem de erro e não exclua a entrada financeira
        req.flash("error_msg", "Não é possível excluir esta entrada financeira, pois há arquivos relacionados a ela.");
        return res.redirect(REDIRECT_FINANCES);
      }

      // Se não houver arquivos relacionados, exclua a entrada financeira
      await finance.destroy();
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
      const financePromises = finances.map(async (finance) => {
        const files = await File.findAll({
          where: { financeId: finance.id },
          raw: true,
        });
        return {
          ...finance,
          files: files,
        };
      });

      const financeData = await Promise.all(financePromises);
      res.render("admin/finance/finances", {
        finances: financeData,
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

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Relatório Financeiro');

      worksheet.addRow(['ID', 'Tipo', 'Data', 'Valor', 'Categoria', 'Descrição', 'ID do Agendamento']);

      finances.forEach((finance) => {
        const tipo = finance.type === 1 ? 'Saída' : 'Entrada';
        const categoria = categoryMapping[finance.category] || 'Desconhecida';

        worksheet.addRow([
          finance.id,
          tipo,
          finance.date,
          finance.value,
          categoria,
          finance.description,
          finance.userId,
        ]);
      });

      const excelFileName = 'relatorio_financeiro_total.xlsx';
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

      worksheet.addRow(['ID', 'Tipo', 'Data', 'Valor', 'Categoria', 'Descrição', 'ID do Agendamento']);

      finances.forEach((finance) => {
        const tipo = finance.type === 1 ? 'Saída' : 'Entrada';
        const categoria = categoryMapping[finance.category] || 'Desconhecida';

        worksheet.addRow([
          finance.id,
          tipo,
          finance.date,
          finance.value,
          categoria,
          finance.description,
          finance.userId,
        ]);
      });

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
