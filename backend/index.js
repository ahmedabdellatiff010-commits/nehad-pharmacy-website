/**
 * Pharmacy Admin Control Panel - Main Server
 * Express.js API with JSON file storage
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



// ===== RAILWAY ROOT CHECK (IMPORTANT) =====
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is running on Railway 🚀'
  });
});





/* ===================== PATHS ===================== */
const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const IMAGES_DIR = path.join(ROOT_DIR, 'image');
const ADMIN_DIR = path.join(ROOT_DIR, 'admin');

/* ===================== ENSURE DIRS ===================== */
[DATA_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ===================== STATIC FILES ===================== */
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/image', express.static(IMAGES_DIR));
app.use('/admin', express.static(ADMIN_DIR));
app.use(express.static(ROOT_DIR));

/* ===================== MULTER ===================== */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

/* ===================== HELPERS ===================== */
const readJSON = (file) => {
  try {
    const p = path.join(DATA_DIR, file);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
};

const writeJSON = (file, data) => {
  try {
    fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
    return true;
  } catch {
    return false;
  }
};

/* ===================== API ROUTES ===================== */

/* Health */
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

/* Upload */
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

/* Products */
app.get('/api/products', (_, res) => res.json(readJSON('products.json')));
app.post('/api/products', (req, res) => {
  const items = readJSON('products.json');
  const item = { id: `p-${Date.now()}`, ...req.body };
  items.push(item);
  writeJSON('products.json', items);
  res.json(item);
});

/* Categories */
app.get('/api/categories', (_, res) => res.json(readJSON('categories.json')));

/* Orders */
app.get('/api/orders', (_, res) => res.json(readJSON('orders.json')));

/* Reviews */
app.get('/api/reviews', (_, res) => res.json(readJSON('reviews.json')));

/* ===================== SPA FALLBACK ===================== */
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});



// ROOT ROUTE (مهم جدا لـ Railway)
app.get('/', (req, res) => {
  res.status(200).send('Backend is running 🚀');
});



/* ===================== START SERVER ===================== */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;