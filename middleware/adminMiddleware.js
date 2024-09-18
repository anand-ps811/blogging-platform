const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
    const token = req.cookies?.token;
    console.log(token);

    if (!token) {
        return res.redirect('/adminLogin').status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user;

        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'You are not authorized to access this page' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = adminMiddleware;
