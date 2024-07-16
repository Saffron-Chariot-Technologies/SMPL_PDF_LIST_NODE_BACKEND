const mongoose =require("mongoose");

const dispositionReportSchema=new mongoose.Schema({
 userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
 },
 type:{type:String,required:true},
 date:{type:Date,required:true},
 excel:{type:String,required:false},
 graph:{type:String,required:false},
 image:{type:String,required:false},
}
);

module.exports=mongoose.model("DispositionReport",dispositionReportSchema);