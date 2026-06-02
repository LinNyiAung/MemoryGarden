const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// ─── File storage paths ──────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
const dbPath = path.join(__dirname, 'db.json');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── Simple JSON database (no native modules needed) ─────────────────────────
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch {
    return { flowers: [], garden: { title: 'Our Memory Garden' } };
  }
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

if (!fs.existsSync(dbPath)) writeDB({ flowers: [], garden: { title: 'Our Memory Garden' } });

// ─── Multer (photo uploads) ───────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET all flowers
app.get('/api/flowers', (req, res) => {
  res.json(readDB().flowers);
});

// GET garden info
app.get('/api/garden', (req, res) => {
  res.json(readDB().garden);
});

// PUT update garden title
app.put('/api/garden', (req, res) => {
  const db = readDB();
  if (req.body.title) db.garden.title = req.body.title;
  writeDB(db);
  res.json(db.garden);
});

// POST plant a new flower (with optional photo)
app.post('/api/flowers', upload.single('photo'), (req, res) => {
  const db = readDB();
  const { x, y, plantedBy, message, date, flowerType } = req.body;
  const flower = {
    id: uuidv4(),
    x: parseFloat(x),
    y: parseFloat(y),
    plantedBy: plantedBy || 'unknown',
    message: message || '',
    date: date || new Date().toISOString(),
    flowerType: flowerType || 'rose',
    photo: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString(),
    bloom: 2
  };
  db.flowers.push(flower);
  writeDB(db);
  res.json(flower);
});

// DELETE a flower
app.delete('/api/flowers/:id', (req, res) => {
  const db = readDB();
  const flower = db.flowers.find(f => f.id === req.params.id);
  if (!flower) return res.status(404).json({ error: 'Not found' });
  if (flower.photo) {
    const filePath = path.join(__dirname, flower.photo);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  db.flowers = db.flowers.filter(f => f.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// PATCH update bloom stage
app.patch('/api/flowers/:id/bloom', (req, res) => {
  const db = readDB();
  const flower = db.flowers.find(f => f.id === req.params.id);
  if (!flower) return res.status(404).json({ error: 'Not found' });
  flower.bloom = Math.min(2, (flower.bloom || 0) + 1);
  writeDB(db);
  res.json(flower);
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🌸 Memory Garden API is running!');
  console.log(`  📡 http://localhost:${PORT}`);
  console.log('');
  console.log('  Leave this window open while using the app.');
  console.log('');
});
