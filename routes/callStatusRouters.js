const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/imageMiddleware.js");
const upload = require("../middleware/imageMiddleware.js");


const calllStatusController = require("../controllers/calllStatusController.js");

router.post("/addCallStatus", upload.fields([
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), auth, calllStatusController.addCallStatusInBound);
]), auth, calllStatusController.addCallStatusInBound);


router.patch("/updateInBoundCallStatus/:id",  upload.fields([
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), auth, calllStatusController.updateInBoundCallStatus);
]), auth, calllStatusController.updateInBoundCallStatus);

router.get("/getCallStatus", calllStatusController.getCallStatusDataByDate);  // to getInBoundcallstatusdata by type: daily  or  monthly   and date
router.delete("/deleteInBoundCall/:id", auth, calllStatusController.deleteInBoundById);
router.get("/getInboundDailySelected", auth, calllStatusController.getInboundDailySelected); // to get InBOunddat when selected  daily
router.get("/getInBoundMonthlySelected", auth, calllStatusController.getInBoundMonthlySelected); // to get InBouyd when monthly selected



//Outbound

router.post("/addOutBoundCallStatus", upload.fields([
  { name: 'image', maxCount: 1 }
]), auth, calllStatusController.addOutBoundCallStatus);


router.get("/getOutBoundCallStatusByDate",  calllStatusController.getOutBoundCallStatusByDate);
router.delete("/deleteOutBoundById/:id", auth, calllStatusController.deleteOutBoundById);

router.get("/getOutboundDailySelected", auth, calllStatusController.getOutboundDailySelected);
router.get("/getOutBoundMonthlySelected", auth, calllStatusController.getOutBoundMonthlySelected);
router.get("/getOutboundDailySelected", auth, calllStatusController.getOutboundDailySelected);
router.get("/getOutBoundMonthlySelected", auth, calllStatusController.getOutBoundMonthlySelected);




//district report

router.post("/addDistrictReport", upload.fields([
  { name: 'excel', maxCount: 1 },
  { name: 'graph', maxCount: 1 }
]), auth, calllStatusController.addDistrictReport);

router.get("/getDistrictReportByDate",  calllStatusController.getDistrictReportsByDate);
router.delete("/deleteDistrictReportById/:id", auth, calllStatusController.deleteDistrictReportById);

router.get("/getDistrictReportDailySelected", auth, calllStatusController.getDistrictReportDailySelected);
router.get("/getDistrictReportMonthlySelected", auth, calllStatusController.getDistrictReportMonthlySelected);



//disposition report
router.post("/addDispositionReport", upload.fields([
  { name: 'table1', maxCount: 1 },
  { name: 'graph', maxCount: 1 },
  { name: 'table2', maxCount: 1 },
]), auth, calllStatusController.addDispositionReport);

router.get("/getDispositionReportByDate",  calllStatusController.getDispositionReportByDate);
router.delete("/deleteDispositionById/:id", auth, calllStatusController.deleteDispositionReportById);

router.get("/getDispositionReportDailySelected", auth, calllStatusController.getDispositionReportDailySelected);
router.get("/getDispositionReportMonthlySelected", auth, calllStatusController.getDispositionReportMonthlySelected);



//samplecall APIs

router.post("/addSampleCall", upload.fields([{ name: 'voiceCall', maxCount: 1 }]), auth, calllStatusController.addSampleCalls);
router.get("/getSampleCallStatus", calllStatusController.getSampleCallByDate);
router.delete("/deleteSampleCallById/:id", auth, calllStatusController.deleteSampleCallById);
router.get("/getSampleCallDailySelected", auth, calllStatusController.getSampleCallDailySelected);
router.get("/getSampleCallMonthlySelected", auth, calllStatusController.getSampleCallMonthlySelected);
// appointment 

router.post("/addAppointment", upload.fields([
  { name: 'image', maxCount: 1 }
]), auth, calllStatusController.addAppointment);
// getAppointmentByDate
router.get("/getAppointmentByDate", calllStatusController.getAppointmentByDate);
// getallAppointmentByDate
router.get("/getAllAppointments", auth, calllStatusController.getAllAppointments);
// router.get('/getAppointmentsBydaily',auth,calllStatusController.getAppointmentsBydaily)
// getAllAppointmentsDailySelected
router.get("/getAllAppointmentsDailySelected",auth,calllStatusController.getAllAppointmentsDailySelected);
router.get("/getAppointmentsByMonth",auth,calllStatusController.getAppointmentsByMonth);
router.delete('/deleteAppointmentById/:id',auth,calllStatusController.deleteAppointmentById)



// satifaction

router.post("/satifaction", upload.fields([
  { name: 'image', maxCount: 1 }
]), auth, calllStatusController.satifaction);
router.get("/getAllsatifactionDailySelected", auth, calllStatusController.getAllsatifactionDailySelected);
router.get('/getsatifactionsByMonth',auth, calllStatusController.getsatifactionsByMonth)

router.get("getAllsatifactions", auth, calllStatusController.getAllsatifactions);
router.delete('/deletesatifactionById/:id',auth,calllStatusController.deletesatifactionById)
router.get('/getsatifactionByDate', calllStatusController.getsatifactionByDate )
module.exports = router;

