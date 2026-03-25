require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const contactRoutes = require('./routes/contactRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const historyRoutes = require('./routes/historyRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const therapyNeedRoutes = require('./routes/therapyNeedRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/therapy-needs', therapyNeedRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

const seedAdmin = async () => {
  const Admin = require('./models/Admin');
  const bcrypt = require('bcryptjs');

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@ruhiya.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ruhiya123';

  const existing = await Admin.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await Admin.create({ email: adminEmail, password: hashed });
    console.log(`Admin account created: ${adminEmail}`);
  }
};

const seedContent = async () => {
  const Content = require('./models/Content');
  const sections = ['about', 'hero', 'therapy', 'journey'];

  for (const s of sections) {
    const existing = await Content.findOne({ section: s });
    if (!existing) {
      const defaults = {
        about: {
          title: "About Me",
          subtitle: "My Story",
          body: "Ruh'ya was born from an inner inclination that has been with me for as long as I can remember..."
        },
        hero: { title: "Holistic Healing", subtitle: "Conscious Living", body: "Ruh'ya is a space to breathe again." },
        therapy: { title: "Therapy Is For Everyone", body: "Healing is not only for those in crisis." },
        journey: { title: "Begin Your Journey", subtitle: "Your healing journey starts with a single step." }
      };

      await Content.create({
        section: s,
        title: defaults[s]?.title || '',
        subtitle: defaults[s]?.subtitle || '',
        body: defaults[s]?.body || '',
        imageUrl: ''
      });
      console.log(`Seeded default content for: ${s}`);
    }
  }
};

const seedServices = async () => {
  const Service = require('./models/Service');
  const count = await Service.countDocuments();
  if (count === 0) {
    const defaultServices = [
      {
        title: 'Family Constellation Therapy',
        subtitle: 'Ancestral Healing',
        description: 'This method looks at how family dynamics and inherited patterns can affect your emotions, relationships, and life choices. By bringing awareness to these unseen influences, it helps restore balance and emotional clarity. It often brings a sense of relief, understanding, and inner alignment.',
        order: 1
      },
      {
        title: 'Inner Child Healing',
        subtitle: 'Emotional Restoration',
        description: 'This work focuses on the parts of us formed during early life experiences. By gently acknowledging unmet emotional needs, it supports emotional regulation and self-compassion. It helps build a stronger, more grounded sense of self in the present.',
        order: 2
      },
      {
        title: 'Transpersonal Hypnotherapy',
        subtitle: 'Regression Therapy',
        description: 'This is a guided, deeply relaxed state that allows you to connect with the subconscious mind. It helps identify and shift patterns, beliefs, and emotional imprints that influence your present life. Sessions are safe, conscious, and guided — you remain aware and in control throughout.',
        order: 3
      },
      {
        title: 'Holistic Integrated Creative Arts Therapy',
        subtitle: 'Personalized Healing',
        description: 'This approach uses simple creative processes like drawing, movement, symbols, and expression to help you access emotions that are difficult to put into words. You do not need to be artistic — the focus is on expression, not performance. It helps release emotional blocks and supports self-awareness in a gentle, natural way.',
        order: 4
      }
    ];
    await Service.insertMany(defaultServices);
    console.log('Seeded 4 default services');
  }
};

const seedTherapyNeeds = async () => {
  const TherapyNeed = require('./models/TherapyNeed');
  const count = await TherapyNeed.countDocuments();
  if (count === 0) {
    const defaultNeeds = [
      'Emotional overwhelm',
      'Stress and anxiety',
      'Life transitions',
      'Relationship challenges',
      'Self-understanding',
      'Inner confidence and presence',
      'Creative or intuitive blocks',
      'Exploring deeper personal identity'
    ].map((text, index) => ({ text, order: index }));
    
    await TherapyNeed.insertMany(defaultNeeds);
    console.log('Seeded 8 default therapy needs');
  }
};

const seedSettings = async () => {
  const SiteSettings = require('./models/SiteSettings');
  const existing = await SiteSettings.findOne();
  if (!existing) {
    await SiteSettings.create({
      phoneNumber: '+91 97455 80881',
      emailId: 'contact@ruhya.com',
      instagramLink: '',
      facebookLink: ''
    });
    console.log('Seeded default site settings');
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedAdmin();
    await seedContent();
    await seedServices();
    await seedSettings();
    await seedTherapyNeeds();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
