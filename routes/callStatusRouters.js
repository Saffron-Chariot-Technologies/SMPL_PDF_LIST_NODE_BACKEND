const express = require("express");
const router = express.Router();
const upload=require("../middleware/imageMiddleware.js");
const {
 addCallStatus 
} = require("../controllers/calllStatusController.js");


router.post("/addCallStatus", upload.fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 }
]), auth, addCallStatus);


module.exports = router;