const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;
    console.log('Token:', token);

    if (!token) {
        console.error('No token provided'); 
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('Decoded:', decoded); 
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err); 
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
