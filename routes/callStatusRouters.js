const express = require("express");
const router = express.Router();
const {
  createUrl,
  getUrls,
  deleteUrl,
} = require("../controllers/urlController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), auth, createUrl);
router.get("/", auth, getUrls);
router.delete("/:id", auth, deleteUrl);

module.exports = router;