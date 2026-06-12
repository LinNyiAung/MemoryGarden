const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Cloudinary Config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ─── MongoDB Setup (Mongoose) ─────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🌿 Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Transform function to convert MongoDB's `_id` to `id` for React frontend
const transformId = (doc, ret) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
};

// Schemas
const gardenSchema = new mongoose.Schema({
  title: String,
  himName: String,
  herName: String,
  himPhoto: String,
  himPhotoId: String,   // Store Cloudinary Public ID for deletion
  herPhoto: String,
  herPhotoId: String,
}, { toJSON: { transform: transformId } });

const flowerSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  plantedBy: String,
  message: String,
  date: String,
  flowerType: String,
  photo: String,        // Cloudinary URL
  photoId: String,      // Cloudinary Public ID
  createdAt: String,
  bloom: Number
}, { toJSON: { transform: transformId } });

const Garden = mongoose.model('Garden', gardenSchema);
const Flower = mongoose.model('Flower', flowerSchema);

// Initialize garden document if the database is completely empty
(async () => {
  try {
    const count = await Garden.countDocuments();
    if (count === 0) {
      await Garden.create({
        title: 'Our Memory Garden',
        himName: 'Lin Nyi Aung',
        herName: 'Htet Hsu Waddy'
      });
      console.log('🌱 Garden initialized in MongoDB!');
    }
  } catch (err) {
    console.error('Initialization error:', err);
  }
})();

// ─── Multer (Memory Storage) ──────────────────────────────────────────────────
// Keeps file in memory so we can stream it directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Helper function to stream buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'memory_garden' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer); // write the file buffer into the stream
  });
};

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET all flowers
app.get('/api/flowers', async (req, res) => {
  try {
    const flowers = await Flower.find();
    res.json(flowers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET garden info
app.get('/api/garden', async (req, res) => {
  try {
    let garden = await Garden.findOne();
    res.json(garden);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update garden title
app.put('/api/garden', async (req, res) => {
  try {
    if (req.body.title) {
      await Garden.findOneAndUpdate({}, { title: req.body.title });
    }
    const garden = await Garden.findOne();
    res.json(garden);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upload/update avatar photos
app.post('/api/garden/avatar/:who', upload.single('photo'), async (req, res) => {
  try {
    const who = req.params.who;
    if (who !== 'him' && who !== 'her') return res.status(400).json({ error: 'Invalid person' });
    
    const garden = await Garden.findOne();
    if (!garden) return res.status(404).json({ error: 'Garden not found' });

    if (req.file) {
      const photoCol = who === 'him' ? 'himPhoto' : 'herPhoto';
      const photoIdCol = who === 'him' ? 'himPhotoId' : 'herPhotoId';

      // 1. If an old photo exists, delete it from Cloudinary to save space
      if (garden[photoIdCol]) {
        await cloudinary.uploader.destroy(garden[photoIdCol]);
      }

      // 2. Upload new photo to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer);
      
      // 3. Update database
      garden[photoCol] = result.secure_url;
      garden[photoIdCol] = result.public_id;
      await garden.save();
    }
    
    res.json(garden);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST plant a new flower (with optional photo)
app.post('/api/flowers', upload.single('photo'), async (req, res) => {
  try {
    const { x, y, plantedBy, message, date, flowerType } = req.body;
    let photoUrl = null;
    let photoId = null;

    // Upload to Cloudinary if photo is attached
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      photoUrl = result.secure_url;
      photoId = result.public_id;
    }

    const createdAt = new Date().toISOString();
    
    const newFlower = await Flower.create({
      x: parseFloat(x),
      y: parseFloat(y),
      plantedBy: plantedBy || 'unknown',
      message: message || '',
      date: date || createdAt,
      flowerType: flowerType || 'rose',
      photo: photoUrl,
      photoId: photoId,
      createdAt: createdAt,
      bloom: 2
    });
    
    res.json(newFlower);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a flower
app.delete('/api/flowers/:id', async (req, res) => {
  try {
    const flower = await Flower.findById(req.params.id);
    if (!flower) return res.status(404).json({ error: 'Not found' });
    
    // Delete photo from Cloudinary if one was attached
    if (flower.photoId) {
      await cloudinary.uploader.destroy(flower.photoId);
    }
    
    await Flower.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH update bloom stage
app.patch('/api/flowers/:id/bloom', async (req, res) => {
  try {
    const flower = await Flower.findById(req.params.id);
    if (!flower) return res.status(404).json({ error: 'Not found' });
    
    flower.bloom = Math.min(2, (flower.bloom || 0) + 1);
    await flower.save();
    
    res.json(flower);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🌸 Memory Garden API is running on MongoDB & Cloudinary!');
  console.log(`  📡 http://localhost:${PORT}`);
  console.log('');
});