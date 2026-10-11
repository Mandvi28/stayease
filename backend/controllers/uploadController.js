// @desc    Upload one or more images to Cloudinary and return their URLs
// @route   POST /api/uploads
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded" });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    res.status(201).json({ images });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImages };
