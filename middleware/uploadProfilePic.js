// backend/middleware/uploadProfilePic.js
import multer from "multer";

const storage = multer.memoryStorage(); // store bytes in memory (req.file.buffer)
export const uploadProfilePic = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB max (adjust if you want)
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});
