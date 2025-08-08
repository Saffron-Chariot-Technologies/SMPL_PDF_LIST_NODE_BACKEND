const mongoose = require("mongoose");

const satifactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    satisfied: { type: Number, required: true },
    notsatisfied: { type: Number, required: true },
    date: { type: Date, required: true },
    image: { type: String, required: false },
    type: { type: String, enum: ["monthly", "daily"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("satifaction", satifactionSchema);