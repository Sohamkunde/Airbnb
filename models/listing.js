const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    filename: String,
    url: String,
  },

  price: Number,

  location: String,
  country: String,

  /* ================== 🌍 MAP LOCATION (NEW) ================== */
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  /* ============================================================ */

  // 🔑 OWNER FIELD (VERY IMPORTANT)
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  /* ================== 🔹 CATEGORY FEATURE ================== */
  category: {
    type: String,
    enum: [
      "trending",
      "rooms",
      "iconic",
      "mountains",
      "castles",
      "pools",
      "camping",
      "farms",
      "arctic",
    ],
    default: "trending",
  },
  /* ============================================================ */
});

/* -------------------- DELETE REVIEWS WHEN LISTING DELETED -------------------- */
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
