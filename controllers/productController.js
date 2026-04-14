/**
 * Product Controller — Full CRUD for products using Supabase
 */

const supabase = require('../config/supabaseClient');

// GET /api/products — List all products from Supabase with filtering and pagination
exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort, featured, limit, page = 1 } = req.query;

    let query = supabase.from('products').select('*', { count: 'exact' });

    // Filter by featured status
    if (featured === 'true' || featured === true) {
      query = query.eq('featured', true);
    }

    // Filter by category
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    // Search by name (case-insensitive in Supabase)
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Sorting logic
    if (sort === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'popular') {
      query = query.order('rating', { ascending: false });
    } else {
      // Default: featured first, then newest
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
    }

    // Pagination
    const pageSize = Number(limit) || 50;
    const from = (Number(page) - 1) * pageSize;
    const to = from + pageSize - 1;
    
    if (limit) {
      query = query.range(from, to);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    // Map to camelCase for frontend compatibility
    const mappedData = data.map(product => ({
      ...product,
      originalPrice: product.original_price,
      reviewCount: product.review_count,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    res.json(mappedData);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: error.message || 'Server error.' });
  }
};

// GET /api/products/:id — Get single product
exports.getProduct = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Product not found.' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/products — Create product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, description, images, stock, category, featured, benefits, specs, colors, sizes, weight } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ error: 'Name, price, description, and category are required.' });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          price: Number(price),
          original_price: originalPrice ? Number(originalPrice) : null,
          description,
          images: images || [],
          stock: stock !== undefined ? Number(stock) : 50,
          category,
          featured: featured || false,
          rating: 4.8,
          review_count: Math.floor(Math.random() * 50) + 10,
          benefits: benefits || [],
          specs: specs || {},
          colors: colors || [],
          sizes: sizes || [],
          weight: weight || null
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: error.message || 'Server error.' });
  }
};

// PUT /api/products/:id — Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ['name', 'price', 'originalPrice', 'description', 'images', 'stock', 'category', 'featured', 'benefits', 'specs', 'colors', 'sizes', 'weight'];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        // Map camelCase to snake_case for Supabase if needed
        const supabaseField = field === 'originalPrice' ? 'original_price' : field;
        updates[supabaseField] = req.body[field];
      }
    }

    if (updates.price) updates.price = Number(updates.price);
    if (updates.original_price) updates.original_price = Number(updates.original_price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: 'Product not found.' });

    res.json(data[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// DELETE /api/products/:id — Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/products/categories/list — Get unique categories
exports.getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category');

    if (error) throw error;

    const categories = [...new Set(data.map(p => p.category))];
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
