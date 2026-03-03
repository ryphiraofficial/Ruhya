const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
    phoneNumber: { type: String, default: '+91 97455 80881' },
    emailId: { type: String, default: 'contact@ruhya.com' },
    instagramLink: { type: String, default: '' },
    facebookLink: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
