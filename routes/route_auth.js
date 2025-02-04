const express = require("express");
const Router = express.Router();

const Auth_Controller = require("../controller/auth_controller");
const middleware = require("../middlewares/AuthMiddleware");

Router.post("/registre",Auth_Controller.register);
Router.post("/login",Auth_Controller.login);
Router.post("/update_password/:userId",middleware,Auth_Controller.updatePassword);
Router.get("/delete",Auth_Controller.deleteAccount)

module.exports = Router;