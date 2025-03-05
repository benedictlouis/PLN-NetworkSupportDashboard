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
-- Data for Name: activity_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_log (id, start_time, end_time) FROM stdin;
1	08:00:00	09:00:00
2	10:15:00	11:45:00
3	14:30:00	15:00:00
4	18:00:00	20:30:00
\.


--
-- Data for Name: history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.history (id, date, user_id, changes_id, column_name, old_value, new_value, username) FROM stdin;
1	2025-01-30 08:28:17.420217	\N	7	status_kerja	In Progress	Pending	\N
2	2025-01-30 08:28:18.759894	\N	7	status_kerja	Pending	In Progress	\N
3	2025-01-30 08:34:39.915042	\N	7	status_kerja	In Progress	Pending	\N
4	2025-01-30 08:35:28.102663	\N	7	status_kerja	Pending	Resolved	\N
5	2025-01-30 08:35:28.102663	\N	7	tanggal_selesai	\N	2025-02-07	\N
6	2025-01-30 08:35:28.102663	\N	7	jam_selesai	\N	10:00:00	\N
7	2025-01-30 08:35:28.102663	\N	7	solusi_keterangan	\N	restart router	\N
8	2025-01-30 08:40:19.640389	\N	8	nama_pelapor_telepon	gus fring - 08321654987	walter white - 08321654987	\N
9	2025-01-30 08:40:19.640389	\N	8	detail_pekerjaan	masak ayam	masak sesuatu	\N
10	2025-01-30 08:40:19.640389	\N	8	lokasi	los pollos hermanos	lab kimia	\N
11	2025-01-30 08:54:27.851099	\N	10	tanggal_awal	2025-02-02	2025-02-01	\N
12	2025-01-30 08:54:27.851099	\N	10	nama_pelapor_telepon	gus fring - 08999999999	walter white - 08999999999	\N
13	2025-01-30 08:54:27.865006	\N	10	tanggal_awal	2025-02-02T00:00:00.000+07:00	2025-02-01T17:00:00.000Z	admin
14	2025-01-30 08:54:27.866481	\N	10	nama_pelapor_telepon	gus fring - 08999999999	walter white - 08999999999	admin
15	2025-01-30 08:58:16.099364	\N	10	nama_pelapor_telepon	walter white - 08999999999	gus fring - 08999999999	\N
16	2025-01-30 08:58:16.099364	\N	10	detail_pekerjaan	masak ayam	masak bebek	\N
17	2025-01-30 08:58:16.116257	\N	10	tanggal_awal	2025-02-01T00:00:00.000+07:00	2025-02-01T17:00:00.000Z	admin
18	2025-01-30 08:58:16.118731	\N	10	nama_pelapor_telepon	walter white - 08999999999	gus fring - 08999999999	admin
19	2025-01-30 08:58:16.120826	\N	10	detail_pekerjaan	masak ayam	masak bebek	admin
20	2025-01-30 09:01:05.169355	\N	10	nama_pelapor_telepon	gus fring - 08999999999	jesse - 08999999999	\N
21	2025-01-30 09:01:05.169355	\N	10	detail_pekerjaan	masak bebek	masak meth	\N
22	2025-01-30 09:01:05.180296	\N	10	nama_pelapor_telepon	gus fring - 08999999999	jesse - 08999999999	admin
23	2025-01-30 09:01:05.181752	\N	10	detail_pekerjaan	masak bebek	masak meth	admin
24	2025-02-02 22:30:59.960135	1	14	edited_by	\N	1	\N
25	2025-02-02 22:30:59.960135	1	14	status_kerja	In Progress	Pending	\N
26	2025-02-02 22:30:59.960135	1	14	edited_by	\N	1	\N
27	2025-02-14 17:25:29.75577	1	15	edited_by	\N	1	\N
28	2025-02-14 17:25:29.75577	1	15	is_validate	false	true	\N
29	2025-02-14 17:25:29.75577	1	15	edited_by	\N	1	\N
30	2025-02-14 17:27:20.881365	\N	16	created	\N	support123 telah membuat pekerjaan baru	support123
31	2025-02-15 15:49:27.19607	\N	17	created	\N	admin99 telah membuat pekerjaan baru dengan SLA ID 1	admin99
32	2025-02-15 18:13:35.8988	\N	18	created	\N	admin99 telah membuat pekerjaan baru dengan SLA ID 1	admin99
33	2025-02-15 18:40:14.490379	1	18	sla_id	1	2	\N
34	2025-02-15 19:15:10.581141	1	18	sla_id	2	7	\N
35	2025-02-16 02:40:06.107477	15	18	edited_by	1	15	\N
36	2025-02-16 02:40:06.107477	15	18	edited_by	1	15	\N
37	2025-02-16 02:40:39.179109	15	18	sla_id	7	3	\N
38	2025-02-16 02:40:39.179109	15	18	detail_pekerjaan	tes aja	tes baru lagi	\N
39	2025-02-16 02:44:21.327625	15	16	edited_by	4	15	\N
40	2025-02-16 02:44:21.327625	15	16	is_validate	false	true	\N
41	2025-02-16 02:44:21.327625	15	16	edited_by	4	15	\N
42	2025-02-16 02:45:09.753949	15	14	edited_by	1	15	\N
43	2025-02-16 02:45:09.753949	15	14	is_validate	false	true	\N
44	2025-02-16 02:45:09.753949	15	14	edited_by	1	15	\N
45	2025-02-16 02:46:13.6249	15	14	status_kerja	Pending	In Progress	\N
46	2025-02-16 02:46:28.586406	15	14	status_kerja	In Progress	Pending	\N
47	2025-02-16 02:46:49.215558	15	14	status_kerja	Pending	In Progress	\N
48	2025-02-16 02:49:15.994448	15	14	status_kerja	In Progress	Pending	\N
49	2025-02-16 02:50:05.968512	15	14	status_kerja	Pending	Resolved	\N
50	2025-02-16 02:50:05.968512	15	14	jam_selesai	\N	13:00:00	\N
51	2025-02-16 02:50:05.968512	15	14	tanggal_selesai	\N	2025-02-06	\N
52	2025-02-16 02:50:05.968512	15	14	solusi_keterangan	\N	selesai	\N
53	2025-02-16 22:03:30.045624	15	14	status_kerja	Resolved	Pending	\N
54	2025-02-16 22:03:30.045624	15	14	jam_selesai	13:00:00	\N	\N
55	2025-02-16 22:03:30.045624	15	14	tanggal_selesai	2025-02-06	\N	\N
56	2025-02-16 22:03:30.045624	15	14	solusi_keterangan	selesai	\N	\N
57	2025-02-16 22:03:51.003623	15	14	sla_id	\N	4	\N
58	2025-02-16 22:03:51.003623	15	14	lokasi	kantek	kantas	\N
59	2025-02-16 22:06:47.640598	15	18	status_kerja	In Progress	Pending	\N
60	2025-02-16 22:06:54.262833	15	18	status_kerja	Pending	In Progress	\N
61	2025-02-16 22:12:14.065053	15	18	detail_pekerjaan	tes baru lagi	tes baru lagi 2	\N
62	2025-02-16 22:12:14.065053	15	18	lokasi	mampang	gandul	\N
63	2025-02-16 22:14:13.857761	15	18	status_kerja	In Progress	Pending	\N
64	2025-02-16 22:14:17.808246	15	18	status_kerja	Pending	In Progress	\N
65	2025-02-16 22:15:47.924993	15	18	status_kerja	In Progress	Pending	\N
66	2025-02-16 22:15:56.828851	15	18	status_kerja	Pending	In Progress	\N
67	2025-02-16 22:16:07.79561	15	18	status_kerja	In Progress	Pending	\N
68	2025-02-16 22:17:18.166262	15	18	status_kerja	Pending	In Progress	\N
69	2025-02-16 22:18:35.438204	15	18	lokasi	gandul	mampang 2	\N
70	2025-02-16 22:25:20.055733	15	18	tanggal_awal	2025-02-15	2025-02-14	\N
71	2025-02-16 22:25:20.055733	15	18	status_kerja	In Progress	Pending	\N
72	2025-02-16 22:27:05.107389	15	18	tanggal_awal	2025-02-14	2025-02-13	\N
73	2025-02-16 22:27:05.107389	15	18	status_kerja	Pending	In Progress	\N
74	2025-02-16 22:30:06.928987	15	18	is_validate	true	false	\N
75	2025-02-16 22:34:58.204752	\N	19	created	\N	support22 telah membuat pekerjaan baru dengan SLA ID 5	support22
76	2025-02-16 22:46:57.720508	15	19	edited_by	14	15	\N
77	2025-02-16 22:46:57.720508	15	19	is_validate	false	true	\N
78	2025-02-16 22:46:57.720508	15	19	edited_by	14	15	\N
79	2025-02-16 23:33:44.770747	15	18	is_validate	false	true	\N
80	2025-02-16 23:38:58.287185	15	12	edited_by	\N	15	\N
81	2025-02-16 23:38:58.287185	15	12	is_validate	false	true	\N
82	2025-02-16 23:38:58.287185	15	12	edited_by	\N	15	\N
83	2025-02-16 23:40:30.735415	15	11	edited_by	\N	15	\N
84	2025-02-16 23:40:30.735415	15	11	is_validate	false	true	\N
85	2025-02-16 23:40:30.735415	15	11	edited_by	\N	15	\N
86	2025-02-16 23:42:15.240869	15	19	status_kerja	In Progress	Pending	\N
87	2025-02-16 23:42:31.742451	15	19	status_kerja	Pending	In Progress	\N
88	2025-02-16 23:50:18.382306	15	17	status_kerja	In Progress	Resolved	\N
89	2025-02-16 23:50:18.382306	15	17	jam_selesai	\N	16:00:00	\N
90	2025-02-16 23:50:18.382306	15	17	edited_by	1	15	\N
91	2025-02-16 23:50:18.382306	15	17	tanggal_selesai	\N	2025-02-19	\N
92	2025-02-16 23:50:18.382306	15	17	solusi_keterangan	\N	selesai	\N
93	2025-02-16 23:50:18.382306	15	17	edited_by	1	15	\N
94	2025-02-16 23:57:26.356832	\N	20	created	\N	support22 telah membuat pekerjaan baru dengan SLA ID 3	support22
95	2025-02-16 23:58:55.850704	1	20	edited_by	14	1	\N
96	2025-02-16 23:58:55.850704	1	20	is_validate	false	true	\N
97	2025-02-16 23:58:55.850704	1	20	edited_by	14	1	\N
98	2025-02-22 22:52:45.745586	15	20	status_kerja	In Progress	Pending	\N
99	2025-02-22 22:52:45.745586	15	20	edited_by	1	15	\N
100	2025-02-22 22:52:45.745586	15	20	edited_by	1	15	\N
101	2025-02-22 22:53:06.340492	15	20	status_kerja	Pending	In Progress	\N
102	2025-02-22 22:54:28.36581	15	20	status_kerja	In Progress	Pending	\N
103	2025-02-22 22:54:35.310665	15	20	status_kerja	Pending	In Progress	\N
104	2025-02-22 22:56:36.371781	15	20	status_kerja	In Progress	Pending	\N
105	2025-02-22 22:56:39.867531	15	20	status_kerja	Pending	In Progress	\N
106	2025-02-22 22:56:43.466869	15	20	status_kerja	In Progress	Pending	\N
107	2025-02-22 22:57:21.501072	15	20	status_kerja	Pending	In Progress	\N
108	2025-02-22 22:57:36.8998	15	20	status_kerja	In Progress	Pending	\N
109	2025-02-22 22:57:49.959975	15	20	status_kerja	Pending	In Progress	\N
110	2025-02-22 22:57:53.562635	15	20	status_kerja	In Progress	Pending	\N
111	2025-02-22 22:58:06.079105	15	20	status_kerja	Pending	In Progress	\N
112	2025-02-22 23:00:10.080092	15	20	status_kerja	In Progress	Pending	\N
113	2025-02-22 23:00:10.945126	15	20	status_kerja	Pending	In Progress	\N
114	2025-02-22 23:00:11.499068	15	20	status_kerja	In Progress	Pending	\N
115	2025-02-22 23:00:12.022237	15	20	status_kerja	Pending	In Progress	\N
116	2025-02-22 23:00:12.424562	15	20	status_kerja	In Progress	Pending	\N
117	2025-02-22 23:00:12.758571	15	20	status_kerja	Pending	In Progress	\N
118	2025-02-22 23:00:13.221631	15	20	status_kerja	In Progress	Pending	\N
119	2025-02-22 23:00:13.883081	15	20	status_kerja	Pending	In Progress	\N
120	2025-02-22 23:00:14.320359	15	20	status_kerja	In Progress	Pending	\N
121	2025-02-22 23:15:30.454887	15	20	status_kerja	Pending	In Progress	\N
122	2025-02-22 23:15:32.150786	15	20	status_kerja	In Progress	Pending	\N
123	2025-02-22 23:21:43.687475	15	20	status_kerja	Pending	In Progress	\N
124	2025-02-22 23:28:03.439941	15	20	sla_id	3	4	\N
125	2025-02-22 23:28:51.621334	15	10	edited_by	\N	15	\N
126	2025-02-22 23:28:51.621334	15	10	is_validate	false	true	\N
127	2025-02-22 23:28:51.621334	15	10	edited_by	\N	15	\N
128	2025-02-22 23:29:33.069217	15	8	edited_by	\N	15	\N
129	2025-02-22 23:29:33.069217	15	8	is_validate	false	true	\N
130	2025-02-22 23:29:33.069217	15	8	edited_by	\N	15	\N
131	2025-02-22 23:29:50.995805	15	8	sla_id	\N	2	\N
132	2025-02-22 23:46:03.509026	\N	21	created	\N	support22 telah membuat pekerjaan baru dengan SLA ID 4	support22
133	2025-02-22 23:46:55.244554	15	21	edited_by	14	15	\N
134	2025-02-22 23:46:55.244554	15	21	is_validate	false	true	\N
135	2025-02-22 23:46:55.244554	15	21	edited_by	14	15	\N
136	2025-02-22 23:51:52.049741	15	21	sla_id	4	3	\N
137	2025-02-23 00:01:34.694078	\N	21	sla_id	3	4	admin
138	2025-02-23 00:02:41.060736	\N	21	status_kerja	In Progress	Pending	admin0
139	2025-02-23 00:02:41.060736	\N	21	edited_by	15	1	admin0
140	2025-02-23 00:02:41.060736	\N	21	edited_by	15	1	admin0
\.


--
-- Data for Name: network_support; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.network_support (id, minggu, bulan, tahun, tanggal_awal, jam_awal, status_kerja, nama_pelapor_telepon, divisi, lokasi, kategori_pekerjaan, detail_pekerjaan, pic, solusi_keterangan, tanggal_selesai, jam_selesai, edited_by, is_validate, sla_id) FROM stdin;
1	Minggu 2	Desember	2024	2024-12-11	12:00:00	Resolved	Fadly	\N	Trapes Lt 1	LAN	Penarikan kabel LAN dari Switch ICON Gd 2 Lt 1 untuk event Siaga Nataru	{EOS}	Kabel udah ditarik dan sudah di speedtest (Up/Dl : 200Mbps)	2024-12-11	16:30:00	\N	f	\N
2	Minggu 2	Desember	2024	2024-12-12	08:00:00	In Progress	Edy	\N	\N	Konfigurasi	Backup Konfigurasi Peralatan Network Kantor Pusat (Desember)	{Febri,Fano,Tyo,Hakim,Fandi}	\N	\N	\N	\N	f	\N
3	Minggu 2	Desember	2024	2024-12-12	08:00:00	In Progress	Edy	\N	\N	Konfigurasi	Penggantian Password Peralatan Network Kantor Pusat (Desember)	{Febri,Fano,Tyo,Hakim,Fandi}	\N	\N	\N	\N	f	\N
4	Minggu 2	Desember	2024	2024-12-12	06:00:00	Resolved	Edy	\N	\N	Monitoring	Report Monitoring Peralatan Network Kantor Pusat	{Fano}	upload daily monitoring ke grup Network Performance	2024-12-12	07:42:00	\N	f	\N
5	Minggu 2	Desember	2024	2024-12-12	11:00:00	Resolved	Halim Gandul	\N	Gandul	Pendampingan	Pendampingan Peremajaan Perangkat SAP	{Febri}	Progres	2024-12-12	16:30:00	\N	f	\N
6	Minggu 2	Desember	2024	2024-12-12	15:00:00	Resolved	Mbak manda, mas agung	SHB	\N	WiFi	Check lokasi jaringan dan mengarahkan ke SSID PLN NET	{Hakim,Febri}	Sudah selesai Pengecheckkan	2024-12-12	16:30:00	\N	f	\N
14	Minggu 4	Januari	2025	2025-01-22	19:00:00	Pending	Zahlan - 08999999999	HLB	kantas	LAN	makan	{Hakim}	\N	\N	\N	15	t	4
10	Minggu 1	Februari	2025	2025-02-01	10:00:00	In Progress	jesse - 08999999999	ANG	los pollos hermanos	Pendampingan	masak meth	{Tyo}	\N	\N	\N	15	t	\N
7	Minggu 1	Februari	2025	2025-02-05	11:00:00	Resolved	qq - 08123456789	STI	lantai 3	WiFi	mantap	{Tyo}	restart router	2025-02-07	10:00:00	\N	f	\N
8	Minggu 1	Juli	2025	2025-07-02	13:00:00	In Progress	walter white - 08321654987	ANT	lab kimia	Monitoring	masak sesuatu	{EOS}	\N	\N	\N	15	t	2
15	Minggu 2	Desember	2024	2024-12-09	15:00:00	In Progress	gusss - 08321654987	ANT	los pollos hermanos	WAN	masak bebek	{Tyo}	\N	\N	\N	1	t	\N
21	Minggu 4	Februari	2025	2025-02-26	11:00:00	Pending	dennis2 - 08999999999	HSSE	lokasi	WAN	tes add	{Febri}	\N	\N	\N	1	t	4
16	Minggu 3	Februari	2025	2025-02-20	13:00:00	In Progress	gus fring - 08999999999	HSSE	gandul	WAN	odading	{Tyo}	\N	\N	\N	15	t	\N
18	Minggu 3	Februari	2025	2025-02-13	10:00:00	In Progress	dennis - 08321654987	ANG	mampang 2	WiFi	tes baru lagi 2	{Febri}	\N	\N	\N	15	t	3
12	Minggu 4	Januari	2025	2025-01-25	09:00:00	In Progress	gustavo fring - 08999999999	BKI	los pollos hermanos	WiFi	QIQI BOONG	{Tyo}	\N	\N	\N	15	t	\N
11	Minggu 1	Februari	2025	2025-02-02	11:00:00	In Progress	jesse pinkman - 0111111111	HLB	meth lab	Konfigurasi	masak masak	{EOS}	\N	\N	\N	15	t	\N
19	Minggu 4	Februari	2025	2025-02-25	15:00:00	In Progress	mamat - 08123456789	HKK	kutek	Monitoring	jajan	{Fandi}	\N	\N	\N	15	t	5
17	Minggu 3	Februari	2023	2025-02-19	14:00:00	Resolved	John - 08123456789	ANT	Gedung A	LAN	Memperbaiki koneksi jaringan	{Tyo}	selesai	2025-02-19	16:00:00	15	t	1
20	Minggu 3	Februari	2025	2025-02-20	10:00:00	In Progress	Zahlan - 08999999999	ATD	gandul 2	User Access	tes support	{Fano}	\N	\N	\N	15	t	4
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
ygZ-9_H2bODy91Y621HRin9wmcDfXiYz	{"cookie":{"originalMaxAge":86400000,"expires":"2025-02-23T17:02:26.358Z","secure":false,"httpOnly":true,"path":"/"},"userId":1,"username":"admin0","role":"Admin"}	2025-02-24 00:07:21
\.


--
-- Data for Name: sla; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sla (id, sla_level, sla_duration, description) FROM stdin;
1	SLA 1	30	Respon dalam 0-30 menit
2	SLA 2	60	Respon dalam 0-60 menit
3	SLA 3	120	Respon dalam 0-120 menit
4	SLA 4	240	Respon dalam 0-240 menit
5	SLA 5	480	Respon dalam 0-480 menit (1 hari kerja)
6	SLA 6	1440	Respon dalam 0-1440 menit (2 hari kerja)
7	SLA 7	2880	Respon dalam 0-2880 menit (4 hari kerja)
8	SLA 8	4320	Respon dalam 0-4320 menit (6 hari kerja)
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role) FROM stdin;
4	support123	password123	Support
3	supportbaru	support1	Support
12	support88	support88	Support
11	supportudin	supportudin	Support
14	support22	support22	Support
15	admin	admin	Super Admin
5	adminjos	admin2	Admin
16	adminz	adminz	Admin
1	admin0	admin0	Admin
\.


--
-- Name: activity_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_log_id_seq', 4, true);


--
-- Name: history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.history_id_seq', 140, true);


--
-- Name: network_support_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.network_support_id_seq', 21, true);


--
-- Name: sla_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sla_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


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
