const Course = require("../models/Course");
const User = require("../models/User");

exports.getAllCourses = async (req, res) => {
  const courses = await Course.find().populate("createdBy", "name");
  res.json(courses);
};

exports.getOwnCourses = async (req, res) => {
  const courses = await Course.find({ createdBy: req.user._id });
  res.json(courses);
};

exports.createCourse = async (req, res) => {
  const { title, description, tags } = req.body;
  const course = new Course({
    title,
    description,
    tags,
    createdBy: req.user._id,
  });
  await course.save();
  res.json(course);
};

exports.updateCourse = async (req, res) => {
  const course = await Course.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!course)
    return res.status(404).json({ error: "Not found or not your course" });

  Object.assign(course, req.body);
  await course.save();
  res.json(course);
};

exports.enrollCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  if (!course.enrolledStudents.includes(req.user._id)) {
    course.enrolledStudents.push(req.user._id);
    req.user.enrolledCourses.push(course._id);
    await course.save();
    await req.user.save();
  }

  res.json({ message: "Enrolled successfully" });
};

exports.getEnrolledCourses = async (req, res) => {
  await req.user.populate("enrolledCourses");
  res.json(req.user.enrolledCourses);
};
