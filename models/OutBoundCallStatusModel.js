const mongoose = require("mongoose");

const OutBoundCallStatusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: { type: Date, required: true },
    image: {
        type: [String],
        // set: v => (typeof v === 'string' ? [v] : Array.isArray(v) ? v : []),
        get: v => (typeof v === 'string' ? [v] : Array.isArray(v) ? v : []),
        required: false
    },
    type: { type: String, enum: ["monthly", "daily"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("OutBoundCallStatus", OutBoundCallStatusSchema);