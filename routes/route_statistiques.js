const express = require("express");
const Router = express.Router();

const Stats_Controller = require("../controller/stats_controller");

Router.get("/week_stats/:userId",Stats_Controller.getExpensesByWeek);
Router.get("/daybymonth_stats/:userId",Stats_Controller.getExpensesAllDayByMonth);
Router.get("/month_stats/:userId",Stats_Controller.getExpensesByMonth);
Router.get("/year_stats/:userId",Stats_Controller.getAllExpensesForYear);
Router.get("/most_expenses/:userId",Stats_Controller.mostCategoriExpenses);
Router.get("/all_year_stats/:userId",Stats_Controller.getAllExpensesForYear);

module.exports = Router;