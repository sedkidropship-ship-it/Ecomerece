const express = require('express');
const router = express.Router();

/**
 * Fixed Admin User Details
 * - email: "admin@example.com"
 * - password: "123456"
 * - name: "Admin"
 * - role: "admin"
 */
const ADMIN_USER = {
  email: "admin@example.com",
  password: "123456",
  name: "Admin",
  role: "admin"
};

/**
 * @route POST /login
 * @desc  Handles Admin login with fixed credentials
 * @access Public
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Check credentials against fixed user
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    return res.status(200).json({
      message: "Login successful",
      user: {
        name: ADMIN_USER.name,
        email: ADMIN_USER.email,
        role: ADMIN_USER.role
      },
      token: "dummy-token"
    });
  }

  // Unauthorized response
  return res.status(401).json({
    error: "Invalid email or password"
  });
});

module.exports = router;
