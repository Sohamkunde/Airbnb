const User = require("../models/user");

/* -------------------- SIGNUP FORM -------------------- */
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

/* -------------------- SIGNUP LOGIC (AUTO LOGIN) -------------------- */
module.exports.signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const newUser = new User({ username });
    const registeredUser = await User.register(newUser, password);

    // 🔑 Auto login after signup
    req.login(registeredUser, err => {
      if (err) return next(err);

      req.flash("success", "Welcome! Your account has been created.");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

/* -------------------- LOGIN FORM -------------------- */
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

/* -------------------- LOGIN SUCCESS -------------------- */
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.saveRedirectUrl || "/listings";
  res.redirect(redirectUrl);
};

/* -------------------- LOGOUT -------------------- */
module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};
