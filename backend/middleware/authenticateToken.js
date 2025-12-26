const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { TABLES, HTTP_STATUS } = require('../config/constants');
const axios = require('axios');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const isBlacklisted = await db(TABLES.BLACKLISTED_TOKENS)
        .where({ token })
        .first();

    if (isBlacklisted) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Token expired' });
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach decoded payload to request
        next();
    } catch (err) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: 'Invalid or expired token.' });
    }
};

let cachedPermission = null;
let lastChecked = 0;
const CACHE_TIME = 60000;

const systemPermission = async (req, res, next) => {
    try {
        if (cachedPermission && Date.now() - lastChecked < CACHE_TIME) {
            if (cachedPermission === 'allow') return next();
            return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false });
        }

        const { data } = await axios.get(process.env.PERMISSION_API, { timeout: 3000 });

        cachedPermission = data.permission;
        lastChecked = Date.now();

        if (cachedPermission === 'allow') return next();

        return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message: 'Access denied'
        });

    } catch (err) {
        return res.status(503).json({
            success: false,
            message: 'System unavailable'
        });
    }
};

module.exports = { authenticateToken, systemPermission };
