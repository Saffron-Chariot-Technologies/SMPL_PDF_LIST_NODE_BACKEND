const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload=require("../middleware/imageMiddleware.js");
const {
 addCallStatusInBound ,
 getCallStatusData,
 updateInBoundCallStatus
} = require("../controllers/calllStatusController.js");


router.post("/addCallStatus", upload.fields([
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]),auth,addCallStatusInBound);

router.get("/getCallStatus",auth,getCallStatusData);
router.patch("/updateInBoundCallStatus",upload.fields([
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]),auth,updateInBoundCallStatus);

module.exports = router;