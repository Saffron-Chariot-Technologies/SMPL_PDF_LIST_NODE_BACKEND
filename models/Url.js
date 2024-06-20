const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    urlKeyName: { type: String, required: true },
    date: { type: Date, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
); // This adds createdAt and updatedAt fields

module.exports = mongoose.model("Url", UrlSchema);
