const mongoose = require("mongoose");

const CallsStatusSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true },
        totalCalls: { type: Number, required: true },
        overAllAnswered: { type: Number, required: true },
        overAllAbandoned: { type: Number, required: true },
        answeredPer: { type: Number, required: true },
        ACHT: {
            type: [String], required: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
); // This adds createdAt and updatedAt fields

module.exports = mongoose.model("CallsStatus", CallsStatusSchema);
