const DispositionReportModel = require("../models/DispositionReportModel.js");
const DistrictReportModel = require("../models/DistrictReportModel.js");
const callStatusModel = require("../models/InBoundCallStatusModel.js");
const OutBoundCallStatusModel = require("../models/OutBoundCallStatusModel.js");
exports.addCallStatusInBound = async (req, res) => {
  try {
    // console.log(req.user,"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

    let toInsert;
    if (Object.entries(req.files).length !== 0) {
      toInsert = JSON.parse(req.body.data);
      for (let i in req.files) {
        toInsert[i] = req.files[i][0]?.location;
        // console.log(i);
      }
    } else {
      toInsert = JSON.parse(req.body.data);
    }

    toInsert.userId = req.user.userId;

    const alreadyPresent = await callStatusModel.findOne({ type: toInsert.type, date: toInsert.date });
    if (alreadyPresent) {
      return res.status(409).json({ message: "same date data already entered", alreadyPresent });
    }
    // console.log(toInsert);
    const callStatusData = new callStatusModel(toInsert);
    const result = await callStatusData.save();
    if (result) {
      return res.status(200).json({ message: "data saved success", data: result });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}



exports.getAllInBoundCallStatusData=async(req,res)=>{
  try {
    const type=req.query.type;
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||15;
    const skip=(page-1)*limit;
    const inBoundCallStatusData=await callStatusModel.find({type:type}).sort({date:-1}).skip(skip).limit(limit);
     return res.status(200).json({message:"data found",data:inBoundCallStatusData});
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}


//API to edit the Incbound callstatus by date and status
exports.updateInBoundCallStatus = async (req, res) => {
  try {
    let toInsert;
    if (Object.entries(req.files).length !== 0) {
      toInsert = JSON.parse(req.body.data);
      for (let i in req.files) {
        toInsert[i] = req.files[i][0]?.location;
        // console.log(i);
      }
    } else {
      toInsert = JSON.parse(req.body.data);
    }

    toInsert.userId = req.user.userId;
    const dataId=req.params.id
    const updatedData = await callStatusModel.findByIdAndUpdate(
      {_id:dataId},
      { $set: toInsert },
      { new: true });

    if (!updatedData) {
      return res.status(200).json({ message: "data not found to update" });
    }
    return res.status(200).json({ message: "data updated success", data: updatedData });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });

  }
}




//######################################  OUTBOUND CALL STATUS APIS

exports.addOutBoundCallStatus = async (req, res) => {
  try {
    let toInsert;
    if (Object.entries(req.files).length !== 0) {
      toInsert = JSON.parse(req.body.data);
      for (let i in req.files) {
        toInsert[i] = req.files[i][0]?.location;
        // console.log(i);
      }
    } else {
      toInsert = JSON.parse(req.body.data);
    }

    toInsert.userId = req.user.userId;
    const outBoundData = new OutBoundCallStatusModel(toInsert);
    const result = await outBoundData.save();
    if (result) {
      return res.status(200).json({ message: "data added successfully", data: result });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });

  }
}



//######################################### District report APIs

exports.addDistrictReport = async (req, res) => {
  try {
    let toInsert;
    if (Object.entries(req.files).length !== 0) {
      toInsert = JSON.parse(req.body.data);
      for (let i in req.files) {
        toInsert[i] = req.files[i][0]?.location;
        // console.log(i);
      }
    } else {
      toInsert = JSON.parse(req.body.data);
    }

    toInsert.userId = req.user.userId;
    const districtReportData = new DistrictReportModel(toInsert);
    const result = await districtReportData.save();
    if (result) {
      return res.status(200).json({ message: "data added successfully", data: result });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });

  }
}



//##############################################   Disposition Report  APIs

exports.addDispositionReport=async(req,res)=>{
  try {
    let toInsert;
    if (Object.entries(req.files).length !== 0) {
      toInsert = JSON.parse(req.body.data);
      for (let i in req.files) {
        toInsert[i] = req.files[i][0]?.location;
        // console.log(i);
      }
    } else {
      toInsert = JSON.parse(req.body.data);
    }

    toInsert.userId = req.user.userId;
    const dispositionReportData = new DispositionReportModel(toInsert);
    const result = await dispositionReportData.save();
    if (result) {
      return res.status(200).json({ message: "data added successfully", data: result });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });

  }
}





//#########################################################  frontend APIs
// API to get data by single date
exports.getCallStatusData = async (req, res) => {
  try {
    // console.log(req.query.status);
    // console.log(req.query.date);
    const type = req.query.type; // daily or monthly
    let date = req.query.date;
    date = new Date(date); // convert string format of date into object. since date object cannot comes  in query ,being converted to string , nd date object is not convertabl in string
    const toReturn = await callStatusModel.findOne({ type: type, date: date });
    if (!toReturn) {
      return res.status(200).json({ message: "data not found for ths date and type" });
    }
    return res.status(200).json({ message: "data found success", data: toReturn });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}
