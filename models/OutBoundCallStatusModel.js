const mongoose=require("mongoose");

const OutBoundCallStatusSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    date:{type:Date,required:true},
    image:{type:String,required:true},
    type:{type:String,required:true}
},{timestamps:true})

exports.module=mongoose.model("OutBoundCallStatus",OutBoundCallStatusSchema);