const mongoose = require("mongoose");

const dispositionReportSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   type: { type: String, enum: ["monthly", "daily"], required: true },
   date: { type: Date, required: true },
   table1: { type: String, required: false },
   graph: { type: String, required: false },
   table2: { type: String, required: false },
}, { timestamps: true }
);

module.exports = mongoose.model("DispositionReport", dispositionReportSchema);