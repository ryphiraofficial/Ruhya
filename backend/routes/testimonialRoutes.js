const express = require('express');
const router = express.Router();
const { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllTestimonials);
router.post('/', authMiddleware, createTestimonial);
router.put('/:id', authMiddleware, updateTestimonial);
router.delete('/:id', authMiddleware, deleteTestimonial);

module.exports = router;
