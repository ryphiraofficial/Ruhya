const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  let token = null;

  // 1. Primary: Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Fallback: Check httpOnly cookie (Safari/Mac cross-origin support)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    // Debug logging — remove after confirming Safari fix works
    console.log('[Auth Debug] No token found.');
    console.log('[Auth Debug] Authorization header:', req.headers.authorization || 'MISSING');
    console.log('[Auth Debug] Cookies:', JSON.stringify(req.cookies || {}));
    console.log('[Auth Debug] Origin:', req.headers.origin || 'MISSING');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.log('[Auth Debug] Token verification failed:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
