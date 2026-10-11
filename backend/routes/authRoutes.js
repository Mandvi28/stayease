const express = require("express");
const { register, login, getMe, becomeHost } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/become-host", protect, becomeHost);

module.exports = router;
