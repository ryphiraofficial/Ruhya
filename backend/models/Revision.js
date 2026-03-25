const mongoose = require('mongoose');

const revisionSchema = new mongoose.Schema({
    section: {
        type: String, // 'about', 'services', 'testimonials', etc.
        required: true
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId, // The ID of the actual document
        required: false
    },
    content: {
        type: Object, // The snapshot of the data
        required: true
    },
    updatedBy: {
        type: String,
        default: 'Admin'
    }
}, { timestamps: true });

module.exports = mongoose.model('Revision', revisionSchema);
