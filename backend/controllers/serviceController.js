const Service = require('../models/Service');
const Revision = require('../models/Revision');

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();

    // History
    await Revision.create({
      section: 'services',
      referenceId: service._id,
      content: req.body,
      updatedBy: 'Admin'
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (service) {
      // History
      await Revision.create({
        section: 'services',
        referenceId: service._id,
        content: req.body,
        updatedBy: 'Admin'
      });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService
};
