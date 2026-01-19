const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor
} = require("../middleware");

const reviewsController = require("../controllers/reviews");

/* -------------------- CREATE REVIEW -------------------- */
router
  .route("/")
  .post(
    isLoggedIn,
    validateReview,
    wrapAsync(reviewsController.createReview)
  );

/* -------------------- DELETE REVIEW -------------------- */
router
  .route("/:reviewId")
  .delete(
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewsController.deleteReview)
  );

module.exports = router;
