const mongoose = require("mongoose");

const voiceCallSchema = new mongoose.Schema({
    file: String,
    time: String,
    fileName: String
}, { _id: false });

const sampleCallSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    voiceCall: { type: [voiceCallSchema], default: [] },
}, { timestamps: true })

module.exports = mongoose.model("SampleCalls", sampleCallSchema);