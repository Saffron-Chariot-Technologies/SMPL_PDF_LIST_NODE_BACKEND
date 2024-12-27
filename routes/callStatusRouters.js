const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/imageMiddleware.js");


const calllStatusController = require("../controllers/calllStatusController.js");

router.post("/addCallStatus", upload.fields([
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), auth, calllStatusController.addCallStatusInBound);


router.patch("/updateInBoundCallStatus/:id", upload.fields([
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), auth, calllStatusController.updateInBoundCallStatus);

router.get("/getCallStatus", auth, calllStatusController.getCallStatusDataByDate);  // to getInBoundcallstatusdata by type: daily  or  monthly   and date
router.delete("/deleteInBoundCall/:id", auth, calllStatusController.deleteInBoundById);
router.get("/getInboundDailySelected", auth, calllStatusController.getInboundDailySelected); // to get InBOunddat when selected  daily
router.get("/getInBoundMonthlySelected", auth, calllStatusController.getInBoundMonthlySelected); // to get InBouyd when monthly selected



//Outbound

router.post("/addOutBoundCallStatus", upload.fields([
  { name: 'image', maxCount: 1 }
]), auth, calllStatusController.addOutBoundCallStatus);

router.get("/getOutBoundCallStatusByDate", auth, calllStatusController.getOutBoundCallStatusByDate);
router.delete("/deleteOutBoundById/:id", auth, calllStatusController.deleteOutBoundById);

router.get("/getOutboundDailySelected", auth, calllStatusController.getOutboundDailySelected);
router.get("/getOutBoundMonthlySelected", auth, calllStatusController.getOutBoundMonthlySelected);




//district report

router.post("/addDistrictReport", upload.fields([
  { name: 'excel', maxCount: 1 },
  { name: 'graph', maxCount: 1 }
]), auth, calllStatusController.addDistrictReport);

router.get("/getDistrictReportByDate", auth, calllStatusController.getDistrictReportsByDate);
router.delete("/deleteDistrictReportById/:id", auth, calllStatusController.deleteDistrictReportById);

router.get("/getDistrictReportDailySelected", auth, calllStatusController.getDistrictReportDailySelected);
router.get("/getDistrictReportMonthlySelected", auth, calllStatusController.getDistrictReportMonthlySelected);



//disposition report
router.post("/addDispositionReport", upload.fields([
  { name: 'table1', maxCount: 1 },
  { name: 'graph', maxCount: 1 },
  { name: 'table2', maxCount: 1 },
]), auth, calllStatusController.addDispositionReport);

router.get("/getDispositionReportByDate", auth, calllStatusController.getDispositionReportByDate);
router.delete("/deleteDispositionById/:id", auth, calllStatusController.deleteDispositionReportById);

router.get("/getDispositionReportDailySelected", auth, calllStatusController.getDispositionReportDailySelected);
router.get("/getDispositionReportMonthlySelected", auth, calllStatusController.getDispositionReportMonthlySelected);



//samplecall APIs

// router.post("/addSampleCall",upload.fields([{name: 'voiceCall', maxCount: 1}]),auth,calllStatusController.addSampleCalls);  for allowing max 1 file at a time

router.post("/addSampleCall", upload.fields([{ name: 'voiceCall' }]), auth, calllStatusController.addSampleCalls);
router.get("/getSampleCallStatus", auth, calllStatusController.getSampleCallByDate);
router.delete("/deleteSampleCallById/:id", auth, calllStatusController.deleteSampleCallById);
router.get("/getSampleCallDailySelected", auth, calllStatusController.getSampleCallDailySelected);
router.get("/getSampleCallMonthlySelected", auth, calllStatusController.getSampleCallMonthlySelected);
module.exports = router;

