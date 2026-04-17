const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('image'), uploadImage);

module.exports = router;
