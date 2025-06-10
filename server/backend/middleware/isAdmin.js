const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    
    
    
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    // Check if the user exists and is an admin
    if (user && user.role === 'admin') {
      req.user = user; // Attach user info to request object
      next(); // Pass control to the next middleware/route handler
    } else {
      return res.status(403).json({ message: 'Access denied, Admins only' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Not authenticated', error: error.message });
  }
};

module.exports = isAdmin;