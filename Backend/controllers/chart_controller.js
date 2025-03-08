const { pool } = require('../config/db.config.js');

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
        tanggal_selesai IS NOT NULL AND jam_selesai IS NOT NULL AND is_validate = TRUE
      ORDER BY id ASC;
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching durations' });
  }
};

// chart_controller.js
exports.getDurationsByCategory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        kategori_pekerjaan,
        ROUND(
          AVG(
            EXTRACT(EPOCH FROM (
              (tanggal_selesai + jam_selesai::time) - (tanggal_awal + jam_awal::time)
            )) / 60
          ), 
          2
        ) AS avg_duration_minutes
      FROM network_support
      WHERE 
        tanggal_awal IS NOT NULL AND jam_awal IS NOT NULL AND 
        tanggal_selesai IS NOT NULL AND jam_selesai IS NOT NULL AND is_validate = TRUE
      GROUP BY kategori_pekerjaan
      ORDER BY avg_duration_minutes DESC;
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching durations' });
  }
};


exports.jobCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        kategori_pekerjaan,
        COUNT(*) AS total_jobs
      FROM network_support WHERE is_validate = TRUE
      GROUP BY kategori_pekerjaan
      ORDER BY total_jobs DESC;
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching job categories' });
  }
};

exports.jobsPerPic = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        unnest(pic) AS pic_name,
        kategori_pekerjaan AS category,
        COUNT(*) AS total_jobs
      FROM network_support
      WHERE kategori_pekerjaan IS NOT NULL AND is_validate = TRUE
      GROUP BY pic_name, kategori_pekerjaan
      ORDER BY pic_name, kategori_pekerjaan;
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching jobs per pic' });
  }
};

exports.jobsPerPicPercentage = async (req, res) => {
  try {
    const result = await pool.query(`
      WITH total_jobs AS (
        SELECT COUNT(*) AS total FROM network_support WHERE is_validate = TRUE
      )
      SELECT 
        unnest(pic) AS pic_name,
        COUNT(*) AS total_jobs,
        ROUND((COUNT(*) * 100.0 / (SELECT total FROM total_jobs)), 2) AS percentage
      FROM network_support
      GROUP BY pic_name
      ORDER BY total_jobs DESC;
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching jobs per pic percentage' });
  }
};

exports.jobStatusDistribution = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        status_kerja,
        COUNT(*) AS total_jobs
      FROM network_support WHERE is_validate = TRUE
      GROUP BY status_kerja
      ORDER BY total_jobs DESC;
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching jobs status distribution' });
  }
};

exports.jobsPerMonth = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        EXTRACT(YEAR FROM tanggal_awal) AS year,
        EXTRACT(MONTH FROM tanggal_awal) AS month,
        TO_CHAR(tanggal_awal, 'Mon YYYY') AS month_year,
        COUNT(*) AS total_jobs
      FROM network_support
      WHERE tanggal_awal IS NOT NULL AND is_validate = TRUE
      GROUP BY year, month, month_year
      ORDER BY year ASC, month ASC, MIN(id) ASC;
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching jobs per month' });
  }
};

exports.getJobCountPerPIC = async (req, res) => {
  try {
      const query = `
          SELECT unnest(pic) AS individual_pic, COUNT(*) AS job_count
          FROM network_support
          WHERE tanggal_awal >= date_trunc('month', CURRENT_DATE)  
            AND tanggal_awal < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
            AND is_validate = TRUE
          GROUP BY individual_pic
          ORDER BY job_count DESC;
      `;
      const result = await pool.query(query);
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOverdueJobs = async (req, res) => {
  try {
      const query = `
          SELECT n.id, unnest(n.pic) AS individual_pic, s.sla_level, 
                (EXTRACT(EPOCH FROM ((n.tanggal_selesai + n.jam_selesai) - (n.tanggal_awal + n.jam_awal))) / 60) AS actual_duration_minutes,
                s.sla_duration AS sla_limit_minutes
          FROM network_support n
          JOIN sla s ON n.sla_id = s.id
          WHERE n.tanggal_selesai IS NOT NULL 
            AND n.jam_selesai IS NOT NULL
            AND is_validate = TRUE
            AND (EXTRACT(EPOCH FROM ((n.tanggal_selesai + n.jam_selesai) - (n.tanggal_awal + n.jam_awal))) / 60) > s.sla_duration
          ORDER BY actual_duration_minutes DESC;
      `;
      const result = await pool.query(query);
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getSLACompliancePerPIC = async (req, res) => {
  try {
      const query = `
          SELECT unnest(n.pic) AS individual_pic, 
                 COUNT(*) AS total_jobs,
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

exports.getAverageDurationPerPIC = async (req, res) => {
  try {
      const query = `
          SELECT unnest(n.pic) AS individual_pic, 
                 AVG(EXTRACT(EPOCH FROM ((n.tanggal_selesai + n.jam_selesai) - (n.tanggal_awal + n.jam_awal))) / 60) AS avg_duration_minutes
          FROM network_support n
          JOIN sla s ON n.sla_id = s.id
          WHERE n.tanggal_selesai IS NOT NULL 
            AND n.jam_selesai IS NOT NULL
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


