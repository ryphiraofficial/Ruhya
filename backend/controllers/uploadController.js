const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // multer-storage-cloudinary attaches 'path' with the secure Cloudinary URL
    const imageUrl = req.file.path;
    
    // We pass back url and filePath just to be perfectly backward-compatible
    // with any frontend code that destructures these variables.
    res.json({ 
        imageUrl: imageUrl,
        url: imageUrl,
        filePath: imageUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadImage };
