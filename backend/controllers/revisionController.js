const Revision = require('../models/Revision');

const getRevisions = async (req, res) => {
    try {
        const { section } = req.query;
        const filter = section ? { section: section.toLowerCase() } : {};

        const revisions = await Revision.find(filter)
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(revisions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteRevision = async (req, res) => {
    try {
        await Revision.findByIdAndDelete(req.params.id);
        res.json({ message: 'Revision deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const clearAllHistory = async (req, res) => {
    try {
        await Revision.deleteMany({});
        res.json({ message: 'All history cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getRevisions, deleteRevision, clearAllHistory };
