const { pool } = require('../config/db.config.js');

// Get all data
exports.getAllData = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM network_support WHERE is_validate = true ORDER BY id DESC');
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

// Add new data and record history
exports.addData = async (req, res) => {
    const {
        minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
        nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
        detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai, edited_by, sla_id
    } = req.body;

    // Validasi edited_by
    if (!edited_by) {
        return res.status(400).json({ message: 'Field edited_by is required' });
    }

    // Validasi sla_id (opsional, tergantung kebutuhan)
    if (!sla_id) {
        return res.status(400).json({ message: 'Field sla_id is required' });
    }

    try {
        // Ambil role user berdasarkan edited_by
        const userRoleQuery = 'SELECT role FROM users WHERE id = $1';
        const { rows: userRoleRows } = await pool.query(userRoleQuery, [edited_by]);

        if (!userRoleRows.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userRole = userRoleRows[0].role;

        // Jika role adalah admin atau super admin, set is_validate = true
        const is_validate = userRole === 'Admin' || userRole === 'Super Admin';

        // Insert new data dengan sla_id
        const insertQuery = `
            INSERT INTO network_support (
                minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
                nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
                detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai, edited_by, is_validate, sla_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18
            ) RETURNING id
        `;
        const values = [
            minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
            nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
            detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai, edited_by, is_validate, sla_id
        ];

        const { rows } = await pool.query(insertQuery, values);
        const newId = rows[0].id;

        // Ambil username berdasarkan edited_by
        const usernameQuery = 'SELECT username FROM users WHERE id = $1';
        const { rows: userRows } = await pool.query(usernameQuery, [edited_by]);

        if (!userRows.length) {
            return res.status(404).json({ message: 'User not found' });
        }
        const username = userRows[0].username;

        // Cek jika history sudah dimasukkan
        const checkHistoryQuery = `SELECT 1 FROM history WHERE changes_id = $1 AND column_name = 'created' LIMIT 1`;
        const { rows: historyRows } = await pool.query(checkHistoryQuery, [newId]);

        if (historyRows.length === 0) {
            // Simpan ke history bahwa pekerjaan telah dibuat dengan pesan yang lebih singkat
            const historyQuery = `
                INSERT INTO history (changes_id, column_name, old_value, new_value, username)
                VALUES ($1, 'created', NULL, $2, $3)
            `;
            const historyMessage = `${username} telah membuat pekerjaan baru dengan SLA ID ${sla_id}`;
            await pool.query(historyQuery, [newId, historyMessage, username]);
        }

        res.status(201).json({ message: 'Data added successfully', id: newId });
    } catch (error) {
        console.error('Error in addData:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Update data dan simpan ke history
exports.updateData = async (req, res) => {
    const { id } = req.params;
    const {
        minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
        nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
        detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai,
        jam_selesai, sla_id, edited_by, is_validate
    } = req.body;

    // Validasi input awal
    if (!edited_by) {
        return res.status(400).json({ message: 'Field edited_by is required' });
    }

    try {
        // Ambil role user berdasarkan edited_by
        const userRoleQuery = 'SELECT role FROM users WHERE id = $1';
        const { rows: userRoleRows } = await pool.query(userRoleQuery, [edited_by]);

        console.log("User role found:", userRoleRows);

        if (!userRoleRows.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userRole = userRoleRows[0].role;

        // Jika mencoba mengedit is_validate dan role bukan admin, tolak permintaan
        if (is_validate !== undefined && userRole !== 'Admin' && userRole !== 'Super Admin') {
            return res.status(403).json({ message: 'Only admin or super admin can edit is_validate' });
        }

        // Ambil data lama
        const oldDataQuery = 'SELECT * FROM network_support WHERE id = $1';
        const { rows: oldDataRows } = await pool.query(oldDataQuery, [id]);

        if (!oldDataRows.length) {
            return res.status(404).json({ message: 'Data not found' });
        }
        const oldData = oldDataRows[0];

        // Ambil username berdasarkan edited_by
        const usernameQuery = 'SELECT username FROM users WHERE id = $1';
        const { rows: usernameRows } = await pool.query(usernameQuery, [edited_by]);

        if (!usernameRows.length) {
            return res.status(404).json({ message: 'User not found' });
        }
        const username = usernameRows[0].username;

        // Siapkan query untuk update
        const fieldsToUpdate = [];
        const values = [];
        let query = 'UPDATE network_support SET ';

        // Loop untuk mendeteksi perubahan
        Object.entries({
            minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
            nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
            detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, 
            jam_selesai, sla_id, is_validate
        }).forEach(([key, value]) => {
            if (value !== undefined && value !== oldData[key]) { // Pastikan nilai baru berbeda
                fieldsToUpdate.push(`${key} = $${fieldsToUpdate.length + 1}`);
                values.push(value);
            }
        });

        if (fieldsToUpdate.length > 0) {
            // Tambahkan edited_by ke query
            fieldsToUpdate.push(`edited_by = $${fieldsToUpdate.length + 1}`);
            values.push(edited_by);

            query += fieldsToUpdate.join(', ') + ' WHERE id = $' + (fieldsToUpdate.length + 1);
            values.push(id);

            // Eksekusi query update
            await pool.query(query, values);

            res.status(200).json({ message: 'Data updated successfully' });
        } else {
            res.status(400).json({ message: 'No valid fields to update' });
        }
    } catch (error) {
        console.error('Error in updateData:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
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
        const totalJobsQuery = "SELECT COUNT(*) AS total_jobs FROM network_support WHERE is_validate = TRUE";
        const unfinishedJobsQuery = "SELECT COUNT(*) AS unfinished_jobs FROM network_support WHERE status_kerja != 'Resolved' AND is_validate = TRUE";

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
            WHERE status_kerja != 'Resolved' AND is_validate = TRUE
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
            FROM network_support  WHERE is_validate = TRUE
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
                *
            FROM history
            WHERE changes_id = $1
            AND column_name != 'edited_by' -- Exclude edited_by
            ORDER BY date DESC; -- Sort by latest first
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

exports.getUnvalidatedData = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM network_support WHERE is_validate = false ORDER BY id DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAverageDurationPerPIC = async (req, res) => {
    try {
        const query = `
            SELECT unnest(pic) AS individual_pic, 
                   AVG(EXTRACT(EPOCH FROM ((tanggal_selesai + jam_selesai) - (tanggal_awal + jam_awal))) / 60) AS avg_duration_minutes
            FROM network_support
            WHERE tanggal_selesai IS NOT NULL 
              AND jam_selesai IS NOT NULL
              AND is_validate = TRUE
            GROUP BY individual_pic
            ORDER BY avg_duration_minutes DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
exports.getPICPerformance = async (req, res) => {
    try {
        const query = `
            SELECT unnest(n.pic) AS individual_pic, 
                   COUNT(*) AS total_jobs,
                   AVG(EXTRACT(EPOCH FROM ((n.tanggal_selesai + n.jam_selesai) - (n.tanggal_awal + n.jam_awal))) / 60) AS avg_duration_minutes,
                   COUNT(CASE 
                            WHEN (EXTRACT(EPOCH FROM ((n.tanggal_selesai + n.jam_selesai) - (n.tanggal_awal + n.jam_awal))) / 60) <= s.sla_duration 
                            THEN 1 
                         END) AS on_time_jobs,
                   COUNT(CASE 
                            WHEN (EXTRACT(EPOCH FROM ((n.tanggal_selesai + n.jam_selesai) - (n.tanggal_awal + n.jam_awal))) / 60) > s.sla_duration 
                            THEN 1 
                         END) AS late_jobs
            FROM network_support n
            JOIN sla s ON n.sla_id = s.id
            WHERE n.tanggal_selesai IS NOT NULL 
              AND n.jam_selesai IS NOT NULL
              AND is_validate = TRUE
            GROUP BY individual_pic
            ORDER BY total_jobs DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
