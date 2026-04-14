/**
 * MAISON ÉLITE — Site Structure Controller
 * Manages Categories and Navbar links
 */

const fs = require('fs');
const path = require('path');

const STRUCTURE_FILE = path.join(__dirname, '..', 'data', 'structure.json');

const DEFAULT_STRUCTURE = {
  categories: [
    { id: '1', name: 'Dresses', image: '/uploads/cat_dresses.jpg' },
    { id: '2', name: 'Abayas', image: '/uploads/cat_abayas.jpg' },
    { id: '3', name: 'Sets', image: '/uploads/cat_sets.jpg' },
    { id: '4', name: 'Accessories', image: '/uploads/cat_acc.jpg' }
  ],
  navbar: [
    { label: 'Home', href: '/' },
    { label: 'Collection', href: '/products' },
    { label: 'Dresses', href: '/products?category=Dresses' },
    { label: 'Abayas', href: '/products?category=Abayas' }
  ]
};

function readStructure() {
  try {
    if (fs.existsSync(STRUCTURE_FILE)) {
      return JSON.parse(fs.readFileSync(STRUCTURE_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to read structure data:', err);
  }
  return DEFAULT_STRUCTURE;
}

function writeStructure(data) {
  const dir = path.dirname(STRUCTURE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STRUCTURE_FILE, JSON.stringify(data, null, 2));
}

exports.getStructure = (req, res) => {
  res.json(readStructure());
};

exports.updateStructure = (req, res) => {
  try {
    writeStructure(req.body);
    res.json({ message: 'Site structure updated successfully', data: req.body });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update site structure' });
  }
};
