const bcrypt = require('bcryptjs');
const supabase = require('./config/supabaseClient');

async function createAdmin() {
  console.log('👤 Creating Default Admin User in Supabase...');

  const email = 'admin@maisonelite.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email,
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User'
      }
    ])
    .select();

  if (error) {
    if (error.code === '23505') {
       console.log('✅ Admin user already exists.');
    } else {
       console.error('❌ Error creating admin:', error.message);
    }
  } else {
    console.log(`✅ Admin user created successfully!\n   Email: ${email}\n   Password: ${password}`);
  }

  process.exit(0);
}

createAdmin();
