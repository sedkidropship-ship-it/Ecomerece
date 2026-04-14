/**
 * MAISON ÉLITE — Delivery (Livraison) Controller
 * Manages Wilayas, Communes, and Pricing
 */

const fs = require('fs');
const path = require('path');

const DELIVERY_FILE = path.join(__dirname, '..', 'data', 'delivery.json');

// Initial default data
const DEFAULT_DELIVERY = [
  {
    id: '1',
    wilaya: 'Alger',
    communes: [
      { name: 'Alger Centre', priceHome: 400, priceOffice: 300 },
      { name: 'Sidi M\'Hamed', priceHome: 400, priceOffice: 300 },
      { name: 'El Biar', priceHome: 450, priceOffice: 350 }
    ]
  },
  {
    id: '2',
    wilaya: 'Oran',
    communes: [
      { name: 'Oran', priceHome: 600, priceOffice: 500 },
      { name: 'Arzew', priceHome: 700, priceOffice: 600 }
    ]
  }
];

function readDelivery() {
  try {
    if (fs.existsSync(DELIVERY_FILE)) {
      return JSON.parse(fs.readFileSync(DELIVERY_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to read delivery data:', err);
  }
  return DEFAULT_DELIVERY;
}

function writeDelivery(data) {
  const dir = path.dirname(DELIVERY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DELIVERY_FILE, JSON.stringify(data, null, 2));
}

exports.getDeliveryData = (req, res) => {
  res.json(readDelivery());
};

exports.updateDeliveryData = (req, res) => {
  try {
    writeDelivery(req.body);
    res.json({ message: 'Delivery settings updated successfully', data: req.body });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery settings' });
  }
};
