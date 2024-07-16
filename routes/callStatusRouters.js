const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload=require("../middleware/imageMiddleware.js");
const {
 addCallStatusInBound ,
 getCallStatusData,
 updateInBoundCallStatus,
 addOutBoundCallStatus,
 addDistrictReport,
 addDispositionReport,
 getAllInBoundCallStatusData
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


router.post("/addOutBoundCallStatus", upload.fields([
  { name: 'image', maxCount: 1 }
]),auth,addOutBoundCallStatus);



router.post("/addDistrictReport", upload.fields([
  { name: 'excel', maxCount: 1 },
  { name: 'graph', maxCount: 1 }
]),auth,addDistrictReport);


router.post("/addDispositionReport", upload.fields([
  { name: 'excel', maxCount: 1 },
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]),auth,addDispositionReport);



//######### belw this API for showing data in SMPL frontedn will be made
router.get("/getCallStatus",auth,getCallStatusData);

module.exports = router;