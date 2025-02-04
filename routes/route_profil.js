const express = require("express");
const Router = express.Router();

const Profil_Controller = require("../controller/profil_controller");
const middleware = require("../middlewares/AuthMiddleware");


Router.post("/update/:userId",middleware,Profil_Controller.updateProfil);


module.exports = Router;