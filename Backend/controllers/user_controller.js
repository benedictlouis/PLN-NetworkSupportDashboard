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

exports.getAllAccounts = async (req, res) => {
    console.log("Request received to get all accounts");

    if (!req.session.role || req.session.role !== "Admin") {
        return res.status(403).json({ message: "Unauthorized: Only Admin can view all accounts" });
    }

    try {
        const query = `SELECT id, username, role FROM users ORDER BY id`;
        const { rows } = await pool.query(query);
        
        console.log("Accounts retrieved:", rows);
        res.status(200).json({ accounts: rows });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.createUserAccount = async (req, res) => {
    console.log("Request received to create account");

    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        console.log("Missing username, password, or role");
        return res.status(400).json({ message: "Username, password, and role are required" });
    }

    if (role !== "Admin" && role !== "Support") {
        return res.status(400).json({ message: "Invalid role. Allowed roles: Admin, Support" });
    }

    if (!req.session.role || req.session.role !== "Admin") {
        return res.status(403).json({ message: "Unauthorized: Only Admin can create accounts" });
    }

    try {
        const checkUserQuery = `SELECT * FROM users WHERE username = $1`;
        const insertUserQuery = `INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id`;

        const { rows: existingUser } = await pool.query(checkUserQuery, [username]);
        if (existingUser.length) {
            console.log("Username already exists");
            return res.status(409).json({ message: "Username already exists" });
        }

        const { rows } = await pool.query(insertUserQuery, [username, password, role]);
        console.log(`${role} account created:`, rows[0]);
        res.status(201).json({ message: `${role} account created successfully`, userId: rows[0].id });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateUserAccount = async (req, res) => {
    console.log("Request received to update account");

    const { targetUsername, newUsername, newPassword, newRole } = req.body;

    if (!targetUsername) {
        console.log("Missing target username");
        return res.status(400).json({ message: "Target username is required" });
    }

    if (!newUsername && !newPassword && !newRole) {
        console.log("No update fields provided");
        return res.status(400).json({ message: "At least one field (username, password, or role) must be provided for update" });
    }

    if (!req.session.role || req.session.role !== "Admin") {
        return res.status(403).json({ message: "Unauthorized: Only Admin can update accounts" });
    }

    try {
        const checkUserQuery = `SELECT * FROM users WHERE username = $1`;
        const { rows: existingUser } = await pool.query(checkUserQuery, [targetUsername]);

        if (existingUser.length === 0) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const userToUpdate = existingUser[0];

        if (userToUpdate.role === "Admin" && targetUsername !== req.session.username) {
            return res.status(403).json({ message: "Unauthorized: Admins can only edit their own account or Support accounts" });
        }

        let updateFields = [];
        let queryParams = [];
        let paramIndex = 1;

        if (newUsername) {
            updateFields.push(`username = $${paramIndex++}`);
            queryParams.push(newUsername);
        }
        if (newPassword) {
            updateFields.push(`password = $${paramIndex++}`);
            queryParams.push(newPassword);
        }
        if (newRole) {
            updateFields.push(`role = $${paramIndex++}`);
            queryParams.push(newRole);
        }

        queryParams.push(targetUsername);

        const updateUserQuery = `UPDATE users SET ${updateFields.join(", ")} WHERE username = $${paramIndex} RETURNING id, username, role`;
        const { rows } = await pool.query(updateUserQuery, queryParams);

        console.log("User updated:", rows[0]);

        if (targetUsername === req.session.username) {
            req.session.username = newUsername || req.session.username;
            req.session.role = newRole || req.session.role;
        }

        res.status(200).json({ message: `User ${targetUsername} updated successfully`, updatedUser: rows[0] });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteUserAccount = async (req, res) => {
    console.log("Request received to delete account");

    const { username } = req.body;

    if (!username) {
        console.log("Missing username");
        return res.status(400).json({ message: "Username is required" });
    }

    if (!req.session.role || req.session.role !== "Admin") {
        return res.status(403).json({ message: "Unauthorized: Only Admin can delete accounts" });
    }

    try {
        const checkUserQuery = `SELECT * FROM users WHERE username = $1`;
        const deleteUserQuery = `DELETE FROM users WHERE username = $1 RETURNING id, username, role`;

        const { rows: userToDelete } = await pool.query(checkUserQuery, [username]);

        if (userToDelete.length === 0) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const targetUser = userToDelete[0];

        if (targetUser.role === "Admin" && targetUser.username !== req.session.username) {
            return res.status(403).json({ message: "Unauthorized: Admins can only delete their own account or Support accounts" });
        }

        const { rows } = await pool.query(deleteUserQuery, [username]);
        console.log(`Account deleted:`, rows[0]);

        if (req.session.username === username) {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Error destroying session:", err);
                    return res.status(500).json({ message: "Account deleted, but session error occurred" });
                }
                return res.status(200).json({ message: `Your account (${username}) has been deleted successfully. Session ended.` });
            });
        } else {
            res.status(200).json({ message: `Account ${username} deleted successfully` });
        }

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
