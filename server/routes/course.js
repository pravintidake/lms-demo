const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/role");
const {
  getAllCourses,
  createCourse,
  enrollCourse,
  getEnrolledCourses,
  getOwnCourses,
  updateCourse,
} = require("../controllers/courseController");

// Common
router.get("/", auth, permit("student", "teacher", "admin"), getAllCourses);

// Student
router.post("/enroll/:id", auth, permit("student"), enrollCourse);
router.get("/enrolled", auth, permit("student"), getEnrolledCourses);

// Teacher
router.post("/", auth, permit("teacher"), createCourse);
router.get("/own", auth, permit("teacher"), getOwnCourses);
router.put("/:id", auth, permit("teacher"), updateCourse);

// Admin (gets all via main route)

module.exports = router;
