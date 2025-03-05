--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: bulan_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.bulan_enum AS ENUM (
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
);


ALTER TYPE public.bulan_enum OWNER TO postgres;

--
-- Name: divisi_unit_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.divisi_unit_enum AS ENUM (
    'RSD',
    'PKK',
    'MPB',
    'RST',
    'AKT',
    'PKP',
    'MRE',
    'MEP',
    'AIN',
    'HSSE',
    'ODS',
    'AKP',
    'OKI',
    'TKS',
    'MRP',
    'MKJ',
    'ODM',
    'ODJ',
    'MRF',
    'NPS',
    'RSL',
    'RKO',
    'SAK',
    'MEB',
    'MPT',
    'OSL',
    'TSJ',
    'RSK',
    'ANG',
    'HBK',
    'PBH',
    'SEKPER',
    'HSC',
    'PMO',
    'MKS',
    'PFM',
    'MVA',
    'HTD',
    'ATD',
    'HKK',
    'ANT',
    'PPR',
    'SPI',
    'TEK',
    'KOM',
    'DKI',
    'LDS',
    'LPT',
    'CES',
    'MES',
    'SDTI',
    'HST',
    'APR',
    'SHB',
    'MRS',
    'PPN',
    'MUM',
    'KEU',
    'HLB',
    'KSM',
    'BKI',
    'STI',
    'TCO',
    'RKJ',
    'MDG'
);


ALTER TYPE public.divisi_unit_enum OWNER TO postgres;

--
-- Name: kategori_pekerjaan_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kategori_pekerjaan_enum AS ENUM (
    'WiFi',
    'LAN',
    'Whitelist',
    'User Access',
    'Data Center',
    'WAN',
    'Monitoring',
    'Pendampingan',
    'Pembuatan Laporan/Prosedur/SOP',
    'Konfigurasi',
    'Rapat'
);


ALTER TYPE public.kategori_pekerjaan_enum OWNER TO postgres;

--
-- Name: minggu_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.minggu_enum AS ENUM (
    'Minggu 1',
    'Minggu 2',
    'Minggu 3',
    'Minggu 4'
);


ALTER TYPE public.minggu_enum OWNER TO postgres;

--
-- Name: pic_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.pic_enum AS ENUM (
    'Febri',
    'Fano',
    'Tyo',
    'Hakim',
    'Fandi',
    'EOS'
);


ALTER TYPE public.pic_enum OWNER TO postgres;

--
-- Name: role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_enum AS ENUM (
    'Admin',
    'Support',
    'Super Admin'
);


ALTER TYPE public.role_enum OWNER TO postgres;

--
-- Name: status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_enum AS ENUM (
    'In Progress',
    'Pending',
    'Resolved'
);


ALTER TYPE public.status_enum OWNER TO postgres;

--
-- Name: check_resolved_trigger(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_resolved_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.status_kerja = 'Resolved' THEN
    IF NEW.solusi_keterangan IS NULL OR NEW.tanggal_selesai IS NULL OR NEW.jam_selesai IS NULL THEN
      RAISE EXCEPTION 'Kolom solusi_keterangan, tanggal_selesai, dan jam_selesai harus diisi jika status_kerja adalah Resolved';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_resolved_trigger() OWNER TO postgres;

--
-- Name: log_history(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_history() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    col_name TEXT;  -- Nama kolom
    old_value TEXT;  -- Nilai lama
    new_value TEXT;  -- Nilai baru
    username TEXT; -- Username yang melakukan perubahan
BEGIN
    -- Ambil username dari edited_by yang terkait
    EXECUTE 'SELECT username FROM users WHERE id = $1'
    INTO username
    USING NEW.edited_by;

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
                date, username, changes_id, column_name, old_value, new_value
            )
            VALUES (
                NOW(), username, NEW.id, col_name, old_value, new_value
            );
        END IF;
    END LOOP;

    -- Jika ada perubahan pada kolom edited_by, simpan perubahan tersebut
    IF OLD.edited_by IS DISTINCT FROM NEW.edited_by THEN
        INSERT INTO history (
            date, username, changes_id, column_name, old_value, new_value
        )
        VALUES (
            NOW(), username, NEW.id, 'edited_by', OLD.edited_by::TEXT, NEW.edited_by::TEXT
        );
    END IF;

    RETURN NEW;
END;
$_$;


ALTER FUNCTION public.log_history() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_log (
    id integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL
);


ALTER TABLE public.activity_log OWNER TO postgres;

--
-- Name: activity_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activity_log_id_seq OWNER TO postgres;

--
-- Name: activity_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_log_id_seq OWNED BY public.activity_log.id;


--
-- Name: history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.history (
    id integer NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer,
    changes_id integer NOT NULL,
    column_name character varying(255) NOT NULL,
    old_value text,
    new_value text,
    username character varying(50)
);


ALTER TABLE public.history OWNER TO postgres;

--
-- Name: history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.history_id_seq OWNER TO postgres;

--
-- Name: history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.history_id_seq OWNED BY public.history.id;


--
-- Name: network_support; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.network_support (
    id integer NOT NULL,
    minggu public.minggu_enum NOT NULL,
    bulan public.bulan_enum NOT NULL,
    tahun integer NOT NULL,
    tanggal_awal date NOT NULL,
    jam_awal time without time zone NOT NULL,
    status_kerja public.status_enum NOT NULL,
    nama_pelapor_telepon character varying(255) NOT NULL,
    divisi public.divisi_unit_enum,
    lokasi character varying(255),
    kategori_pekerjaan public.kategori_pekerjaan_enum NOT NULL,
    detail_pekerjaan text NOT NULL,
    pic public.pic_enum[] NOT NULL,
    solusi_keterangan text,
    tanggal_selesai date,
    jam_selesai time without time zone,
    edited_by integer,
    is_validate boolean DEFAULT false,
    sla_id integer
);


ALTER TABLE public.network_support OWNER TO postgres;

--
-- Name: network_support_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.network_support_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.network_support_id_seq OWNER TO postgres;

--
-- Name: network_support_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.network_support_id_seq OWNED BY public.network_support.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: sla; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sla (
    id integer NOT NULL,
    sla_level character varying(50) NOT NULL,
    sla_duration integer NOT NULL,
    description text
);


ALTER TABLE public.sla OWNER TO postgres;

--
-- Name: sla_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sla_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sla_id_seq OWNER TO postgres;

--
-- Name: sla_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sla_id_seq OWNED BY public.sla.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role public.role_enum NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activity_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_log ALTER COLUMN id SET DEFAULT nextval('public.activity_log_id_seq'::regclass);


--
-- Name: history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history ALTER COLUMN id SET DEFAULT nextval('public.history_id_seq'::regclass);


--
-- Name: network_support id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network_support ALTER COLUMN id SET DEFAULT nextval('public.network_support_id_seq'::regclass);


--
-- Name: sla id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sla ALTER COLUMN id SET DEFAULT nextval('public.sla_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: history history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_pkey PRIMARY KEY (id);


--
-- Name: network_support network_support_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network_support
    ADD CONSTRAINT network_support_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: sla sla_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sla
    ADD CONSTRAINT sla_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_session_expire ON public.session USING btree (expire);


--
-- Name: network_support track_changes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER track_changes AFTER UPDATE ON public.network_support FOR EACH ROW EXECUTE FUNCTION public.log_history();


--
-- Name: network_support validate_resolved_fields; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER validate_resolved_fields BEFORE INSERT OR UPDATE ON public.network_support FOR EACH ROW EXECUTE FUNCTION public.check_resolved_trigger();


--
-- Name: network_support fk_edited_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network_support
    ADD CONSTRAINT fk_edited_by FOREIGN KEY (edited_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: network_support fk_sla; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network_support
    ADD CONSTRAINT fk_sla FOREIGN KEY (sla_id) REFERENCES public.sla(id);


--
-- Name: history history_changes_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_changes_id_fkey FOREIGN KEY (changes_id) REFERENCES public.network_support(id) ON DELETE CASCADE;


--
-- Name: history history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--
