require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Admin = require('./models/Admin');
const Content = require('./models/Content');

const initialSections = [
  { section: 'hero', title: '', subtitle: '', body: '', imageUrl: '' },
  { section: 'about', title: '', subtitle: '', body: '', imageUrl: '' },
  { section: 'therapy', title: '', subtitle: '', body: '', imageUrl: '' },
  { section: 'services', title: '', subtitle: '', body: '', imageUrl: '' },
  { section: 'testimonials', title: '', subtitle: '', body: '', imageUrl: '' },
  { section: 'journey', title: '', subtitle: '', body: '', imageUrl: '' }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Admin.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL },
      { email: process.env.ADMIN_EMAIL, password: hashedPassword },
      { upsert: true, new: true }
    );
    console.log('Admin user created/updated');

    for (const section of initialSections) {
      await Content.findOneAndUpdate(
        { section: section.section },
        section,
        { upsert: true, new: true }
      );
    }
    console.log('Initial content sections created');

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
