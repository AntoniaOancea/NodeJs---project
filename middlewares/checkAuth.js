
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; 

    if (!token) {
      throw new Error('Authentication failed!');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Authentication failed!' });
  }
};

module.exports = checkAuth;
