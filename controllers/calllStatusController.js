const DispositionReportModel = require("../models/DispositionReportModel.js");
const DistrictReportModel = require("../models/DistrictReportModel.js");
const InBoundCallStatusModel = require("../models/InBoundCallStatusModel.js");
const callStatusModel = require("../models/InBoundCallStatusModel.js");
const OutBoundCallStatusModel = require("../models/OutBoundCallStatusModel.js");
const SampleCallModel = require("../models/SampleCallModel.js");

exports.addCallStatusInBound = async (req, res) => {
  try {
    // console.log(req,"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

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

    // console.log(toInsert,"HGFFHFG");
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


//get API to inBoundCallStatus  data when selected month : to gve all monthly data of  collection
exports.getAllMonthlyInBound = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const inBoundCallStatusData = await callStatusModel.find({ type: "monthly" }).sort({ date: -1 }).skip(skip).limit(limit);
    return res.status(200).json({ message: "data found", data: inBoundCallStatusData });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}




exports.deleteInBoundById = async (req, res) => {
  try {
    const docId = req.params.id;
    const result = await InBoundCallStatusModel.deleteOne({ _id: new Object(docId) });
    if (result?.deletedCount === 1) {
      return res.status(200).json({ message: "data deleted success" });
    }
    // console.log(result,"hdgdg");
    return res.status(200).json({ message: "data not found to delete" });
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
    const dataId = req.params.id
    const updatedData = await callStatusModel.findByIdAndUpdate(
      { _id: dataId },
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


// API to get data by single date:: frontend APIs
exports.getCallStatusDataByDate = async (req, res) => {
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


//API to get all inBoundCallStatus which has type daily.
exports.getInboundByMonth = async (req, res) => {
  try {

    let date;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    let date1 = req.query.date;
    if (date1) {
      date = new Date(date1);
    }
    else {
      date = new Date();
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const toReturn = await InBoundCallStatusModel.find({
      type:"daily",
      date: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1)
      }
    }).sort({ date: -1 }).skip(skip).limit(limit);
    
    const totalDocs = await InBoundCallStatusModel.find({
      type:"daily",
      date: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1)
      }
    });

    if (toReturn.length===0) {
      return res.status(200).json({ message: "data not found for this month" ,data:toReturn});
    }
    return res.status(200).json({ message: "data found success", data:toReturn,totalDocs:toReturn.length });

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
    // console.log(toInsert,"HGFFHFG");
    const alreadyPresent = await OutBoundCallStatusModel.findOne({ type: toInsert.type, date: toInsert.date });
    if (alreadyPresent) {
      return res.status(409).json({ message: "same date data already entered", alreadyPresent });
    }
    const outBoundData = new OutBoundCallStatusModel(toInsert);
    const result = await outBoundData.save();
    if (result) {
      return res.status(200).json({ message: "data added successfully", data: result });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });

  }
}



//Applied on frontend
exports.getOutBoundCallStatusByDate = async (req, res) => {
  try {
    const type = req.query.type; // daily or monthly
    let date = req.query.date;
    date = new Date(date); // convert string format of date into object. since date object cannot comes  in query ,being converted to string , nd date object is not convertabl in string
    const toReturn = await OutBoundCallStatusModel.findOne({ type: type, date: date });
    if (!toReturn) {
      return res.status(200).json({ message: "data not found for ths date and type" });
    }
    return res.status(200).json({ message: "data found success", data: toReturn });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}


//API to get data 
exports.getAllMonthlyOutBoundData=async(req,res)=>{

}


exports.deleteOutBoundById = async (req, res) => {
  try {
    const docId = req.params.id;
    const result = await OutBoundCallStatusModel.deleteOne({ _id: new Object(docId) });
    if (result?.deletedCount === 1) {
      return res.status(200).json({ message: "data deleted success" });
    }
    // console.log(result,"hdgdg");
    return res.status(200).json({ message: "data not found to delete" });
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
    // console.log(toInsert,"HGFFHFG");
    const alreadyPresent = await DistrictReportModel.findOne({ type: toInsert.type, date: toInsert.date });
    if (alreadyPresent) {
      return res.status(409).json({ message: "same date data already entered", alreadyPresent });
    }
    const districtReportData = new DistrictReportModel(toInsert);
    const result = await districtReportData.save();
    if (result) {
      return res.status(200).json({ message: "data added successfully", data: result });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });

  }
}


exports.getDistrictReportsByDate = async (req, res) => {
  try {
    // console.log(req.query.status);
    // console.log(req.query.date);
    const type = req.query.type; // daily or monthly
    let date = req.query.date;
    date = new Date(date); // convert string format of date into object. since date object cannot comes  in query ,being converted to string , nd date object is not convertabl in string
    const toReturn = await DistrictReportModel.findOne({ type: type, date: date });
    if (!toReturn) {
      return res.status(200).json({ message: "data not found for ths date and type" });
    }
    return res.status(200).json({ message: "data found success", data: toReturn });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}

exports.deleteDistrictReportById = async (req, res) => {
  try {
    const docId = req.params.id;
    const result = await DistrictReportModel.deleteOne({ _id: new Object(docId) });
    if (result?.deletedCount === 1) {
      return res.status(200).json({ message: "data deleted success" });
    }
    // console.log(result,"hdgdg");
    return res.status(200).json({ message: "data not found to delete" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}


//##############################################   Disposition Report  APIs

exports.addDispositionReport = async (req, res) => {
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
    // console.log(toInsert,"HGFFHFG");
    const alreadyPresent = await DispositionReportModel.findOne({ type: toInsert.type, date: toInsert.date });
    if (alreadyPresent) {
      return res.status(409).json({ message: "same date data already entered", alreadyPresent });
    }
    const dispositionReportData = new DispositionReportModel(toInsert);
    const result = await dispositionReportData.save();
    if (result) {
      return res.status(200).json({ message: "data added successfully", data: result });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });

  }
}


//API used in frontend 
exports.getDispositionReportByDate = async (req, res) => {
  try {
    // console.log(req.query.status);
    // console.log(req.query.date);
    const type = req.query.type; // daily or monthly
    let date = req.query.date;
    date = new Date(date); // convert string format of date into object. since date object cannot comes  in query ,being converted to string , nd date object is not convertabl in string
    const toReturn = await DispositionReportModel.findOne({ type: type, date: date });
    if (!toReturn) {
      return res.status(200).json({ message: "data not found for ths date and type" });
    }
    return res.status(200).json({ message: "data found success", data: toReturn });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}

exports.deleteDispositionReportById = async (req, res) => {
  try {
    const docId = req.params.id;
    const result = await DispositionReportModel.deleteOne({ _id: new Object(docId) });
    if (result?.deletedCount === 1) {
      return res.status(200).json({ message: "data deleted success" });
    }
    // console.log(result,"hdgdg");
    return res.status(200).json({ message: "data not found to delete" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}



//#########################################################  Samplecall APIs
exports.addSampleCalls = async (req, res) => {
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
    // console.log(toInsert,"HGFFHFG");
    const alreadyPresent = await SampleCallModel.findOne({ type: toInsert.type, date: toInsert.date });
    if (alreadyPresent) {
      return res.status(409).json({ message: "same date data already entered", alreadyPresent });
    }
    const sampleCallData = new SampleCallModel(toInsert);
    const result = await sampleCallData.save();
    if (result) {
      return res.status(200).json({ message: "data added successfully", data: result });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });

  }
}

exports.getSampleCallByDate = async (req, res) => {
  try {
    // console.log(req.query.status);..
    // console.log(req.query.date);
    const type = req.query.type; // daily or monthly
    let date = req.query.date;
    date = new Date(date); // convert string format of date into object. since date object cannot comes  in query ,being converted to string , nd date object is not convertabl in string
    const toReturn = await SampleCallModel.findOne({ type: type, date: date });
    if (!toReturn) {
      return res.status(200).json({ message: "data not found for ths date and type" });
    }
    return res.status(200).json({ message: "data found success", data: toReturn });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}


exports.deleteSampleCallById = async (req, res) => {
  try {
    const docId = req.params.id;
    const result = await SampleCallModel.deleteOne({ _id: new Object(docId) });
    if (result?.deletedCount === 1) {
      return res.status(200).json({ message: "data deleted success" });
    }
    // console.log(result,"hdgdg");
    return res.status(200).json({ message: "data not found to delete" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}

