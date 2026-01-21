const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/expressError");
const Review = require("./models/review");

/* -------------------- LOGIN CHECK -------------------- */
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

/* -------------------- LISTING AUTHORIZATION -------------------- */
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

/* -------------------- SAVE REDIRECT URL -------------------- */
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.saveRedirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};

/* -------------------- LISTING VALIDATION (✅ FIXED) -------------------- */
module.exports.validateListings = (req, res, next) => {
  const { error } = listingSchema.validate(req.body, {
    stripUnknown: true,   // ✅ THIS IS THE FIX
  });

  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

/* -------------------- REVIEW VALIDATION -------------------- */
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

/* -------------------- REVIEW AUTHORIZATION -------------------- */
module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
