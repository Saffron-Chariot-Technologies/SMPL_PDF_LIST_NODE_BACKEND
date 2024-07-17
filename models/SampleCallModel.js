const mongoose=require("mongoose");

const sampleCallSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     type:{type:String,required:true},
     date:{type:Date,required:true},
     voiceCall:{type:String,required:false},
},{timeseries:true})

module.exports=mongoose.model("SampleCalls",sampleCallSchema);