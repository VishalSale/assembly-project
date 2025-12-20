const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { TABLES, HTTP_STATUS, CACHE } = require('../config/constants');
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
let lastFetchedAt = 0;
// Set cache TTL here (ms)
const PERMISSION_CACHE_TTL = CACHE.PERMISSION_TTL;

const systemPermission = async (req, res, next) => {
    try {
        const now = Date.now();

        if (!cachedPermission || now - lastFetchedAt > PERMISSION_CACHE_TTL) {
            const response = await axios.get(process.env.GITHUB_PERMISSION_URL, {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_CONTROL_TOKEN}`
                },
                timeout: 5000
            });

            const parsed = typeof response.data === 'string'
                ? JSON.parse(response.data)
                : response.data;

            cachedPermission = parsed.permission;
            lastFetchedAt = now;
        }

        if (cachedPermission !== 'allow') {
            return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({ success: false, message: 'System is temporarily unavailable' });
        }

        next();
    } catch (err) {
        cachedPermission = 'block';
        lastFetchedAt = Date.now();
        return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({ success: false, message: 'System is temporarily unavailable' });
    }
};

module.exports = { authenticateToken, systemPermission };
