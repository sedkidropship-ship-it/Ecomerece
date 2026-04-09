const supabase = require('./config/supabaseClient');

async function validate() {
  console.log('🔍 Starting Supabase Integration Validation...\n');

  // 1. Check Products Table
  console.log('📦 Checking "products" table...');
  const { data: products, error: pError } = await supabase.from('products').select('id').limit(1);
  if (pError) {
    console.error('❌ Failed to access "products" table:', pError.message);
  } else {
    console.log('✅ "products" table is accessible.');
  }

  // 2. Check Orders Table
  console.log('📋 Checking "orders" table...');
  const { data: orders, error: oError } = await supabase.from('orders').select('id').limit(1);
  if (oError) {
    console.error('❌ Failed to access "orders" table:', oError.message);
  } else {
    console.log('✅ "orders" table is accessible.');
  }

  // 3. Check Users Table
  console.log('👤 Checking "users" table...');
  const { data: users, error: uError } = await supabase.from('users').select('id, email').limit(1);
  if (uError) {
    console.error('❌ Failed to access "users" table:', uError.message);
  } else {
    console.log('✅ "users" table is accessible.');
    if (users.length === 0) {
      console.warn('⚠️  "users" table is empty. Admin login will fail until you seed a user.');
    } else {
      console.log(`✅ Found ${users.length} user(s). First user: ${users[0].email}`);
    }
  }

  console.log('\n🏁 Validation Complete.');
  process.exit(0);
}

validate();
