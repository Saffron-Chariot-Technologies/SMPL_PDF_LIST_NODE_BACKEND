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
  getDispositionReportByDate

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
  { name: 'excel', maxCount: 1 },
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]),auth,addDispositionReport);

router.get("/getDispositionReportByDate",auth,getDispositionReportByDate);


//######### belw this API for showing data in SMPL frontedn will be made


module.exports = router;

