if(process.env.NODE_ENV!="production")
{require('dotenv').config()}
console.log(process.env.SECRET)
const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/expressError");
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const bookingRoutes = require("./routes/bookings");

const userRouter = require("./routes/user");
const { reviewSchema } = require("./schema");

const multer = require('multer');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const port = 8080;

/* -------------------- DB CONNECTION -------------------- */
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

/* -------------------- VIEW ENGINE -------------------- */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* -------------------- MIDDLEWARE -------------------- */
// these is use for upload url image in the form of link so these is used
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

/* -------------------- SESSION -------------------- */
app.use(
  session({
    secret: "mysupercode",
    resave: false,
    saveUninitialized: true,
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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


/* -------------------- ROUTES -------------------- */
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/listings/:id/bookings", bookingRoutes);

app.use("/", userRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

/* -------------------- 404 HANDLER -------------------- */
app.all("/", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.log("🔥 REAL ERROR 👉", err);

  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});


/* -------------------- SERVER -------------------- */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
