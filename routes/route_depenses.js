const express = require("express");
const Router = express.Router();

const Expense_Controller = require("../controller/depenses_controller");

Router.post("/expenses",Expense_Controller.createExpenses);
Router.get("/expenses/month/:userId",Expense_Controller.getExpensesByUserMonth);
Router.get("/expenses/day/:userId",Expense_Controller.getExpensesByUserDay);

module.exports = Router;