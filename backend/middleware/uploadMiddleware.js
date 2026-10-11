const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Accepts up to 10 images per request and streams them straight to
// Cloudinary via multer-storage-cloudinary (see config/cloudinary.js).
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

module.exports = upload;
