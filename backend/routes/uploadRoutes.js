const express = require("express");
const { uploadImages } = require("../controllers/uploadController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/", protect, authorize("host", "admin"), upload.array("images", 10), uploadImages);

module.exports = router;
