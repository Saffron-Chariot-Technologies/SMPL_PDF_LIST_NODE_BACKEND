const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload=require("../middleware/imageMiddleware.js");
const {
  addCallStatusInBound,
  getAllInBoundCallStatusData,
  updateInBoundCallStatus,
  getCallStatusDataByDate,
  addOutBoundCallStatus,
  getOutBoundCallStatusByDate,
  addDistrictReport,
  getDistrictReportsByDate,
  addDispositionReport,
  getDispositionReportByDate,
  addSampleCalls,
  getSampleCallByDate

} = require("../controllers/calllStatusController.js");


router.post("/addCallStatus", upload.fields([
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]),auth,addCallStatusInBound);

router.get("/getAllInBoundCallStatusData",auth,getAllInBoundCallStatusData);

router.patch("/updateInBoundCallStatus/:id",upload.fields([
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]),auth,updateInBoundCallStatus);

router.get("/getCallStatus",auth,getCallStatusDataByDate);  // to getInBoundcallstatusdata by type: daily  or  monthly   and date

//Outbound

router.post("/addOutBoundCallStatus", upload.fields([
  { name: 'image', maxCount: 1 }
]),auth,addOutBoundCallStatus);

router.get("/getOutBoundCallStatusByDate",auth,getOutBoundCallStatusByDate);


//district report

router.post("/addDistrictReport", upload.fields([
  { name: 'excel', maxCount: 1 },
  { name: 'graph', maxCount: 1 }
]),auth,addDistrictReport);

router.get("/getDistrictReportByDate",auth,getDistrictReportsByDate);

//disposition report
router.post("/addDispositionReport", upload.fields([
  { name: 'table1', maxCount: 1 },
  { name: 'graph', maxCount: 1 },
  { name: 'table2', maxCount: 1 },
]),auth,addDispositionReport);

router.get("/getDispositionReportByDate",auth,getDispositionReportByDate);



//samplecall APIs

router.post("/addSampleCall",upload.fields([{name: 'voiceCall', maxCount: 1}]),auth,addSampleCalls);
router.get("/getSampleCallStatus",auth,getSampleCallByDate);

module.exports = router;

