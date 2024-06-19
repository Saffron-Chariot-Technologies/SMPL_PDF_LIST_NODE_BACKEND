const express = require("express");
const router = express.Router();
const {
  createUrl,
  getUrls,
  deleteUrl,
} = require("../controllers/urlController");
const auth = require("../middleware/auth");

router.post("/", auth, createUrl);
router.get("/", auth, getUrls);
router.delete("/:id", auth, deleteUrl);

module.exports = router;
