const express = require('express');
const router = express.Router();
const { 
  getAllNeeds, 
  createNeed, 
  updateNeed, 
  deleteNeed,
  updateOrders 
} = require('../controllers/therapyNeedController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllNeeds);
router.post('/', authMiddleware, createNeed);
router.put('/reorder', authMiddleware, updateOrders);
router.put('/:id', authMiddleware, updateNeed);
router.delete('/:id', authMiddleware, deleteNeed);

module.exports = router;
