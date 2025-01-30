import { useState } from "react";
import ToastContainer from './toastcontainer';
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Form = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        kategori: "",
        nama: "",
        telepon: "",
        divisi: "",
        lokasi: "",
        detail: "",
        tanggal: "",
        jam: "",
        pic: [],
    });

    const [errors, setErrors] = useState({});
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {
        const id = new Date().getTime();
        setToasts([...toasts, { id, type, message }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const handleChange = (e) => {
        const { id, value, multiple, selectedOptions } = e.target;

        if (multiple) {
            // Collect selected values for multiple select
            const values = Array.from(selectedOptions).map((option) => option.value);
            setFormData((prev) => ({ ...prev, [id]: values }));
        } else {
            setFormData((prev) => ({ ...prev, [id]: value }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Kategori Pekerjaan harus diisi
        if (!formData.kategori) {
            newErrors.kategori = "Wajib diisi.";
        }

        // Nama atau Telepon harus diisi salah satu
        if (!formData.nama && !formData.telepon) {
            newErrors.contact = "Isi salah satu atau keduanya.";
        }

        // Divisi atau Lokasi harus diisi salah satu
        if (!formData.divisi && !formData.lokasi) {
            newErrors.assignment = "Isi salah satu atau keduanya.";
        }

        // Pengecekan apakah nomor telepon berisi angka dan format yang valid
        if (formData.telepon && isNaN(formData.telepon)) {
            newErrors.number = "Nomor telepon harus berupa angka.";
        } else if (formData.telepon && formData.telepon.length < 10) {
            newErrors.number = "Nomor telepon harus terdiri dari minimal 10 digit.";
        }

        if (!formData.detail) {
            newErrors.detail = "Wajib diisi.";
        }

        if (formData.pic.length === 0) {
            newErrors.pic = "Pilih setidaknya satu PIC.";
        }

        if (!formData.tanggal) {
            newErrors.tanggal = "Wajib diisi.";
        }

        if (!formData.jam) {
            newErrors.jam = "Wajib diisi.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // First, validate the form
        if (validateForm()) {
            // Combine date and time into ISO 8601 format
            const tanggal_awal_full = `${formData.tanggal}T${formData.jam}:00`;

            // Parse the date for additional details
            const parsedDate = new Date(tanggal_awal_full);
            const minggu = Math.ceil(parsedDate.getDate() / 7); // Week of the month
            const bulan = parsedDate.getMonth() + 1; // Month (1-12)
            const tahun = parsedDate.getFullYear(); // Year

            const monthNames = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ];

            const bulanNama = monthNames[parseInt(bulan) - 1];

            // Create the payload from the form data
            const formDataToSubmit = {
                minggu: `Minggu ${minggu}`,
                bulan: bulanNama,
                tahun: tahun,
                tanggal_awal: `${tanggal_awal_full}.000Z`,
                jam_awal: `${formData.jam}:00`,
                status_kerja: "In Progress",
                nama_pelapor_telepon: `${formData.nama} - ${formData.telepon}`,
                divisi: formData.divisi || null,
                lokasi: formData.lokasi || null,
                kategori_pekerjaan: formData.kategori,
                detail_pekerjaan: formData.detail,
                pic: `{${formData.pic.join(',')}}`,
                solusi_keterangan: null,
                tanggal_selesai: null,
                jam_selesai: null
            };

            console.log(formDataToSubmit);

            try {
                const response = await fetch('http://localhost:5433/data/input', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataToSubmit),
                });

                const result = await response.json();

                if (response.ok) {
                    console.log("Form submitted successfully!");
                    addToast('success', 'Form submitted successfully!');
                    setTimeout(() => window.location.href = "/list", 1000);

                } else {
                    console.log(`Error: ${result.message}`);
                    addToast('error', 'Failed to submit the form. Please try again.');
                }
            } catch (error) {
                console.log("Failed to submit the form. Please try again.");
                addToast('error', 'Internal server error.');
            }
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
            {/* Kategori Pekerjaan */}
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="kategori"
                >
                    Kategori Pekerjaan
                </label>
                <select
                    className="block w-full bg-white border text-sm text-gray-700 py-3 px-4 rounded"
                    id="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                >
                    <option value="">Pilih Kategori</option>
                    <option>WiFi</option>
                    <option>LAN</option>
                    <option>Whitelist</option>
                    <option>User Access</option>
                    <option>WAN</option>
                    <option>Monitoring</option>
                    <option>Pendampingan</option>
                    <option>Pembuatan Laporan/Prosedur/SOP</option>
                    <option>Konfigurasi</option>
                    <option>Rapat</option>
                </select>
                {errors.kategori && (
                    <p className="text-red-500 text-xs italic">{errors.kategori}</p>
                )}
            </div>

            {/* Nama dan Telepon */}
            <div className="flex -mx-3 mb-6">
                <div className="w-1/2 px-3">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="nama"
                    >
                        Nama Pelapor
                    </label>
                    <input
                        className="block w-full bg-white text-gray-700 border py-3 px-4 rounded"
                        id="nama"
                        type="text"
                        placeholder="Nama Lengkap"
                        value={formData.nama}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-1/2 px-3">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="telepon"
                    >
                        Nomor Telepon
                    </label>
                    <input
                        className="block w-full bg-white text-gray-700 border py-3 px-4 rounded"
                        id="telepon"
                        type="tel"
                        placeholder="08123456789"
                        value={formData.telepon}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {errors.contact && (
                <p className="text-red-500 text-xs italic -mt-6 pb-6">{errors.contact}</p>
            )}
            {errors.number && (
                <p className="text-red-500 text-xs italic -mt-6 pb-6">{errors.number}</p>
            )}

            {/* Divisi dan Lokasi */}
            <div className="flex -mx-3 mb-6">
                <div className="w-1/2 px-3">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="divisi"
                    >
                        Divisi
                    </label>
                    <select
                        className="block w-full bg-white text-gray-700 border py-3 px-4 rounded"
                        id="divisi"
                        value={formData.divisi}
                        onChange={handleChange}
                    >
                        <option value="">Pilih Divisi</option>
                        <option value="AKP">AKP</option>
                        <option value="AKT">AKT</option>
                        <option value="AIN">AIN</option>
                        <option value="ANG">ANG</option>
                        <option value="ANT">ANT</option>
                        <option value="APR">APR</option>
                        <option value="ATD">ATD</option>
                        <option value="BKI">BKI</option>
                        <option value="CES">CES</option>
                        <option value="DKI">DKI</option>
                        <option value="HBK">HBK</option>
                        <option value="HLB">HLB</option>
                        <option value="HKK">HKK</option>
                        <option value="HSC">HSC</option>
                        <option value="HSSE">HSSE</option>
                        <option value="HST">HST</option>
                        <option value="HTD">HTD</option>
                        <option value="KOM">KOM</option>
                        <option value="KEU">KEU</option>
                        <option value="KSM">KSM</option>
                        <option value="LDS">LDS</option>
                        <option value="LPT">LPT</option>
                        <option value="MDG">MDG</option>
                        <option value="MEP">MEP</option>
                        <option value="MEB">MEB</option>
                        <option value="MES">MES</option>
                        <option value="MKJ">MKJ</option>
                        <option value="MKS">MKS</option>
                        <option value="MPB">MPB</option>
                        <option value="MPT">MPT</option>
                        <option value="MRF">MRF</option>
                        <option value="MRE">MRE</option>
                        <option value="MRP">MRP</option>
                        <option value="MRS">MRS</option>
                        <option value="MUM">MUM</option>
                        <option value="MVA">MVA</option>
                        <option value="NPS">NPS</option>
                        <option value="ODM">ODM</option>
                        <option value="ODJ">ODJ</option>
                        <option value="ODS">ODS</option>
                        <option value="OKI">OKI</option>
                        <option value="OSL">OSL</option>
                        <option value="PBH">PBH</option>
                        <option value="PFM">PFM</option>
                        <option value="PKK">PKK</option>
                        <option value="PKP">PKP</option>
                        <option value="PMO">PMO</option>
                        <option value="PPN">PPN</option>
                        <option value="PPR">PPR</option>
                        <option value="RKJ">RKJ</option>
                        <option value="RKO">RKO</option>
                        <option value="RSL">RSL</option>
                        <option value="RSK">RSK</option>
                        <option value="RSD">RSD</option>
                        <option value="RST">RST</option>
                        <option value="SAK">SAK</option>
                        <option value="SDTI">SDTI</option>
                        <option value="SEKPER">SEKPER</option>
                        <option value="SHB">SHB</option>
                        <option value="SPI">SPI</option>
                        <option value="STI">STI</option>
                        <option value="TCO">TCO</option>
                        <option value="TEK">TEK</option>
                        <option value="TKS">TKS</option>
                        <option value="TSJ">TSJ</option>
                        <option value="ZHP">ZHP</option>
                    </select>
                </div>
                <div className="w-1/2 px-3">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="lokasi"
                    >
                        Lokasi
                    </label>
                    <input
                        className="block w-full bg-white text-gray-700 border py-3 px-4 rounded"
                        id="lokasi"
                        type="text"
                        placeholder="Lokasi Pekerjaan"
                        value={formData.lokasi}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {errors.assignment && (
                <p className="text-red-500 text-xs italic -mt-6 pb-6">{errors.assignment}</p>
            )}

            {/* Detail Pekerjaan */}
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="detail"
                >
                    Detail Pekerjaan
                </label>
                <input
                    className="block w-full bg-white text-gray-700 border py-3 px-4 rounded"
                    id="detail"
                    type="text"
                    placeholder="Detail Pekerjaan"
                    value={formData.detail}
                    onChange={handleChange}
                />
                {errors.kategori && (
                    <p className="text-red-500 text-xs italic">{errors.detail}</p>
                )}
            </div>

            {/* Tanggal dan Jam */}
            <div className="flex -mx-3 mb-6">
                <div className="w-1/2 px-3">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="lokasi"
                    >
                        Waktu Pelaporan
                    </label>
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="tanggal"
                    >
                        Tanggal
                    </label>
                    <input
                        className="block w-full bg-white text-gray-700 border py-3 px-4 rounded"
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={handleChange}
                    />
                    {errors.tanggal && (
                        <p className="text-red-500 text-xs italic">{errors.tanggal}</p>
                    )}
                </div>
                <div className="w-1/2 px-3">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="lokasi"
                    >
                        <br />
                    </label>
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="jam"
                    >
                        Jam
                    </label>
                    <input
                        className="block w-full bg-white text-gray-700 border py-3 px-4 rounded"
                        id="jam"
                        type="time"
                        value={formData.jam}
                        onChange={handleChange}
                    />
                    {errors.jam && (
                        <p className="text-red-500 text-xs italic">{errors.jam}</p>
                    )}
                </div>
            </div>

            {/* PIC */}
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="pic"
                >
                    PIC
                </label>
                <select
                    id="pic"
                    multiple
                    value={formData.pic}
                    onChange={handleChange}
                    data-hs-select='{
          "placeholder": "Pilih PIC",
          "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
          "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-gray-700 text-start text-sm text-smfocus:outline-none focus:ring-2 focus:ring-blue-500",
          "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
          "optionClasses": "py-2 px-4 w-full text-sm text-black cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
          "optionTemplate": "<div class=\"flex items-center\"><div><div class=\"hs-selected:font-semibold text-sm text-gray-800 \" data-title></div></div><div class=\"ms-auto\"><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-4 text-blue-600\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z\"/></svg></span></div></div>",
          "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
        }'
                    className="hs-select-hidden text-gray-700"
                >
                    <option value="Febri">Febri</option>
                    <option value="Fano">Fano</option>
                    <option value="Tyo">Tyo</option>
                    <option value="Hakim">Hakim</option>
                    <option value="Fandi">Fandi</option>
                    <option value="EOS">EOS</option>
                </select>
                {errors.pic && (
                    <p className="text-red-500 text-xs italic">{errors.pic}</p>
                )}
            </div>


            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    className="mr-2 px-4 py-2 bg-white text-red-700 rounded outline-none"
                    onClick={handleBack}
                >
                    Cancel
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                >
                    Submit
                </button>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </form>
    );
};

export default Form;
