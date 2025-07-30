const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  logout,
  getCurrentUser,
} = require("../controllers/authController");
const auth = require("../middleware/auth");
const permit = require("../middleware/role");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/me", auth, getCurrentUser);

module.exports = router;
