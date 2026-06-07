/* ============================================================
   middleware/auth.js — Admin Authentication Middleware
   Protects all admin routes using ADMIN_SECRET_KEY from .env
   ============================================================ */

/* ── HOW IT WORKS ─────────────────────────────────────────────
   Every request to a protected route must include this header:
   
   Header Name:  x-admin-key
   Header Value: (your ADMIN_SECRET_KEY from .env)

   Example using fetch() from the admin dashboard:
   fetch('/api/admin/projects', {
       headers: { 'x-admin-key': 'your_secret_key_here' }
   })
   ============================================================ */

const adminAuth = (req, res, next) => {
    // Read the secret key sent in the request header
    const providedKey = req.headers['x-admin-key'];

    // If no key was provided at all
    if (!providedKey) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No admin key provided.'
        });
    }

    // If the key doesn't match the one in .env
    if (providedKey !== process.env.ADMIN_SECRET_KEY) {
        // Small delay to slow down brute force attempts
        setTimeout(() => {
            return res.status(401).json({
                success: false,
                error: 'Access denied. Invalid admin key.'
            });
        }, 500);
        return;
    }

    // Key is valid — allow the request to proceed to the route handler
    next();
};

module.exports = adminAuth;
