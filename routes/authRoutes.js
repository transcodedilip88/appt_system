const express = require("express");
const routes = express.Router();
const authController = require("../controller/authController");
const authValidation = require("../validation/authValidation");
/* GET users listing. */
routes.post("/register", authValidation.register, authController.register);
routes.post("/login", authValidation.login, authController.login);
routes.get("/logout", authValidation.logout, authController.logout);

module.exports = routes;
