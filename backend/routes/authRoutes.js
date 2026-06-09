const express = require('express');
const router = express.Router();

const { loginAdmin } = require('../controllers/authController');

// 🔐 LOGIN ROUTE
router.post('/login', loginAdmin);

module.exports = router;