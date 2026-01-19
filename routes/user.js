const express = require("express");
const router = express.Router();
const passport = require("passport");

const { saveRedirectUrl } = require("../middleware");
const usersController = require("../controllers/users");

/* -------------------- SIGNUP -------------------- */
router
  .route("/signup")
  .get(usersController.renderSignupForm)
  .post(usersController.signup);

/* -------------------- LOGIN -------------------- */
router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usersController.login
  );

/* -------------------- LOGOUT -------------------- */
router.get("/logout", usersController.logout);

module.exports = router;
