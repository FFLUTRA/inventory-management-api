const express = require('express');
const router = express.Router();


const { protect } = require('../middleware/auth.middleware'); 

const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getLowStockItems,
  bulkUpdateQuantity,
  getInventoryStats,
  generateReport,
  searchItems,
  getItemsSorted,
  getHealthCheck,
  exportData,
} = require('../controllers/inventory.controller');

router.get('/', protect, getItems);
router.get('/:id', protect, getItemById);
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);


router.get('/alerts/low-stock', protect, getLowStockItems);
router.post('/bulk/update-quantity', protect, bulkUpdateQuantity);


router.get('/analytics/stats', protect, getInventoryStats);
router.get('/reports/inventory', protect, generateReport);
router.get('/search/items', protect, searchItems);
router.get('/sort/quantity', protect, getItemsSorted);
router.get('/health/check', protect, getHealthCheck);
router.get('/export/data', protect, exportData);

module.exports = router;
