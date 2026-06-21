const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
    phoneNumber: { type: String, default: '+971558967123' },
    emailId: { type: String, default: 'Ruhyasoul@gmail.com' },
    instagramLink: { type: String, default: '' },
    facebookLink: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
