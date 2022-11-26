const multer = require('multer');
const crypto = require('crypto');

// exports.storage = multer.diskStorage({
//   destination: function (_req, _file, cb) {
//     cb(null, "uploads/images");
//   },

//   filename: async function (_req, file, cb) {
//     const uniqueSuffix = `${crypto
//       .randomUUID()
//       .replaceAll("-", "")
//       .substr(0, 5)}${Date.now()}`;
//     cb(null, uniqueSuffix + `.${file.mimetype.replace("image/", "")}`);
//   },
// });

exports.storage = multer.memoryStorage();
