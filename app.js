const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
const {
  GetAllUsers,
  Signup,
  login,
  protect,
  verifyUser,
  upload,
} = require("./oprations/actions");
const multer = require("multer");
const { storage } = require("./storage");

const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
});

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "server is running fine",
  });
});

app.get("/users", protect, GetAllUsers);
app.get("/verify", verifyUser);

app.post("/signup", Signup);
app.post("/login", login);
app.post("/upload", uploadAvatar.single(), upload);

app.use("/", (req, res) => {
  res.status(404).json({
    status: "failed",
    message: `${req.originalUrl} is not found in this server`,
  });
});

module.exports = app;
