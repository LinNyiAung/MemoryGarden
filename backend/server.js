const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const PORT = 3001;

// ─── File storage paths ──────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── Database Setup (SQLite) ─────────────────────────────────────────────────
let db;
(async () => {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS garden (
      id INTEGER PRIMARY KEY,
      title TEXT,
      himName TEXT,
      herName TEXT,
      himPhoto TEXT,
      herPhoto TEXT
    );
    CREATE TABLE IF NOT EXISTS flowers (
      id TEXT PRIMARY KEY,
      x REAL,
      y REAL,
      plantedBy TEXT,
      message TEXT,
      date TEXT,
      flowerType TEXT,
      photo TEXT,
      createdAt TEXT,
      bloom INTEGER
    );
  `);

  // Initialize the garden row if it's completely empty
  const garden = await db.get('SELECT * FROM garden WHERE id = 1');
  if (!garden) {
    await db.run(
      'INSERT INTO garden (title, himName, herName) VALUES (?, ?, ?)',
      ['Our Memory Garden', 'Lin Nyi Aung', 'Htet Hsu Waddy']
    );
  }
})();

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
app.get('/api/flowers', async (req, res) => {
  const flowers = await db.all('SELECT * FROM flowers');
  res.json(flowers);
});

// GET garden info
app.get('/api/garden', async (req, res) => {
  const garden = await db.get('SELECT * FROM garden WHERE id = 1');
  res.json(garden);
});

// PUT update garden title
app.put('/api/garden', async (req, res) => {
  if (req.body.title) {
    await db.run('UPDATE garden SET title = ? WHERE id = 1', [req.body.title]);
  }
  const garden = await db.get('SELECT * FROM garden WHERE id = 1');
  res.json(garden);
});

// POST upload/update avatar photos
app.post('/api/garden/avatar/:who', upload.single('photo'), async (req, res) => {
  const who = req.params.who;
  if (who !== 'him' && who !== 'her') return res.status(400).json({ error: 'Invalid person' });
  
  if (req.file) {
    const photoPath = `/uploads/${req.file.filename}`;
    const column = who === 'him' ? 'himPhoto' : 'herPhoto';
    
    // Optional: Fetch old photo and delete it from server to save space
    const oldGarden = await db.get(`SELECT ${column} FROM garden WHERE id = 1`);
    if (oldGarden && oldGarden[column]) {
      const oldPath = path.join(__dirname, oldGarden[column]);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await db.run(`UPDATE garden SET ${column} = ? WHERE id = 1`, [photoPath]);
  }
  
  const garden = await db.get('SELECT * FROM garden WHERE id = 1');
  res.json(garden);
});

// POST plant a new flower (with optional photo)
app.post('/api/flowers', upload.single('photo'), async (req, res) => {
  const { x, y, plantedBy, message, date, flowerType } = req.body;
  const id = uuidv4();
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;
  const createdAt = new Date().toISOString();
  
  await db.run(
    `INSERT INTO flowers (id, x, y, plantedBy, message, date, flowerType, photo, createdAt, bloom) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, parseFloat(x), parseFloat(y), plantedBy || 'unknown', message || '', date || createdAt, flowerType || 'rose', photoPath, createdAt, 2]
  );
  
  const newFlower = await db.get('SELECT * FROM flowers WHERE id = ?', [id]);
  res.json(newFlower);
});

// DELETE a flower
app.delete('/api/flowers/:id', async (req, res) => {
  const id = req.params.id;
  const flower = await db.get('SELECT photo FROM flowers WHERE id = ?', [id]);
  
  if (!flower) return res.status(404).json({ error: 'Not found' });
  
  if (flower.photo) {
    const filePath = path.join(__dirname, flower.photo);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  
  await db.run('DELETE FROM flowers WHERE id = ?', [id]);
  res.json({ success: true });
});

// PATCH update bloom stage
app.patch('/api/flowers/:id/bloom', async (req, res) => {
  const id = req.params.id;
  const flower = await db.get('SELECT bloom FROM flowers WHERE id = ?', [id]);
  
  if (!flower) return res.status(404).json({ error: 'Not found' });
  
  const newBloom = Math.min(2, (flower.bloom || 0) + 1);
  await db.run('UPDATE flowers SET bloom = ? WHERE id = ?', [newBloom, id]);
  
  const updatedFlower = await db.get('SELECT * FROM flowers WHERE id = ?', [id]);
  res.json(updatedFlower);
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🌸 Memory Garden API is running on SQLite!');
  console.log(`  📡 http://localhost:${PORT}`);
  console.log('');
});