const express = require("express");
const Router = express.Router();

const Categories_Controller = require("../controller/categorie_controller");
const middleware = require("../middlewares/AuthMiddleware");

Router.post("/",Categories_Controller.createCategory);
Router.get("/:userId",Categories_Controller.getCategories);

module.exports = Router;