const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const isBlacklisted = await db('blacklisted_tokens')
        .where({ token })
        .first();

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Token expired' });
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach decoded payload to request
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

module.exports = { authenticateToken };
