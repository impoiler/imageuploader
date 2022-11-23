const multer = require("multer");
const crypto = require("crypto");

exports.storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    cb(null, "uploads/images");
  },

  filename: async function (_req, file, cb) {
    const uniqueSuffix = `${crypto
      .randomUUID()
      .replaceAll("-", "")}${Date.now()}`;
    cb(null, uniqueSuffix + `.${file.mimetype.replace("image/", "")}`);
  },
});
