const bcrypt = require('bcryptjs');
const supabase = require('./config/supabaseClient');

async function seedSupabase() {
  console.log('🌱 Starting Full Seeding of Supabase for MAISON ÉLITE...\n');

  try {
    // 1. Clear Existing Data (Optional but recommended for a clean seed)
    console.log('🗑️  Clearing existing data...');
    
    // We filter with .neq('id', '00000000-0000-0000-0000-000000000000') to match all UUIDs
    const { error: delOrdersError } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (delOrdersError) console.warn('⚠️  Note on orders clear:', delOrdersError.message);

    const { error: delProductsError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (delProductsError) console.warn('⚠️  Note on products clear:', delProductsError.message);

    const { error: delUsersError } = await supabase.from('users').delete().neq('email', 'system@internal.void');
    if (delUsersError) console.warn('⚠️  Note on users clear:', delUsersError.message);

    // 2. Create Admin User
    const email = 'admin@maisonelite.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('👤 Creating admin user...');
    const { error: userError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          role: 'admin',
          name: 'Admin User'
        }
      ]);

    if (userError && userError.code !== '23505') throw userError;
    console.log('✅ Admin user ready (admin@maisonelite.com / admin123)');

    // 3. Seed Products
    const products = [
      {
        name: 'Noir Velvet Evening Gown',
        price: 12900,
        original_price: 16500,
        description: 'An exquisite floor-length evening gown crafted from premium Italian velvet. The deep noir shade creates a stunning silhouette that commands attention at any event. Features a sculpted bodice with delicate gold thread accents and a flowing train.',
        images: ['/images/products/gown.png'],
        stock: 8,
        category: 'Dresses',
        featured: true,
        rating: 4.9,
        review_count: 47,
        benefits: [
          'Premium Italian velvet fabric',
          'Hand-stitched gold thread details',
          'Tailored fit with hidden zipper'
        ],
        specs: { material: '100% Italian Velvet', care: 'Dry clean only', sizes: 'S, M, L, XL' }
      },
      {
        name: 'Royal Satin Kimono Set',
        price: 8900,
        original_price: 11500,
        description: 'A luxurious two-piece kimono set in lustrous royal satin. The flowing silhouette combines traditional elegance with modern sophistication. Perfect for both casual luxury and formal occasions.',
        images: ['/images/products/kimono.png'],
        stock: 15,
        category: 'Sets',
        featured: true,
        rating: 4.8,
        review_count: 63,
        benefits: ['Premium satin with natural sheen', 'Versatile two-piece design', 'Adjustable waist tie'],
        specs: { material: '95% Satin, 5% Elastane', care: 'Machine wash cold', sizes: 'S, M, L, XL' }
      },
      {
        name: 'Élite Lace Bodycon Dress',
        price: 7500,
        original_price: 9900,
        description: 'A showstopping bodycon dress featuring intricate French lace overlay on premium stretch fabric. The figure-hugging silhouette is perfectly balanced with elegant lace detailing for a look that is both bold and refined.',
        images: ['/images/products/dress.png'],
        stock: 12,
        category: 'Dresses',
        featured: true,
        rating: 4.7,
        review_count: 38,
        benefits: ['French lace overlay', 'Comfortable stretch fabric', 'Built-in shaping liner'],
        specs: { material: 'Nylon/Polyester/Spandex', care: 'Hand wash recommended', sizes: 'XS, S, M, L, XL' }
      },
      {
        name: 'Golden Hour Abaya',
        price: 14500,
        original_price: 18000,
        description: 'Our signature abaya in a stunning golden-hour inspired palette. Crafted from flowing crepe fabric with hand-embroidered gold motifs along the sleeves and hemline. A masterpiece that bridges tradition and haute couture.',
        images: ['/images/products/abaya.png'],
        stock: 6,
        category: 'Abayas',
        featured: true,
        rating: 5.0,
        review_count: 29,
        benefits: ['Hand-embroidered gold accents', 'Premium crepe fabric', 'Flowing oversized silhouette'],
        specs: { material: '100% Premium Crepe', care: 'Dry clean recommended', sizes: 'One Size' }
      },
      {
        name: 'Midnight Silk Blouse',
        price: 5900,
        original_price: 7500,
        description: 'An effortlessly chic silk blouse in deep midnight blue. The fluid drape and subtle sheen make this piece a wardrobe essential. Features mother-of-pearl buttons and French seam finishing.',
        images: ['/images/products/blouse.png'],
        stock: 20,
        category: 'Tops',
        featured: false,
        rating: 4.6,
        review_count: 55,
        benefits: ['Pure mulberry silk', 'Mother-of-pearl buttons', 'French seam finishing'],
        specs: { material: '100% Mulberry Silk', care: 'Dry clean or hand wash', sizes: 'XS, S, M, L' }
      },
      {
        name: 'Opulence Wide-Leg Palazzo',
        price: 6500,
        original_price: 8500,
        description: 'Dramatic wide-leg palazzo pants in luxurious heavyweight crepe. The high-waisted design elongates the silhouette while the generous drape creates effortless movement and grace. A statement piece for the modern woman.',
        images: ['/images/products/palazzo.png'],
        stock: 18,
        category: 'Bottoms',
        featured: false,
        rating: 4.8,
        review_count: 41,
        benefits: ['Heavyweight crepe fabric', 'High-waisted flattering fit', 'Fully lined'],
        specs: { material: '100% Polyester Crepe', care: 'Machine wash cold', sizes: 'S, M, L, XL' }
      },
      {
        name: 'Diamond Dust Evening Clutch',
        price: 4500,
        original_price: 5900,
        description: 'A dazzling evening clutch adorned with crystal-encrusted hardware and premium faux leather. The compact design holds all your essentials while adding a touch of opulence to any outfit. Includes a detachable gold chain strap.',
        images: ['/images/products/clutch-1.jpg', '/images/products/clutch-2.jpg'],
        stock: 25,
        category: 'Accessories',
        featured: true,
        rating: 4.9,
        review_count: 72,
        benefits: ['Crystal-encrusted clasp', 'Premium faux leather', 'Detachable gold chain'],
        specs: { material: 'Faux Leather, Crystal', dimensions: '22cm x 12cm', includes: 'Chain strap' }
      },
      {
        name: 'Empress Embroidered Caftan',
        price: 16900,
        original_price: 21000,
        description: 'The crown jewel of our collection — a breathtaking caftan featuring over 40 hours of hand embroidery. Rich jewel-toned fabric adorned with intricate gold and silver threadwork. Each piece is a unique work of art.',
        images: ['/images/products/caftan-1.jpg', '/images/products/caftan-2.jpg'],
        stock: 3,
        category: 'Abayas',
        featured: true,
        rating: 5.0,
        review_count: 18,
        benefits: ['40+ hours of hand embroidery', 'Premium jewel-toned fabric', 'Gold & silver threadwork'],
        specs: { material: 'Premium Silk Blend', care: 'Professional clean only', sizes: 'One Size' }
      }
    ];

    console.log(`📦 Inserting ${products.length} products...`);
    const { data: insertedProducts, error: productError } = await supabase.from('products').insert(products).select();
    if (productError) throw productError;
    console.log(`✅ ${insertedProducts.length} products seeded.`);

    // 4. Seed Demo Orders
    const demoOrders = [
      {
        order_number: 'ME-' + Date.now().toString(36).toUpperCase() + '1',
        customer_name: 'Amina Benali',
        phone: '0555123456',
        address: '12 Rue Didouche Mourad',
        wilaya: 'Algiers',
        items: [{ productName: 'Royal Satin Kimono Set', price: 8900, quantity: 1, subtotal: 8900 }],
        total: 8900,
        grand_total: 8900,
        status: 'delivered',
        payment_method: 'cod'
      },
      {
        order_number: 'ME-' + Date.now().toString(36).toUpperCase() + '2',
        customer_name: 'Sara Mansouri',
        phone: '0661987654',
        address: '45 Boulevard Mohamed V',
        wilaya: 'Oran',
        items: [{ productName: 'Golden Hour Abaya', price: 14500, quantity: 1, subtotal: 14500 }],
        total: 14500,
        grand_total: 14500,
        status: 'shipped',
        payment_method: 'cod'
      },
      {
        order_number: 'ME-' + Date.now().toString(36).toUpperCase() + '3',
        customer_name: 'Yasmine Khelifi',
        phone: '0770456789',
        address: '8 Rue Ben Badis',
        wilaya: 'Constantine',
        items: [
          { productName: 'Élite Lace Bodycon Dress', price: 7500, quantity: 1, subtotal: 7500 },
          { productName: 'Diamond Dust Evening Clutch', price: 4500, quantity: 1, subtotal: 4500 }
        ],
        total: 12000,
        grand_total: 12000,
        status: 'confirmed',
        payment_method: 'cod'
      }
    ];

    console.log(`📋 Inserting ${demoOrders.length} orders...`);
    const { error: orderError } = await supabase.from('orders').insert(demoOrders);
    if (orderError) throw orderError;
    console.log(`✅ ${demoOrders.length} demo orders seeded.`);

    console.log('\n🎉 Supabase Database seeding complete!');
    console.log('-------------------------------------------');
    console.log('Email: admin@maisonelite.com');
    console.log('Password: admin123');
    console.log('-------------------------------------------\n');

  } catch (error) {
    console.error('\n❌ Error seeding Supabase:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
  } finally {
    process.exit(0);
  }
}

seedSupabase();
