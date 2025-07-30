const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    return res.status(400).json({ error: "Invalid Token" });
  }
};

module.exports = auth;
