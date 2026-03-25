const express = require('express');
const router = express.Router();
const { getAllContent, getSection, updateSection } = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllContent);
router.get('/:section', getSection);
router.put('/:section', authMiddleware, updateSection);

module.exports = router;
