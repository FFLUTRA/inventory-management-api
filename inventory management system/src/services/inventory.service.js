const Item = require('../models/Item.model');


const getAllItems = async (userId) => {
  try {
    const items = await Item.find({ user: userId });
    return { success: true, data: items };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


const getItemById = async (itemId, userId) => {
  try {
    const item = await Item.findById(itemId);
    
    if (!item) {
      return { success: false, message: 'Item not found', statusCode: 404 };
    }

    if (item.user.toString() !== userId) {
      return { success: false, message: 'Not authorized', statusCode: 401 };
    }

    return { success: true, data: item };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const createItem = async (itemData, userId) => {
  try {
    const { name, quantity, description } = itemData;

   
    if (!name || quantity === undefined) {
      return { success: false, message: 'Name and quantity are required', statusCode: 400 };
    }

    if (quantity < 0) {
      return { success: false, message: 'Quantity cannot be negative', statusCode: 400 };
    }

    const item = await Item.create({
      name,
      quantity,
      description,
      user: userId,
    });

    return { success: true, data: item, statusCode: 201 };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const updateItem = async (itemId, updateData, userId) => {
  try {
    const item = await Item.findById(itemId);

    if (!item) {
      return { success: false, message: 'Item not found', statusCode: 404 };
    }

    if (item.user.toString() !== userId) {
      return { success: false, message: 'Not authorized', statusCode: 401 };
    }

    if (updateData.quantity !== undefined && updateData.quantity < 0) {
      return { success: false, message: 'Quantity cannot be negative', statusCode: 400 };
    }

    Object.assign(item, updateData);
    await item.save();

    return { success: true, data: item };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


const deleteItem = async (itemId, userId) => {
  try {
    const item = await Item.findById(itemId);

    if (!item) {
      return { success: false, message: 'Item not found', statusCode: 404 };
    }

    if (item.user.toString() !== userId) {
      return { success: false, message: 'Not authorized', statusCode: 401 };
    }

    await item.deleteOne();

    return { success: true, message: 'Item deleted successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getLowStockItems = async (userId, threshold = 10) => {
  try {
    const items = await Item.find({ 
      user: userId,
      quantity: { $lt: threshold }
    });

    return { success: true, data: items, count: items.length };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


const bulkUpdateQuantity = async (updates, userId) => {
  try {
    const results = [];

    for (const update of updates) {
      const { itemId, quantity } = update;
      
      if (quantity < 0) {
        results.push({ itemId, success: false, message: 'Quantity cannot be negative' });
        continue;
      }

      const item = await Item.findById(itemId);
      
      if (!item || item.user.toString() !== userId) {
        results.push({ itemId, success: false, message: 'Item not found or not authorized' });
        continue;
      }

      item.quantity = quantity;
      await item.save();
      results.push({ itemId, success: true, message: 'Updated' });
    }

    return { success: true, data: results };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getLowStockItems,
  bulkUpdateQuantity
};
