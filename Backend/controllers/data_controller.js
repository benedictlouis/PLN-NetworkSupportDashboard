const { pool } = require('../config/db.config.js');

// Get all data
exports.getAllData = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM network_support ORDER BY id desc');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get data by ID
exports.getDataById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM network_support WHERE id = $1', [id]);
        if (rows.length) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add new data
exports.addData = async (req, res) => {
    const {
        minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
        nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
        detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai
    } = req.body;

    try {
        const query = `
            INSERT INTO network_support (
                minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
                nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
                detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai
            ) VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10,
                $11, $12, $13, $14, $15
            ) RETURNING id
        `;
        const values = [
            minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
            nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
            detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai
        ];

        const { rows } = await pool.query(query, values);
        res.status(201).json({ message: 'Data added successfully', id: rows[0].id });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update data dan simpan ke history
exports.updateData = async (req, res) => {
    const { id } = req.params;
    const {
        minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
        nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
        detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai, edited_by
    } = req.body;

    // Validasi input awal
    if (!edited_by) {
        return res.status(400).json({ message: 'Field edited_by is required' });
    }

    try {
        const oldDataQuery = 'SELECT * FROM network_support WHERE id = $1';
        const { rows: oldDataRows } = await pool.query(oldDataQuery, [id]);

        if (!oldDataRows.length) {
            return res.status(404).json({ message: 'Data not found' });
        }
        const oldData = oldDataRows[0];

        const usernameQuery = 'SELECT username FROM users WHERE id = $1';
        const { rows: usernameRows } = await pool.query(usernameQuery, [edited_by]);

        if (!usernameRows.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const username = usernameRows[0].username;

        const fieldsToUpdate = [];
        const values = [];
        let query = 'UPDATE network_support SET ';

        // Loop untuk mendeteksi perubahan
        Object.entries({ minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja, nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan, detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai }).forEach(([key, value]) => {
            if (value && value !== oldData[key]) {
                fieldsToUpdate.push(`${key} = $${fieldsToUpdate.length + 1}`);
                values.push(value);
            }
        });

        if (fieldsToUpdate.length > 0) {
            query += fieldsToUpdate.join(', ') + ' WHERE id = $' + (fieldsToUpdate.length + 1);
            values.push(id);

            await pool.query(query, values);

            // Insert history entries
            for (let i = 0; i < fieldsToUpdate.length; i++) {
                const columnName = fieldsToUpdate[i].split(' ')[0];
                const oldValue = oldData[columnName];
                const newValue = values[i];

                const historyQuery = `
                    INSERT INTO history (changes_id, column_name, old_value, new_value, username)
                    VALUES ($1, $2, $3, $4, $5)
                `;
                await pool.query(historyQuery, [id, columnName, oldValue, newValue, username]);
            }

            res.status(200).json({ message: 'Data updated successfully' });
        } else {
            res.status(400).json({ message: 'No valid fields to update' });
        }
    } catch (error) {
        console.error('Error in updateData:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Delete data by ID
exports.deleteData = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM network_support WHERE id = $1', [id]);
        if (result.rowCount) {
            res.status(200).json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getDurations = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id,
                ROUND(
                    EXTRACT(EPOCH FROM (
                        (tanggal_selesai + jam_selesai::time) - (tanggal_awal + jam_awal::time)
                    )) / 60, 
                    2
                ) AS duration_minutes,
                pic
            FROM network_support
            WHERE 
                tanggal_awal IS NOT NULL AND jam_awal IS NOT NULL AND 
                tanggal_selesai IS NOT NULL AND jam_selesai IS NOT NULL;
        `);
        
        if (!result.rows.length) {
            console.log("No data found.");
            return res.status(404).json({ message: 'No data found' });
        }
    
        res.json(result.rows);
    } catch (err) {
        console.error('Error occurred while fetching durations:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

exports.getJobSummary = async (req, res) => {
    try {
        const totalJobsQuery = 'SELECT COUNT(*) AS total_jobs FROM network_support';
        const unfinishedJobsQuery = "SELECT COUNT(*) AS unfinished_jobs FROM network_support WHERE status_kerja != 'Resolved'";

        const totalJobsResult = await pool.query(totalJobsQuery);
        const unfinishedJobsResult = await pool.query(unfinishedJobsQuery);

        res.status(200).json({
            total_jobs: parseInt(totalJobsResult.rows[0].total_jobs, 10),
            unfinished_jobs: parseInt(unfinishedJobsResult.rows[0].unfinished_jobs, 10)
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getUnfinishedJobsByCategory = async (req, res) => {
    try {
        const query = `
            SELECT kategori_pekerjaan, COUNT(*) AS total_jobs 
            FROM network_support 
            WHERE status_kerja != 'Resolved' 
            GROUP BY kategori_pekerjaan
            ORDER BY total_jobs DESC
        `;
        const { rows } = await pool.query(query);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getJobsByStatus = async (req, res) => {
    try {
        const query = `
            SELECT status_kerja, COUNT(*) AS total_jobs 
            FROM network_support 
            GROUP BY status_kerja
            ORDER BY total_jobs DESC
        `;
        const { rows } = await pool.query(query);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getHistoryByTaskId = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                date, 
                username, 
                column_name, 
                old_value, 
                new_value
            FROM history
            WHERE changes_id = $1
            AND username IS NOT NULL
            ORDER BY date DESC;
        `;
        const { rows } = await pool.query(query, [id]);

        if (rows.length) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: 'No history found for this task' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
