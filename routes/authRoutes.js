const express = require("express");
const routes = express.Router();
const authController = require("../controller/authController");
const authValidation = require("../validation/authValidation");
/* GET users listing. */
routes.post("/register", authValidation.register, authController.register);
routes.post("/login", authValidation.login, authController.login);
routes.get("/logout", authValidation.logout, authController.logout);
routes.post("/forgotPassword",authValidation.forgotPassword,authController.forgotPassword)
routes.post('/resetPassword',authValidation.resetPassword,authController.resetPassword)
routes.post('/verify',authValidation.verify,authController.verify)


module.exports = routes;
