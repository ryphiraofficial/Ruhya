const TherapyNeed = require('../models/TherapyNeed');

exports.getAllNeeds = async (req, res) => {
  try {
    const needs = await TherapyNeed.find().sort({ order: 1 });
    res.json(needs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNeed = async (req, res) => {
  try {
    const count = await TherapyNeed.countDocuments();
    const newNeed = new TherapyNeed({
      text: req.body.text,
      order: req.body.order || count
    });
    const savedNeed = await newNeed.save();
    res.status(201).json(savedNeed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateNeed = async (req, res) => {
  try {
    const updatedNeed = await TherapyNeed.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text, order: req.body.order },
      { new: true }
    );
    if (!updatedNeed) return res.status(404).json({ message: 'Need not found' });
    res.json(updatedNeed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteNeed = async (req, res) => {
  try {
    const deletedNeed = await TherapyNeed.findByIdAndDelete(req.params.id);
    if (!deletedNeed) return res.status(404).json({ message: 'Need not found' });
    res.json({ message: 'Need deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrders = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, order }
    const updatePromises = orders.map(item => 
      TherapyNeed.findByIdAndUpdate(item.id, { order: item.order })
    );
    await Promise.all(updatePromises);
    res.json({ message: 'Orders updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
