const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { db } = require('../../config/database');
const { TABLES, MESSAGES, JWT } = require('../../config/constants');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await db(TABLES.USERS).where({ email }).first();
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { 
                id: user.id, 
                name: user.name, 
                role: user.role, 
                email: user.email 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            await db('blacklisted_tokens').insert({
                token,
                expires_at: new Date(req.user.exp * 1000)
            });
        }

        res.json({ success: true, message: MESSAGES.SUCCESS.LOGOUT });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: MESSAGES.ERROR.INTERNAL_ERROR });
    }
};

