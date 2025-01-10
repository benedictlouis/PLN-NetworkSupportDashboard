const { pool } = require('../config/db.config.js');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = $1 AND password = $2`;
    try {
        const { rows } = await pool.query(query, [username, password]);
        if (rows.length) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}