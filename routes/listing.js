const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const listingsController = require("../controllers/listings");

const multer = require("multer");
const { storage } = require("../cloudconfig");
const upload = multer({ storage });

const {
  isLoggedIn,
  isOwner,
  validateListings
} = require("../middleware");

/* -------------------- INDEX + CREATE -------------------- */
router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),   // image upload
    validateListings,                  // Joi validation
    wrapAsync(listingsController.createListing)
  );

/* -------------------- NEW -------------------- */
router.get(
  "/new",
  isLoggedIn,
  listingsController.renderNewForm
);

/* -------------------- SHOW + UPDATE + DELETE -------------------- */
router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListings,
    wrapAsync(listingsController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.deleteListing)
  );

/* -------------------- EDIT -------------------- */
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm)
);

module.exports = router;
