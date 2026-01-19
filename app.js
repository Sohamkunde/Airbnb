if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");
const ExpressError = require("./utils/expressError");

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");

/* -------------------- CONFIG -------------------- */
const dburl = process.env.ATLAS_DB;
const port = process.env.PORT || 10000;

/* -------------------- DB CONNECTION -------------------- */
mongoose
  .connect(dburl)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ Mongo Error:", err));

/* -------------------- VIEW ENGINE -------------------- */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

/* -------------------- SESSION STORE -------------------- */
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("❌ SESSION STORE ERROR:", err);
});

/* -------------------- SESSION -------------------- */
app.use(
  session({
    store,
    name: "session",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(flash());

/* -------------------- PASSPORT -------------------- */
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* -------------------- GLOBAL VARIABLES -------------------- */
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

/* -------------------- ROUTES -------------------- */
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  return res.redirect("/listings");
});

/* -------------------- 404 HANDLER (FIXED) -------------------- */
app.all("/", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

/* -------------------- ERROR HANDLER (CRITICAL FIX) -------------------- */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // 🔥 prevents headers already sent error
  }

  const statusCode = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).render("listings/error.ejs", { message });
});

/* -------------------- SERVER -------------------- */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
