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
        // Ambil data lama dari database
        const { rows: existingData } = await pool.query('SELECT * FROM network_support WHERE id = $1', [id]);

        if (!existingData.length) {
            return res.status(404).json({ message: 'Data not found' });
        }

        // Data lama
        const oldData = existingData[0];

        // Gunakan data lama jika tidak ada nilai baru
        const updatedData = {
            minggu: minggu ?? oldData.minggu,
            bulan: bulan ?? oldData.bulan,
            tahun: tahun ?? oldData.tahun,
            tanggal_awal: tanggal_awal ?? oldData.tanggal_awal,
            jam_awal: jam_awal ?? oldData.jam_awal,
            status_kerja: status_kerja ?? oldData.status_kerja,
            nama_pelapor_telepon: nama_pelapor_telepon ?? oldData.nama_pelapor_telepon,
            divisi: divisi ?? oldData.divisi,
            lokasi: lokasi ?? oldData.lokasi,
            kategori_pekerjaan: kategori_pekerjaan ?? oldData.kategori_pekerjaan,
            detail_pekerjaan: detail_pekerjaan ?? oldData.detail_pekerjaan,
            pic: pic ?? oldData.pic,
            solusi_keterangan: solusi_keterangan ?? oldData.solusi_keterangan,
            tanggal_selesai: tanggal_selesai ?? oldData.tanggal_selesai,
            jam_selesai: jam_selesai ?? oldData.jam_selesai,
        };

        // Query update dengan data yang telah diperbarui
        const query = `
            UPDATE network_support SET
                minggu = $1, bulan = $2, tahun = $3, tanggal_awal = $4, jam_awal = $5, status_kerja = $6,
                nama_pelapor_telepon = $7, divisi = $8, lokasi = $9, kategori_pekerjaan = $10,
                detail_pekerjaan = $11, pic = $12, solusi_keterangan = $13, tanggal_selesai = $14, jam_selesai = $15
            WHERE id = $16
        `;
        const values = [
            updatedData.minggu, updatedData.bulan, updatedData.tahun, updatedData.tanggal_awal, updatedData.jam_awal,
            updatedData.status_kerja, updatedData.nama_pelapor_telepon, updatedData.divisi, updatedData.lokasi,
            updatedData.kategori_pekerjaan, updatedData.detail_pekerjaan, updatedData.pic,
            updatedData.solusi_keterangan, updatedData.tanggal_selesai, updatedData.jam_selesai, id
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