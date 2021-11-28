const jwt = require('jsonwebtoken');
const require = require('config');

// middleware function for authentication
module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        // 401 = not authorized
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); // decode token

        req.user = decoded.user; // set user as decoded user
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
