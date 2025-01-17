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

// Update data by ID
exports.updateData = async (req, res) => {
    const { id } = req.params;
    const {
        minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
        nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
        detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai
    } = req.body;

    try {
        const query = `
            UPDATE network_support SET
                minggu = $1, bulan = $2, tahun = $3, tanggal_awal = $4, jam_awal = $5, status_kerja = $6,
                nama_pelapor_telepon = $7, divisi = $8, lokasi = $9, kategori_pekerjaan = $10,
                detail_pekerjaan = $11, pic = $12, solusi_keterangan = $13, tanggal_selesai = $14, jam_selesai = $15
            WHERE id = $16
        `;
        const values = [
            minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja,
            nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan,
            detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai, id
        ];

        const result = await pool.query(query, values);
        if (result.rowCount) {
            res.status(200).json({ message: 'Data updated successfully' });
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
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
        console.log("Fetching durations...");
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
