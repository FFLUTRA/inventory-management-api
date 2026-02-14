const Item = require('../models/Item.model');


const getInventoryStats = async (userId) => {
  try {
    const items = await Item.find({ user: userId });

    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const averageQuantity = totalItems > 0 ? (totalQuantity / totalItems).toFixed(2) : 0;
    
    const maxQuantityItem = items.length > 0 
      ? items.reduce((max, item) => item.quantity > max.quantity ? item : max)
      : null;
    
    const minQuantityItem = items.length > 0 
      ? items.reduce((min, item) => item.quantity < min.quantity ? item : min)
      : null;

    return {
      success: true,
      data: {
        totalItems,
        totalQuantity,
        averageQuantity,
        maxQuantityItem: maxQuantityItem ? { name: maxQuantityItem.name, quantity: maxQuantityItem.quantity } : null,
        minQuantityItem: minQuantityItem ? { name: minQuantityItem.name, quantity: minQuantityItem.quantity } : null
      }
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


const generateInventoryReport = async (userId) => {
  try {
    const items = await Item.find({ user: userId });

    const report = {
      generatedAt: new Date(),
      totalItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      items: items.map(item => ({
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })),
      summary: {
        itemsInStock: items.filter(i => i.quantity > 0).length,
        outOfStockItems: items.filter(i => i.quantity === 0).length,
        lowStockItems: items.filter(i => i.quantity > 0 && i.quantity < 10).length
      }
    };

    return { success: true, data: report };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const searchItems = async (userId, query) => {
  try {
    if (!query || query.trim() === '') {
      return { success: false, message: 'Search query cannot be empty', statusCode: 400 };
    }

    const items = await Item.find({
      user: userId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    return { success: true, data: items, count: items.length };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


const getItemsSortedByQuantity = async (userId, order = 'asc') => {
  try {
    const sortOrder = order.toLowerCase() === 'desc' ? -1 : 1;
    
    const items = await Item.find({ user: userId }).sort({ quantity: sortOrder });

    return { success: true, data: items };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


const getInventoryHealthCheck = async (userId) => {
  try {
    const items = await Item.find({ user: userId });

    const totalItems = items.length;
    const outOfStock = items.filter(i => i.quantity === 0).length;
    const lowStock = items.filter(i => i.quantity > 0 && i.quantity < 10).length;
    const inStock = items.filter(i => i.quantity >= 10).length;

    const healthStatus = {
      status: outOfStock > 0 ? 'CRITICAL' : lowStock > totalItems * 0.2 ? 'WARNING' : 'HEALTHY',
      outOfStock,
      lowStock,
      inStock,
      totalItems,
      healthPercentage: totalItems > 0 ? ((inStock / totalItems) * 100).toFixed(2) : 0
    };

    return { success: true, data: healthStatus };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


const exportInventoryData = async (userId) => {
  try {
    const items = await Item.find({ user: userId });

    const exportData = {
      exportedAt: new Date().toISOString(),
      totalRecords: items.length,
      items: items.map(item => ({
        id: item._id.toString(),
        name: item.name,
        quantity: item.quantity,
        description: item.description || 'N/A',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
    };

    return { success: true, data: exportData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  getInventoryStats,
  generateInventoryReport,
  searchItems,
  getItemsSortedByQuantity,
  getInventoryHealthCheck,
  exportInventoryData
};
