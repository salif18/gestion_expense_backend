const express = require("express");
const Router = express.Router();

const Reset_Controller = require("../controller/reset_controller");

Router.post("/reset_password",Reset_Controller.resetPassword);
Router.post("/validate_password",Reset_Controller.validatePasswordReset);

module.exports = Router;