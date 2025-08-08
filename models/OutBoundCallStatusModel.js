const mongoose = require("mongoose");

const OutBoundCallStatusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: { type: Date, required: true },
    image: { type: [String], required: false },
    type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("OutBoundCallStatus", OutBoundCallStatusSchema);