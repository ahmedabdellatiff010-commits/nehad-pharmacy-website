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

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ================= DIRECTORIES =================
const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const IMAGES_DIR = path.join(ROOT_DIR, 'image');
const ADMIN_DIR = path.join(ROOT_DIR, 'admin');

// Ensure folders exist
[DATA_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ================= STATIC FILES =================
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/image', express.static(IMAGES_DIR));
app.use('/admin', express.static(ADMIN_DIR));
app.use(express.static(ROOT_DIR));

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// ================= HELPERS =================
function readJSON(file) {
  try {
    const p = path.join(DATA_DIR, file);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
    return true;
  } catch {
    return false;
  }
}

// ================= API =================

// PRODUCTS
app.get('/api/products', (_, res) => res.json(readJSON('products.json')));

app.post('/api/products', (req, res) => {
  const products = readJSON('products.json');
  const item = { id: `product-${Date.now()}`, ...req.body };
  products.push(item);
  writeJSON('products.json', products);
  res.json(item);
});

// CATEGORIES
app.get('/api/categories', (_, res) => res.json(readJSON('categories.json')));

// ORDERS
app.get('/api/orders', (_, res) => res.json(readJSON('orders.json')));

// PAGES
app.get('/api/pages', (_, res) => res.json(readJSON('pages.json')));

// SETTINGS
app.get('/api/settings', (_, res) =>
  res.json(readJSON('settings.json')[0] || {})
);

// STATS
app.get('/api/statistics', (_, res) => {
  const products = readJSON('products.json');
  const orders = readJSON('orders.json');
  res.json({
    totalProducts: products.length,
    totalOrders: orders.length
  });
});

// UPLOAD
app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

// HEALTH
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// ================= SPA FALLBACK =================
app.get('*', (_, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// ================= START SERVER =================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});