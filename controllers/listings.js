const Listing = require("../models/listing.js");

/* -------------------- INDEX (CATEGORY + SEARCH LOGIC) -------------------- */
module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let filter = {};

  // 🔹 CATEGORY FILTER
  if (category) {
    filter.category = category;
  }

  // 🔍 SEARCH FILTER (title, location, country)
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
    ];
  }

  const allListings = await Listing.find(filter);

  res.render("listings/index.ejs", {
    allListings,
    category: category || "",
    search: search || "",
  });
};

/* -------------------- NEW -------------------- */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

/* -------------------- SHOW -------------------- */
module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

/* -------------------- CREATE -------------------- */
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await newListing.save();
  req.flash("success", "Listing created!");
  res.redirect("/listings");
};

/* -------------------- EDIT -------------------- */
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

/* -------------------- UPDATE -------------------- */
module.exports.updateListing = async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { ...req.body.listing },
    { new: true }
  );

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${listing._id}`);
};

/* -------------------- DELETE -------------------- */
module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
