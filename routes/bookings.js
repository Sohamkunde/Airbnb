const express = require("express");
const router = express.Router({ mergeParams: true });
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// =======================
// CREATE BOOKING
// =======================
router.post("/", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const booking = new Booking(req.body.booking);
  booking.user = req.user._id;
  booking.listing = listing._id;

  await booking.save();

  req.flash("success", "Booking confirmed 🎉");
  res.redirect(`/listings/${id}`);
});

// =======================
// OWNER - VIEW BOOKINGS
// =======================
router.get("/owner", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  // 1️⃣ Fetch listing
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // 2️⃣ Owner authorization
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "Access denied");
    return res.redirect(`/listings/${id}`);
  }

  // 3️⃣ Fetch bookings
  const bookings = await Booking.find({ listing: id })
    .populate("user");

  // 4️⃣ Render dashboard
  res.render("bookings/owner", { bookings, listing });
});

module.exports = router;
