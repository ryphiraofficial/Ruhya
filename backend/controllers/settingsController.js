const SiteSettings = require('../models/SiteSettings');

const getSettings = async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving site settings', error: error.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create(req.body);
        } else {
            settings.phoneNumber = req.body.phoneNumber || settings.phoneNumber;
            settings.emailId = req.body.emailId || settings.emailId;
            settings.instagramLink = req.body.instagramLink === '' ? '' : (req.body.instagramLink || settings.instagramLink);
            settings.facebookLink = req.body.facebookLink === '' ? '' : (req.body.facebookLink || settings.facebookLink);
            await settings.save();
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error updating site settings', error: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
