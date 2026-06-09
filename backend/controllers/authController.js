const jwt = require('jsonwebtoken');

// 🔐 your custom admin credentials
const ADMIN_USER = "tusharghuse9";      // change this
const ADMIN_PASS = "12345";      // change this

exports.loginAdmin = (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {

        const token = jwt.sign(
            { role: "admin" },
            process.env.JWT_SECRET || "secretkey123",
            { expiresIn: "2h" }
        );

        return res.json({
            success: true,
            token
        });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid credentials"
    });
};