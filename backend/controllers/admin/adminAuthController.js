const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { db } = require('../../config/database');
const { TABLES, MESSAGES, JWT, HTTP_STATUS, DB_COLUMNS } = require('../../config/constants');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Email and password are required' });
        }

        const user = await db(TABLES.USERS).where({ [DB_COLUMNS.USERS.EMAIL]: email }).first();
        if (!user) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user[DB_COLUMNS.USERS.PASSWORD]);
        if (!match) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign(
            { 
                id: user[DB_COLUMNS.USERS.ID], 
                role: user[DB_COLUMNS.USERS.ROLE], 
                email: user[DB_COLUMNS.USERS.EMAIL] 
            },
            process.env.JWT_SECRET,
            { expiresIn: JWT.EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { 
                id: user[DB_COLUMNS.USERS.ID], 
                name: user[DB_COLUMNS.USERS.NAME], 
                role: user[DB_COLUMNS.USERS.ROLE], 
                email: user[DB_COLUMNS.USERS.EMAIL] 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({ success: false, message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            await db(TABLES.BLACKLISTED_TOKENS).insert({
                [DB_COLUMNS.BLACKLISTED_TOKENS.TOKEN]: token,
                [DB_COLUMNS.BLACKLISTED_TOKENS.EXPIRES_AT]: new Date(req.user.exp * 1000)
            });
        }

        res.json({ success: true, message: MESSAGES.SUCCESS.LOGOUT });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({ success: false, message: MESSAGES.ERROR.INTERNAL_ERROR });
    }
};

