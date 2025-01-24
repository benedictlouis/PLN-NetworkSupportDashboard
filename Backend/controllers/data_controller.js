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

exports.updateData = async (req, res) => {
    const { id } = req.params;
    const {
        minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
        nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
        detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai, edited_by
    } = req.body;

    const fieldsToUpdate = [];
    const values = [];
    let query = 'UPDATE network_support SET ';

    // Menambahkan kolom yang diubah ke query dan values
    if (minggu) {
        fieldsToUpdate.push('minggu = $' + (fieldsToUpdate.length + 1));
        values.push(minggu);
    }
    if (bulan) {
        fieldsToUpdate.push('bulan = $' + (fieldsToUpdate.length + 1));
        values.push(bulan);
    }
    if (tahun) {
        fieldsToUpdate.push('tahun = $' + (fieldsToUpdate.length + 1));
        values.push(tahun);
    }
    if (tanggal_awal) {
        fieldsToUpdate.push('tanggal_awal = $' + (fieldsToUpdate.length + 1));
        values.push(tanggal_awal);
    }
    if (jam_awal) {
        fieldsToUpdate.push('jam_awal = $' + (fieldsToUpdate.length + 1));
        values.push(jam_awal);
    }
    if (status_kerja) {
        fieldsToUpdate.push('status_kerja = $' + (fieldsToUpdate.length + 1));
        values.push(status_kerja);
    }
    if (nama_pelapor_telepon) {
        fieldsToUpdate.push('nama_pelapor_telepon = $' + (fieldsToUpdate.length + 1));
        values.push(nama_pelapor_telepon);
    }
    if (divisi) {
        fieldsToUpdate.push('divisi = $' + (fieldsToUpdate.length + 1));
        values.push(divisi);
    }
    if (lokasi) {
        fieldsToUpdate.push('lokasi = $' + (fieldsToUpdate.length + 1));
        values.push(lokasi);
    }
    if (kategori_pekerjaan) {
        fieldsToUpdate.push('kategori_pekerjaan = $' + (fieldsToUpdate.length + 1));
        values.push(kategori_pekerjaan);
    }
    if (detail_pekerjaan) {
        fieldsToUpdate.push('detail_pekerjaan = $' + (fieldsToUpdate.length + 1));
        values.push(detail_pekerjaan);
    }
    if (pic) {
        fieldsToUpdate.push('pic = $' + (fieldsToUpdate.length + 1));
        values.push(pic);
    }
    if (solusi_keterangan) {
        fieldsToUpdate.push('solusi_keterangan = $' + (fieldsToUpdate.length + 1));
        values.push(solusi_keterangan);
    }
    if (tanggal_selesai) {
        fieldsToUpdate.push('tanggal_selesai = $' + (fieldsToUpdate.length + 1));
        values.push(tanggal_selesai);
    }
    if (jam_selesai) {
        fieldsToUpdate.push('jam_selesai = $' + (fieldsToUpdate.length + 1));
        values.push(jam_selesai);
    }
    if (edited_by) {
        fieldsToUpdate.push('edited_by = $' + (fieldsToUpdate.length + 1));
        values.push(edited_by); // Menambahkan edited_by dari body
    }

    // Jika ada kolom yang diubah, lanjutkan untuk membangun query dan menambahkan where
    if (fieldsToUpdate.length > 0) {
        query += fieldsToUpdate.join(', ') + ' WHERE id = $' + (fieldsToUpdate.length + 1);
        values.push(id); // Menambahkan ID untuk WHERE clause

        try {
            const result = await pool.query(query, values);
            if (result.rowCount) {
                res.status(200).json({ message: 'Data updated successfully' });
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(400).json({ message: 'No valid fields to update' });
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

// Get history by task ID
exports.getHistoryByTaskId = async (req, res) => {
    const { id } = req.params; // ID dari task
    try {
        const query = `
            SELECT 
                h.date, 
                u.username AS user, 
                h.column_name, 
                h.old_value, 
                h.new_value
            FROM history h
            JOIN users u ON h.user_id = u.id
            WHERE h.changes_id = $1
            ORDER BY h.date DESC;
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


