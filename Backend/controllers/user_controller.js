const { pool } = require('../config/db.config.js');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = $1 AND password = $2`;
    try {
        const { rows } = await pool.query(query, [username, password]);
        if (rows.length) {
            const user = rows[0];

            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;

            res.status(200).json({ 
                message: 'Login successful',
                id: user.id,
                username: user.username, 
                role: user.role  
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

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

exports.createSupportAccount = async (req, res) => {
    console.log("Request received to create support account"); // Cek apakah fungsi terpanggil

    const { username, password } = req.body;

    if (!username || !password) {
        console.log("Missing username or password");
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const checkUserQuery = `SELECT * FROM users WHERE username = $1`;
        const insertUserQuery = `INSERT INTO users (username, password, role) VALUES ($1, $2, 'Support') RETURNING id`;

        const { rows: existingUser } = await pool.query(checkUserQuery, [username]);
        if (existingUser.length) {
            console.log("Username already exists");
            return res.status(409).json({ message: "Username already exists" });
        }

        const { rows } = await pool.query(insertUserQuery, [username, password]);
        console.log("Support account created:", rows[0]);
        res.status(201).json({ message: "Support account created successfully", userId: rows[0].id });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.deleteSupportAccount = async (req, res) => {
    const { id } = req.params;

    if (req.session.userRole !== "Admin") {
        return res.status(403).json({ message: "Access denied. Only Admin can delete accounts." });
    }

    const deleteQuery = `DELETE FROM users WHERE id = $1 AND role = 'Support' RETURNING *`;

    try {
        const { rows } = await pool.query(deleteQuery, [id]);
        if (rows.length) {
            res.status(200).json({ message: "Support user deleted successfully" });
        } else {
            res.status(404).json({ message: "Support user not found or cannot be deleted" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
