const inventoryService = require('../services/inventory.service');
const reportService = require('../services/report.service');

exports.getItems = async (req, res, next) => {
  try {
    const result = await inventoryService.getAllItems(req.user.id);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.getItemById = async (req, res, next) => {
  try {
    const result = await inventoryService.getItemById(req.params.id, req.user.id);
    if (!result.success) {
      res.status(result.statusCode || 500);
      throw new Error(result.message);
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.createItem = async (req, res, next) => {
  try {
    const result = await inventoryService.createItem(req.body, req.user.id);
    if (!result.success) {
      res.status(result.statusCode || 400);
      throw new Error(result.message);
    }
    res.status(result.statusCode).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.updateItem = async (req, res, next) => {
  try {
    const result = await inventoryService.updateItem(req.params.id, req.body, req.user.id);
    if (!result.success) {
      res.status(result.statusCode || 400);
      throw new Error(result.message);
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.deleteItem = async (req, res, next) => {
  try {
    const result = await inventoryService.deleteItem(req.params.id, req.user.id);
    if (!result.success) {
      res.status(result.statusCode || 400);
      throw new Error(result.message);
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};


exports.getLowStockItems = async (req, res, next) => {
  try {
    const threshold = req.query.threshold || 10;
    const result = await inventoryService.getLowStockItems(req.user.id, parseInt(threshold));
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.bulkUpdateQuantity = async (req, res, next) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates)) {
      res.status(400);
      throw new Error('Updates must be an array');
    }
    const result = await inventoryService.bulkUpdateQuantity(updates, req.user.id);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.getInventoryStats = async (req, res, next) => {
  try {
    const result = await reportService.getInventoryStats(req.user.id);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.generateReport = async (req, res, next) => {
  try {
    const result = await reportService.generateInventoryReport(req.user.id);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.searchItems = async (req, res, next) => {
  try {
    const { query } = req.query;
    const result = await reportService.searchItems(req.user.id, query);
    if (!result.success) {
      res.status(result.statusCode || 400);
      throw new Error(result.message);
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.getItemsSorted = async (req, res, next) => {
  try {
    const { order } = req.query;
    const result = await reportService.getItemsSortedByQuantity(req.user.id, order);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.getHealthCheck = async (req, res, next) => {
  try {
    const result = await reportService.getInventoryHealthCheck(req.user.id);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


exports.exportData = async (req, res, next) => {
  try {
    const result = await reportService.exportInventoryData(req.user.id);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
};


