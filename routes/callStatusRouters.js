const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload=require("../middleware/imageMiddleware.js");
const {
 addCallStatus 
} = require("../controllers/calllStatusController.js");


router.post("/addCallStatus", upload.fields([
  { name: 'graph', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]),addCallStatus);


module.exports = router;