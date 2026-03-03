const express = require('express');
const router = express.Router();
const { getAllServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllServices);
router.post('/', authMiddleware, createService);
router.put('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;
