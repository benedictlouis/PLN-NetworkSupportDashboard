-- SQL QUERY

-- Tabel Network Support
CREATE TYPE minggu_enum AS ENUM ('Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4');
CREATE TYPE bulan_enum AS ENUM ('Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember');
CREATE TYPE status_enum AS ENUM ('In Progress', 'Pending', 'Resolved');
CREATE TYPE divisi_unit_enum AS ENUM ('RSD', 'PKK', 'MPB', 'RST', 'AKT', 'PKP', 'MRE', 'MEP', 'AIN', 'HSSE', 'ODS', 'AKP', 'OKI', 'TKS', 'MRP', 'MKJ', 'ODM', 'ODJ', 'MRF', 'NPS', 'RSL', 'RKO', 'SAK', 'MEB', 'MPT', 'OSL', 'TSJ', 'RSK', 'ANG', 'HBK', 'PBH', 'SEKPER', 'HSC', 'PMO', 'MKS', 'PFM', 'MVA', 'HTD', 'ATD', 'HKK', 'ANT', 'PPR', 'SPI', 'TEK', 'KOM', 'DKI', 'LDS', 'LPT', 'CES', 'MES', 'SDTI', 'HST', 'APR', 'SHB', 'MRS', 'PPN', 'MUM', 'KEU', 'HLB', 'KSM', 'BKI', 'STI', 'TCO', 'RKJ', 'MDG');
CREATE TYPE kategori_pekerjaan_enum AS ENUM ('WiFi', 'LAN', 'Whitelist', 'User Access', 'Data Center', 'WAN', 'Monitoring', 'Pendampingan', 'Pembuatan Laporan/Prosedur/SOP', 'Konfigurasi', 'Rapat');
CREATE TYPE pic_enum AS ENUM ('Febri', 'Fano', 'Tyo', 'Hakim', 'Fandi', 'EOS');

CREATE TABLE network_support (
    id SERIAL PRIMARY KEY,
    minggu minggu_enum NOT NULL,
    bulan bulan_enum NOT NULL,
    tahun INTEGER NOT NULL,
    tanggal_awal DATE NOT NULL,
    jam_awal TIME NOT NULL,
    status_kerja status_enum NOT NULL,
    nama_pelapor_telepon VARCHAR(255) NOT NULL,
    divisi divisi_unit_enum,
    lokasi VARCHAR(255),
    kategori_pekerjaan kategori_pekerjaan_enum NOT NULL,
    detail_pekerjaan TEXT NOT NULL,
    pic pic_enum NOT NULL,
    solusi_keterangan TEXT,
    tanggal_selesai DATE,
    jam_selesai TIME
);

CREATE OR REPLACE FUNCTION check_resolved_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status_kerja = 'Resolved' THEN
    IF NEW.solusi_keterangan IS NULL OR NEW.tanggal_selesai IS NULL OR NEW.jam_selesai IS NULL THEN
      RAISE EXCEPTION 'Kolom solusi_keterangan, tanggal_selesai, dan jam_selesai harus diisi jika status_kerja adalah Resolved';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_resolved_fields
BEFORE INSERT OR UPDATE ON network_support
FOR EACH ROW
EXECUTE FUNCTION check_resolved_trigger();


ALTER TABLE network_support
ALTER COLUMN pic TYPE pic_enum[] USING ARRAY[pic];


-- Tabel users
CREATE TYPE role_enum AS ENUM ('Admin', 'Support');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,                
    username VARCHAR(50) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL        
);

ALTER TABLE users
ADD COLUMN role role_enum NOT NULL;


-- Tabel History
CREATE TABLE history (
    id SERIAL PRIMARY KEY,                        -- Primary key untuk tabel history
    date TIMESTAMP NOT NULL DEFAULT NOW(),        -- Tanggal dan waktu perubahan
    user_id INTEGER NOT NULL,                     -- Foreign key ke tabel users (siapa yang melakukan perubahan)
    changes_id INTEGER NOT NULL,                  -- Foreign key ke tabel network_support (data yang diubah)
    column_name VARCHAR(255) NOT NULL,            -- Nama kolom yang diubah
    old_value TEXT,                               -- Nilai lama sebelum perubahan
    new_value TEXT,                               -- Nilai baru setelah perubahan
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (changes_id) REFERENCES network_support (id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION log_history()
RETURNS TRIGGER AS $$
DECLARE
    col_name TEXT;  -- Nama kolom
    old_value TEXT;  -- Nilai lama
    new_value TEXT;  -- Nilai baru
    user_id INTEGER; -- ID pengguna yang melakukan perubahan
BEGIN
    -- Ambil user_id dari kolom edited_by pada baris NEW
    user_id := NEW.edited_by;

    -- Loop melalui semua kolom yang dimonitor
    FOR col_name IN
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'network_support'
    LOOP
        -- Khusus untuk kolom bertipe array (contoh: 'pic')
        IF col_name = 'pic' THEN
            old_value := ARRAY_TO_STRING(OLD.pic, ', ');
            new_value := ARRAY_TO_STRING(NEW.pic, ', ');
        ELSE
            -- Ambil nilai lama dan baru dari kolom non-array
            EXECUTE FORMAT(
                'SELECT ($1).%I::TEXT, ($2).%I::TEXT',
                col_name, col_name
            )
            INTO old_value, new_value
            USING OLD, NEW;
        END IF;

        -- Jika nilai berubah, simpan ke tabel history
        IF old_value IS DISTINCT FROM new_value THEN
            INSERT INTO history (
                date, user_id, changes_id, column_name, old_value, new_value
            )
            VALUES (
                NOW(), user_id, NEW.id, col_name, old_value, new_value
            );
        END IF;
    END LOOP;

    -- Jika ada perubahan pada kolom edited_by, simpan perubahan tersebut
    IF OLD.edited_by IS DISTINCT FROM NEW.edited_by THEN
        INSERT INTO history (
            date, user_id, changes_id, column_name, old_value, new_value
        )
        VALUES (
            NOW(), user_id, NEW.id, 'edited_by', OLD.edited_by::TEXT, NEW.edited_by::TEXT
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER track_changes
AFTER UPDATE ON network_support
FOR EACH ROW
EXECUTE FUNCTION log_history();


ALTER TABLE network_support
ADD COLUMN edited_by INTEGER,
ADD CONSTRAINT fk_edited_by FOREIGN KEY (edited_by) REFERENCES users(id) ON DELETE SET NULL;


-- Test Data input network_support
/* Valid Input test*/
INSERT INTO network_support (
    minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja, nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan, detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai
) VALUES (
    'Minggu 2', 'Desember', 2024, '2024-12-10', '11:00', 'Resolved', 'Nurhalim / Desktop support', NULL, 'GU.12 Kanan', 'WiFi', 'AP-GU-Lt.12-Kanan-2 terpantau error di indikatornya. Sudah dicek kabelnya masih ok. Restart port, juga masih sama.', ARRAY['Tyo', 'Fano']::pic_enum[], 'Ganti AP (ex. AP-G2-Lt.4-RR.STI)', '2024-12-10', '14:00'
);

/* Not Valid Input test*/
INSERT INTO network_support (
    minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja, nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan, detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai
) VALUES (
    'Minggu 2', 'Desember', 2024, '2024-12-11', '11:00', 'In Progress', 'Edy', NULL, 'Trapes Lt 1', 'LAN', 'Cek Link kabel LAN untuk EO di Gd 2 Lt 1, penambahan VLAN untuk FOH (Operator)', ARRAY['Tyo']::pic_enum[], NULL, NULL, NULL
);

UPDATE network_support
SET
    status_kerja = 'Resolved',
WHERE id = 2;

/* Update Valid Input test*/
UPDATE network_support
SET
    status_kerja = 'Resolved',
    solusi_keterangan = 'LAN link diperbaiki dan VLAN berhasil ditambahkan',
    tanggal_selesai = '2024-12-11',
    jam_selesai = '13:00'
WHERE id = 2;


/* Test data users */
-- Masukkan satu akun untuk login
INSERT INTO users (username, password) 
VALUES ('admin', 'admin123');
