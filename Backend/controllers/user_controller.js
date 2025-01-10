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

exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Cek apakah username sudah ada
    const checkUserQuery = `SELECT * FROM users WHERE username = $1`;
    const insertUserQuery = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`;

    try {
        const { rows: existingUser } = await pool.query(checkUserQuery, [username]);
        if (existingUser.length) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Simpan pengguna baru ke database
        const { rows } = await pool.query(insertUserQuery, [username, password]);
        res.status(201).json({ message: 'User registered successfully', userId: rows[0].id });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};