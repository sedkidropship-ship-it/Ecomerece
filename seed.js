/**
 * Database Seeder — Populates the store with products and admin user
 * Run: node seed.js
 */

const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function seed() {
  console.log('🌱 Seeding MAISON ÉLITE database...\n');

  // Clear existing data
  db.products.deleteMany();
  db.orders.deleteMany();
  db.users.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  db.users.create({
    email: 'admin@maisonelite.com',
    password: hashedPassword,
    role: 'admin',
    name: 'Admin'
  });
  console.log('✅ Admin user created (admin@maisonelite.com / admin123)');

  // Seed products
  const products = [
    {
      name: 'Noir Velvet Evening Gown',
      price: 12900,
      originalPrice: 16500,
      description: 'An exquisite floor-length evening gown crafted from premium Italian velvet. The deep noir shade creates a stunning silhouette that commands attention at any event. Features a sculpted bodice with delicate gold thread accents and a flowing train.',
      images: ['/images/products/gown-1.jpg', '/images/products/gown-2.jpg', '/images/products/gown-3.jpg'],
      stock: 8,
      category: 'Dresses',
      featured: true,
      rating: 4.9,
      reviewCount: 47,
      benefits: [
        'Premium Italian velvet fabric',
        'Hand-stitched gold thread details',
        'Tailored fit with hidden zipper',
        'Includes dust bag for storage'
      ],
      specs: {
        material: '100% Italian Velvet',
        care: 'Dry clean only',
        origin: 'Designed in Algeria',
        sizes: 'S, M, L, XL'
      }
    },
    {
      name: 'Royal Satin Kimono Set',
      price: 8900,
      originalPrice: 11500,
      description: 'A luxurious two-piece kimono set in lustrous royal satin. The flowing silhouette combines traditional elegance with modern sophistication. Perfect for both casual luxury and formal occasions.',
      images: ['/images/products/kimono-1.jpg', '/images/products/kimono-2.jpg'],
      stock: 15,
      category: 'Sets',
      featured: true,
      rating: 4.8,
      reviewCount: 63,
      benefits: [
        'Premium satin with natural sheen',
        'Versatile two-piece design',
        'Adjustable waist tie',
        'Machine washable on delicate'
      ],
      specs: {
        material: '95% Satin, 5% Elastane',
        care: 'Machine wash cold, hang dry',
        origin: 'Designed in Algeria',
        sizes: 'S, M, L, XL'
      }
    },
    {
      name: 'Élite Lace Bodycon Dress',
      price: 7500,
      originalPrice: 9900,
      description: 'A showstopping bodycon dress featuring intricate French lace overlay on premium stretch fabric. The figure-hugging silhouette is perfectly balanced with elegant lace detailing for a look that is both bold and refined.',
      images: ['/images/products/bodycon-1.jpg', '/images/products/bodycon-2.jpg'],
      stock: 12,
      category: 'Dresses',
      featured: true,
      rating: 4.7,
      reviewCount: 38,
      benefits: [
        'French lace overlay',
        'Comfortable stretch fabric',
        'Built-in shaping liner',
        'Perfect for special occasions'
      ],
      specs: {
        material: '70% Nylon, 25% Polyester, 5% Spandex',
        care: 'Hand wash recommended',
        origin: 'Designed in Algeria',
        sizes: 'XS, S, M, L, XL'
      }
    },
    {
      name: 'Golden Hour Abaya',
      price: 14500,
      originalPrice: 18000,
      description: 'Our signature abaya in a stunning golden-hour inspired palette. Crafted from flowing crepe fabric with hand-embroidered gold motifs along the sleeves and hemline. A masterpiece that bridges tradition and haute couture.',
      images: ['/images/products/abaya-1.jpg', '/images/products/abaya-2.jpg', '/images/products/abaya-3.jpg'],
      stock: 6,
      category: 'Abayas',
      featured: true,
      rating: 5.0,
      reviewCount: 29,
      benefits: [
        'Hand-embroidered gold accents',
        'Premium crepe fabric',
        'Flowing oversized silhouette',
        'Comes with matching belt'
      ],
      specs: {
        material: '100% Premium Crepe',
        care: 'Dry clean recommended',
        origin: 'Handcrafted in Algeria',
        sizes: 'One Size (adjustable)'
      }
    },
    {
      name: 'Midnight Silk Blouse',
      price: 5900,
      originalPrice: 7500,
      description: 'An effortlessly chic silk blouse in deep midnight blue. The fluid drape and subtle sheen make this piece a wardrobe essential. Features mother-of-pearl buttons and French seam finishing.',
      images: ['/images/products/blouse-1.jpg', '/images/products/blouse-2.jpg'],
      stock: 20,
      category: 'Tops',
      featured: false,
      rating: 4.6,
      reviewCount: 55,
      benefits: [
        'Pure mulberry silk',
        'Mother-of-pearl buttons',
        'French seam finishing',
        'Versatile day-to-night piece'
      ],
      specs: {
        material: '100% Mulberry Silk',
        care: 'Dry clean or hand wash',
        origin: 'Designed in Algeria',
        sizes: 'XS, S, M, L'
      }
    },
    {
      name: 'Opulence Wide-Leg Palazzo',
      price: 6500,
      originalPrice: 8500,
      description: 'Dramatic wide-leg palazzo pants in luxurious heavyweight crepe. The high-waisted design elongates the silhouette while the generous drape creates effortless movement and grace. A statement piece for the modern woman.',
      images: ['/images/products/palazzo-1.jpg', '/images/products/palazzo-2.jpg'],
      stock: 18,
      category: 'Bottoms',
      featured: false,
      rating: 4.8,
      reviewCount: 41,
      benefits: [
        'Heavyweight crepe fabric',
        'High-waisted flattering fit',
        'Hidden side zipper',
        'Fully lined'
      ],
      specs: {
        material: '100% Polyester Crepe',
        care: 'Machine wash cold',
        origin: 'Designed in Algeria',
        sizes: 'S, M, L, XL'
      }
    },
    {
      name: 'Diamond Dust Evening Clutch',
      price: 4500,
      originalPrice: 5900,
      description: 'A dazzling evening clutch adorned with crystal-encrusted hardware and premium faux leather. The compact design holds all your essentials while adding a touch of opulence to any outfit. Includes a detachable gold chain strap.',
      images: ['/images/products/clutch-1.jpg', '/images/products/clutch-2.jpg'],
      stock: 25,
      category: 'Accessories',
      featured: true,
      rating: 4.9,
      reviewCount: 72,
      benefits: [
        'Crystal-encrusted clasp',
        'Premium faux leather',
        'Detachable gold chain',
        'Fits phone, cards, lipstick'
      ],
      specs: {
        material: 'Premium Faux Leather, Crystal',
        dimensions: '22cm x 12cm x 5cm',
        origin: 'Designed in Algeria',
        includes: 'Dust bag, chain strap'
      }
    },
    {
      name: 'Empress Embroidered Caftan',
      price: 16900,
      originalPrice: 21000,
      description: 'The crown jewel of our collection — a breathtaking caftan featuring over 40 hours of hand embroidery. Rich jewel-toned fabric adorned with intricate gold and silver threadwork. Each piece is a unique work of art.',
      images: ['/images/products/caftan-1.jpg', '/images/products/caftan-2.jpg', '/images/products/caftan-3.jpg'],
      stock: 3,
      category: 'Abayas',
      featured: true,
      rating: 5.0,
      reviewCount: 18,
      benefits: [
        '40+ hours of hand embroidery',
        'Premium jewel-toned fabric',
        'Gold & silver threadwork',
        'Certificate of authenticity'
      ],
      specs: {
        material: 'Premium Silk Blend',
        care: 'Professional clean only',
        origin: 'Handcrafted in Algeria',
        sizes: 'One Size'
      }
    }
  ];

  db.products.insertMany(products);
  console.log(`✅ ${products.length} products seeded`);

  // Seed some demo orders
  const demoOrders = [
    {
      orderNumber: 'ME-ORD001',
      customerName: 'Amina Benali',
      phone: '0555123456',
      address: '12 Rue Didouche Mourad',
      wilaya: 'Algiers',
      items: [{ productName: 'Royal Satin Kimono Set', price: 8900, quantity: 1, subtotal: 8900 }],
      total: 8900,
      shipping: 0,
      grandTotal: 8900,
      status: 'delivered',
      paymentMethod: 'cod'
    },
    {
      orderNumber: 'ME-ORD002',
      customerName: 'Sara Mansouri',
      phone: '0661987654',
      address: '45 Boulevard Mohamed V',
      wilaya: 'Oran',
      items: [{ productName: 'Golden Hour Abaya', price: 14500, quantity: 1, subtotal: 14500 }],
      total: 14500,
      shipping: 0,
      grandTotal: 14500,
      status: 'shipped',
      paymentMethod: 'cod'
    },
    {
      orderNumber: 'ME-ORD003',
      customerName: 'Yasmine Khelifi',
      phone: '0770456789',
      address: '8 Rue Ben Badis',
      wilaya: 'Constantine',
      items: [
        { productName: 'Élite Lace Bodycon Dress', price: 7500, quantity: 1, subtotal: 7500 },
        { productName: 'Diamond Dust Evening Clutch', price: 4500, quantity: 1, subtotal: 4500 }
      ],
      total: 12000,
      shipping: 0,
      grandTotal: 12000,
      status: 'confirmed',
      paymentMethod: 'cod'
    },
    {
      orderNumber: 'ME-ORD004',
      customerName: 'Lina Boudiaf',
      phone: '0550111222',
      address: '23 Avenue de l\'ALN',
      wilaya: 'Blida',
      items: [{ productName: 'Empress Embroidered Caftan', price: 16900, quantity: 1, subtotal: 16900 }],
      total: 16900,
      shipping: 0,
      grandTotal: 16900,
      status: 'pending',
      paymentMethod: 'cod'
    },
    {
      orderNumber: 'ME-ORD005',
      customerName: 'Nour Hadjadj',
      phone: '0667333444',
      address: '15 Cité 1000 Logements',
      wilaya: 'Setif',
      items: [{ productName: 'Midnight Silk Blouse', price: 5900, quantity: 2, subtotal: 11800 }],
      total: 11800,
      shipping: 0,
      grandTotal: 11800,
      status: 'delivered',
      paymentMethod: 'cod'
    }
  ];

  db.orders.insertMany(demoOrders);
  console.log(`✅ ${demoOrders.length} demo orders seeded`);

  console.log('\n🎉 Database seeding complete!\n');
  console.log('Admin Login:');
  console.log('  Email: admin@maisonelite.com');
  console.log('  Password: admin123\n');
}

seed().catch(console.error);
