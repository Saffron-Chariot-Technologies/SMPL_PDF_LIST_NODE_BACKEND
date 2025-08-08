const Appointment = require("../models/Appointment.js");
const DispositionReportModel = require("../models/DispositionReportModel.js");
const DistrictReportModel = require("../models/DistrictReportModel.js");
const InBoundCallStatusModel = require("../models/InBoundCallStatusModel.js");
const callStatusModel = require("../models/InBoundCallStatusModel.js");
const OutBoundCallStatusModel = require("../models/OutBoundCallStatusModel.js");
const SampleCallModel = require("../models/SampleCallModel.js");
const satifaction = require("../models/satifaction.js");

exports.     
addCallStatusInBound = async (req, res) => {
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


//API to get all inBoundCallStatus which has type:daily, for that month  and year given from frontend.
exports.getInboundDailySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "daily",
      date: {
        $gte: new Date(Date.UTC(year, month, 1)),
        $lt: new Date(Date.UTC(year, month + 1, 1))
      }
    };

    // console.log(query);  
    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await InBoundCallStatusModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await InBoundCallStatusModel.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}


// API appliled on inBound when selevcted month
exports.getInBoundMonthlySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    // const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "monthly",
      date: {
        $gte: new Date(Date.UTC(year, 0, 1)),
        $lt: new Date(Date.UTC(year + 1, 0, 1))
      }
    };

    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await InBoundCallStatusModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await InBoundCallStatusModel.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

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
    console.log(toReturn,"toReturn");
    if (!toReturn) {
      return res.status(200).json({ message: "data not found for this date and type" });
    }
    return res.status(200).json({ message: "data found success", data: toReturn });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}


//API to get all OutBoundCallStatus  to give all data of selected  date conatining year and month and if not selected date then by default gives current month data.
exports.getOutboundDailySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "daily",
      date: {
        $gte: new Date(Date.UTC(year, month, 1)),
        $lt: new Date(Date.UTC(year, month + 1, 1))
      }
    };

    // console.log(query);  
    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await OutBoundCallStatusModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await OutBoundCallStatusModel.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}

// API appliled ootBound when selected month: gives data  for current year or selected year from given date from frontend.
exports.getOutBoundMonthlySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    // const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "monthly",
      date: {
        $gte: new Date(Date.UTC(year, 0, 1)),
        $lt: new Date(Date.UTC(year + 1, 0, 1))
      }
    };

    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await OutBoundCallStatusModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await OutBoundCallStatusModel.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}


exports.deleteOutBoundById = async (req, res) => {
  try {
    const docId = req.params.id;
    const result = await OutBoundCallStatusModel.deleteOne({ _id: new Object(docId) });
    if (result?.deletedCount === 1) {
      return res.status(200).json({ message: "data deleted success" });
    }
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
      }
    } else {
      toInsert = JSON.parse(req.body.data);
    }

    toInsert.userId = req.user.userId;
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

//API to get all DistrictReport  to give all data of selected  date conatining year and month and if not selected date then by default gives current month data.
exports.getDistrictReportDailySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "daily",
      date: {
        $gte: new Date(Date.UTC(year, month, 1)),
        $lt: new Date(Date.UTC(year, month + 1, 1))
      }
    };

    // console.log(query);  
    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await DistrictReportModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await DistrictReportModel.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}

// API appliled DistrictReport when selected month: gives data  for current year or selected year from given date from frontend.
exports.getDistrictReportMonthlySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    // const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "monthly",
      date: {
        $gte: new Date(Date.UTC(year, 0, 1)),
        $lt: new Date(Date.UTC(year + 1, 0, 1))
      }
    };

    console.log(query);
    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await DistrictReportModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await DistrictReportModel.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this year", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

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



//API to get all DispositionReport  to give all data of selected  date conatining year and month and if not selected date then by default gives current month data.
exports.getDispositionReportDailySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "daily",
      date: {
        $gte: new Date(Date.UTC(year, month, 1)),
        $lt: new Date(Date.UTC(year, month + 1, 1))
      }
    };

    // console.log(query);  
    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await DispositionReportModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await DispositionReportModel.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}

// API appliled DispositionReport when selected month: gives data  for current year or selected year from given date from frontend.
exports.getDispositionReportMonthlySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    // const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "monthly",
      date: {
        $gte: new Date(Date.UTC(year, 0, 1)),
        $lt: new Date(Date.UTC(year + 1, 0, 1))
      }
    };


    console.log(query);
    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await DispositionReportModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await DispositionReportModel.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

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


//API to get all SampleCall  to give all data of selected  date conatining year and month and if not selected date then by default gives current month data.
exports.getSampleCallDailySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "daily",
      date: {
        $gte: new Date(Date.UTC(year, month, 1)),
        $lt: new Date(Date.UTC(year, month + 1, 1))
      }
    };

    // console.log(query);  
    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await SampleCallModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await SampleCallModel.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}

// API appliled Sample calls when selected month: gives data  for current year or selected year from given date from frontend.
exports.getSampleCallMonthlySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    // const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "monthly",
      date: {
        $gte: new Date(Date.UTC(year, 0, 1)),
        $lt: new Date(Date.UTC(year + 1, 0, 1))
      }
    };


    console.log(query);
    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await SampleCallModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await SampleCallModel.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}


exports.addAppointment = async (req, res) => {
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
    const alreadyPresent = await Appointment.findOne({ type: toInsert.type, date: toInsert.date });
    if (alreadyPresent) {
      return res.status(409).json({ message: "same date data already entered", alreadyPresent });
    }
    const appointment = new Appointment(toInsert);
    const result = await appointment.save();
    if (result) {
      return res.status(200).json({ message: "data added successfully", data: result });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });

  }
}

exports.getAppointmentByDate = async (req, res) => {
  try {
    // console.log(req.query.status);
    // console.log(req.query.date);
    const type = req.query.type; // daily or monthly
    let date = req.query.date;
    date = new Date(date); // convert string format of date into object. since date object cannot comes  in query ,being converted to string , nd date object is not convertabl in string
    const toReturn = await Appointment.findOne({ type: type, date: date });
    if (!toReturn) {
      return res.status(200).json({ message: "data not found for ths date and type" });
    }
    return res.status(200).json({ message: "data found success", data: toReturn });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ message: "No appointments found", data: [] });
    }

    return res.status(200).json({ message: "Appointments retrieved successfully", data: appointments });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


exports.getAllAppointmentsDailySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "daily",
      date: {
        $gte: new Date(Date.UTC(year, month, 1)),
        $lt: new Date(Date.UTC(year, month + 1, 1))
      }
    };

    // console.log(query);  
    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await Appointment.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await Appointment.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
};
exports.getAppointmentsByMonth = async (req, res) => {
  try {
    let date;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    let date1 = req.query.date;

    if (date1) {
      date = new Date(date1);
    } else {
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for appointments within the specified month and year
    const query = {
      type: "monthly", // Adjust if your Appointment model has a different type structure
      date: {
        $gte: new Date(Date.UTC(year, month, 1)),
        $lt: new Date(Date.UTC(year, month + 1, 1))
      }
    };

    // Fetch paginated data
    const appointments = await Appointment.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const totalDocs = await Appointment.countDocuments(query);

    if (appointments.length === 0) {
      return res.status(200).json({ message: "No appointments found for this month", data: [], totalDocs: 0 });
    }

    return res.status(200).json({ message: "Appointments retrieved successfully", data: appointments, totalDocs });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
exports.deleteAppointmentById = async (req, res) => {
  try {
    const docId = req.params.id;
    const result = await Appointment.deleteOne({ _id: new Object(docId) });
    if (result?.deletedCount === 1) {
      return res.status(200).json({ message: "data deleted success" });
    }
    // console.log(result,"hdgdg");
    return res.status(200).json({ message: "data not found to delete" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
};







exports.satifaction = async (req, res) => {
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
    const alreadyPresent = await satifaction.findOne({ type: toInsert.type, date: toInsert.date });
    if (alreadyPresent) {
      return res.status(409).json({ message: "same date data already entered", alreadyPresent });
    }
    const satifact = new satifaction(toInsert);
    const result = await satifact.save();
    if (result) {
      return res.status(200).json({ message: "data added successfully", data: result });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });

  }
}

exports.getAllsatifactions = async (req, res) => {
  try {
    const satifactions = await satifaction.find();

    if (!satifactions || satifactions.length === 0) {
      return res.status(200).json({ message: "No satifactions found", data: [] });
    }

    return res.status(200).json({ message: "satifactions retrieved successfully", data: satifactions });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
exports.deletesatifactionById = async (req, res) => {
  try {
    const docId = req.params.id;
    const result = await satifaction.deleteOne({ _id: new Object(docId) });
    if (result?.deletedCount === 1) {
      return res.status(200).json({ message: "data deleted success" });
    }
    // console.log(result,"hdgdg");
    return res.status(200).json({ message: "data not found to delete" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
};

exports.getAllsatifactionDailySelected = async (req, res) => {
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
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for records within the specified month and year
    const query = {
      type: "daily",
      date: {
        $gte: new Date(Date.UTC(year, month, 1)),
        $lt: new Date(Date.UTC(year, month + 1, 1))
      }
    };

    // console.log(query);  
    /*
{
  type: 'daily',
  date: { '$gte': 2024-07-01T00:00:00.000Z, '$lt': 2024-08-01T00:00:00.000Z }
}
    */
    const toReturn = await satifaction.find(query).sort({ date: -1 }).skip(skip).limit(limit);

    const totalDocs = await satifaction.find(query);

    if (toReturn.length === 0) {
      return res.status(200).json({ message: "data not found for this month", data: toReturn });
    }
    return res.status(200).json({ message: "data found success", data: toReturn, totalDocs: totalDocs.length });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
};
exports.getsatifactionsByMonth = async (req, res) => {
  try {
    let date;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    let date1 = req.query.date;

    if (date1) {
      date = new Date(date1);
    } else {
      const temp = new Date();
      date = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)

    // Query for satifactions within the specified month and year
    const query = {
      type: "monthly", // Adjust if your satifaction model has a different type structure
      date: {
        $gte: new Date(Date.UTC(year, month, 1)),
        $lt: new Date(Date.UTC(year, month + 1, 1))
      }
    };

    // Fetch paginated data
    const satifactions = await satifaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const totalDocs = await satifaction.countDocuments(query);

    if (satifactions.length === 0) {
      return res.status(200).json({ message: "No satifactions found for this month", data: [], totalDocs: 0 });
    }

    return res.status(200).json({ message: "satifactions retrieved successfully", data: satifactions, totalDocs });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.getsatifactionByDate = async (req, res) => {
  try {
    // console.log(req.query.status);
    // console.log(req.query.date);
    const type = req.query.type; // daily or monthly
    let date = req.query.date;
    date = new Date(date); // convert string format of date into object. since date object cannot comes  in query ,being converted to string , nd date object is not convertabl in string
    const toReturn = await satifaction.findOne({ type: type, date: date });
    if (!toReturn) {
      return res.status(200).json({ message: "data not found for ths date and type" });
    }
    return res.status(200).json({ message: "data found success", data: toReturn });

  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}
