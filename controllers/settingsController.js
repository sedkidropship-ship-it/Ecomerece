/**
 * MAISON ÉLITE — Settings Controller
 * Handles theme customization: colors + logo
 * Storage: JSON file (data/settings.json)
 */

const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '..', 'data', 'settings.json');

// Default theme — used as fallback
const DEFAULT_THEME = {
  primaryColor: '#C9A24A',
  secondaryColor: '#DEB866',
  backgroundColor: '#050505',
  cardColor: '#0F0F0F',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  borderColor: '#1A1A1A',
  logoUrl: '',
  heroImageUrl: '',
  storeName: 'MAISON ÉLITE',
  primaryFont: 'Playfair Display',
  secondaryFont: 'Inter',
  updatedAt: new Date().toISOString()
};

/**
 * Read settings from disk (or return defaults)
 */
function readSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Merge with defaults so new keys always exist
      return { ...DEFAULT_THEME, ...parsed };
    }
  } catch (err) {
    console.error('⚠ Failed to read settings:', err.message);
  }
  return { ...DEFAULT_THEME };
}

/**
 * Write settings to disk
 */
function writeSettings(data) {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
}

/**
 * GET /api/settings/theme
 * Public — no auth required (frontend needs it on load)
 */
exports.getTheme = (req, res) => {
  try {
    const theme = readSettings();
    res.json(theme);
  } catch (err) {
    console.error('Error fetching theme:', err);
    res.status(500).json({ error: 'Failed to fetch theme settings' });
  }
};

/**
 * PUT /api/settings/theme
 * Protected — admin only
 * Accepts new theme fields
 */
exports.updateTheme = (req, res) => {
  try {
    const current = readSettings();
    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    writeSettings(updated);
    res.json({ message: 'Theme updated successfully', theme: updated });
  } catch (err) {
    console.error('Error updating theme:', err);
    res.status(500).json({ error: 'Failed to update theme settings' });
  }
};

/**
 * Helper to handle image uploads (Logo/Hero)
 */
async function handleImageUpload(req, res, prefix) {
  const { imageData, filename } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  // Extract base64 content
  const matches = imageData.match(/^data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ error: 'Invalid image format. Use PNG, JPEG, WebP, or SVG.' });
  }

  const ext = matches[1] === 'svg+xml' ? 'svg' : matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  // Create uploads dir
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Save file with timestamp
  const safeName = `${prefix}_${Date.now()}.${ext}`;
  const filePath = path.join(uploadsDir, safeName);
  fs.writeFileSync(filePath, buffer);

  // Build URL — relative path the frontend can use
  return `/uploads/${safeName}`;
}

/**
 * POST /api/settings/theme/logo
 * Protected — admin only
 */
exports.uploadLogo = async (req, res) => {
  try {
    const logoUrl = await handleImageUpload(req, res, 'logo');
    if (typeof logoUrl !== 'string') return; // res already sent if error

    const current = readSettings();
    current.logoUrl = logoUrl;
    current.updatedAt = new Date().toISOString();
    writeSettings(current);

    res.json({ message: 'Logo uploaded successfully', logoUrl, theme: current });
  } catch (err) {
    console.error('Error uploading logo:', err);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
};

/**
 * POST /api/settings/theme/hero
 * Protected — admin only
 */
exports.uploadHero = async (req, res) => {
  try {
    const heroImageUrl = await handleImageUpload(req, res, 'hero');
    if (typeof heroImageUrl !== 'string') return;

    const current = readSettings();
    current.heroImageUrl = heroImageUrl;
    current.updatedAt = new Date().toISOString();
    writeSettings(current);

    res.json({ message: 'Hero image uploaded successfully', heroImageUrl, theme: current });
  } catch (err) {
    console.error('Error uploading hero image:', err);
    res.status(500).json({ error: 'Failed to upload hero image' });
  }
};

