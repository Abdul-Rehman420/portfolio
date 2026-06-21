const Settings = require('../models/Settings');

exports.getAll = async (req, res, next) => {
  try {
    const settings = await Settings.find();
    const map = {};
    settings.forEach((s) => { 
      map[s.key] = s.value; 
    });
    res.json(map);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updates = req.body;
    
    // Validate that we have updates
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No settings provided to update' 
      });
    }
    
    const results = {};
    const errors = [];
    
    for (const [key, value] of Object.entries(updates)) {
      try {
        const updated = await Settings.findOneAndUpdate(
          { key },
          { value },
          { upsert: true, new: true, runValidators: true }
        );
        results[key] = updated;
      } catch (err) {
        errors.push({ key, error: err.message });
        console.error(`Error updating setting "${key}":`, err.message);
      }
    }
    
    // If all updates failed, return an error
    if (Object.keys(results).length === 0 && errors.length > 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update all settings',
        errors
      });
    }
    
    res.json({ 
      success: true,
      message: 'Settings updated successfully',
      updated: Object.keys(results).length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    next(error);
  }
};