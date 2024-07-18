const mongoose = require("mongoose");

const CallsStatusSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true },
        totalCalls: { type: Number, required: true },
        overAllAnswered: { type: Number, required: true },
        overAllAbandoned: { type: Number, required: true },
        answeredPercentage: { type: Number, required: true },
        ACHT: { type: Number, required: true },
        graph: {type:String, required: false },
        image: {type:String, required: false },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type:{type:String,required:true}  //  input should be "monthly" , or "daily"  , for filtering data based on monthly or daily eneterd data.
    },
    { timestamps: true }
); // This adds createdAt and updatedAt fields

module.exports = mongoose.model("CallsStatus", CallsStatusSchema);
