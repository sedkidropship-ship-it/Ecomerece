/**
 * Order Controller — Handles order creation and management using Supabase
 */

const supabase = require('../config/supabaseClient');

// POST /api/orders — Create a new order (public — COD)
exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, wilaya, items, notes } = req.body;

    // Validation
    if (!customerName || !phone || !address || !wilaya || !items || items.length === 0) {
      return res.status(400).json({ 
        error: 'Customer name, phone, address, wilaya, and at least one item are required.' 
      });
    }

    // Validate phone (Algerian format)
    const phoneRegex = /^(0|\+213)[5-7][0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ error: 'Please provide a valid Algerian phone number.' });
    }

    // Calculate total and validate products
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      // Get product from Supabase
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.productId)
        .single();

      if (productError || !product) {
        return res.status(400).json({ error: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        price: product.price,
        quantity: item.quantity,
        subtotal: itemTotal
      });

      // Reduce stock in Supabase
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: product.stock - item.quantity })
        .eq('id', product.id);

      if (updateError) throw updateError;
    }

    const orderNumber = 'ME-' + Date.now().toString(36).toUpperCase();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          customer_name: customerName,
          phone,
          address,
          wilaya,
          items: orderItems,
          total,
          shipping: 0,
          grand_total: total,
          status: 'pending',
          payment_method: 'cod',
          notes: notes || ''
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    res.status(201).json({
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/orders — List all orders (admin only)
exports.getOrders = async (req, res) => {
  try {
    const { status, sort } = req.query;
    
    let query = supabase.from('orders').select('*');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Default sort by created_at desc
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    // Map to camelCase for frontend compatibility
    const mappedData = data.map(order => ({
      ...order,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      totalAmount: order.grand_total,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));

    res.json(mappedData);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/orders/:id — Get single order (admin only)
exports.getOrder = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Order not found.' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// PATCH /api/orders/:id/status — Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const status = req.body.status?.toLowerCase();
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Order status updated.', order: data });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// DELETE /api/orders/:id — Delete order (admin only)  
exports.deleteOrder = async (req, res) => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/orders/stats/summary — Order analytics (admin only)
exports.getStats = async (req, res) => {
  try {
    // We can fetch all data and aggregate in JS for simplicity, 
    // or use Supabase RPC for better performance.
    const { data: orders, error: ordersError } = await supabase.from('orders').select('*');
    const { data: products, error: productsError } = await supabase.from('products').select('*');

    if (ordersError) throw ordersError;
    if (productsError) throw productsError;

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.grand_total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= 5).length;

    // Recent orders (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentOrders = orders.filter(o => new Date(o.created_at) >= weekAgo).length;

    // Orders by status
    const ordersByStatus = {
      pending: pendingOrders,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: deliveredOrders,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      totalProducts,
      lowStockProducts,
      recentOrders,
      ordersByStatus
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
