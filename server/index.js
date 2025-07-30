require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");

require("./config/db");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // your Next.js frontend
    credentials: true, // allow cookies (for JWT if stored in cookies)
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
