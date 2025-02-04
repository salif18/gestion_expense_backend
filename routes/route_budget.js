const express = require("express");
const Router = express.Router();

const Budget_Controller = require("../controller/budget_controller");
const middleware = require("../middlewares/AuthMiddleware");

Router.post("/",Budget_Controller.createBudgets);
Router.get("/current_budget/:userId",Budget_Controller.getCurrentBudget);
Router.get("/all/budgets/:userId",Budget_Controller.getAllBudget);
Router.get("/rapports_currentBudget/:userId",Budget_Controller.getRapportsCurrentBudget)

module.exports = Router;