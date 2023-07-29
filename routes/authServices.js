const express = require("express");

const routes = express.Router();

const {
  signup,
  login,
  verifyGoogleAuth,
} = require("../services/authServices");

const {
  signupValidator,
  validateLogin,
} = require("../utils/validators/authValidator");


routes
  .route("/signup")
  .post(signupValidator, signup);

routes.route("/login").post(validateLogin, login);

routes.route("/googleLogin").post(verifyGoogleAuth);

module.exports = routes;
