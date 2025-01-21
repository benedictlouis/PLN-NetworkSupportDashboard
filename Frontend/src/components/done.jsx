import React, { useState } from "react";
import axios from "axios";

const Done = ({ existingData, id, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        solusi: "",
        tanggal_selesai: "",
        jam_selesai: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.solusi || !formData.tanggal_selesai || !formData.jam_selesai) {
            setError("All fields are required.");
            return;
        }

        const updatedData = {
            solusi_keterangan: formData.solusi,
            tanggal_selesai: `${formData.tanggal_selesai}T${formData.jam_selesai}:00.000Z`,
            jam_selesai: `${formData.jam_selesai}:00`,
            status_kerja: "Resolved",
        };

        axios
            .put(`http://localhost:5433/data/edit/${id}`, updatedData)
            .then((response) => {
                onSuccess(response.data);
                onClose();
            })
            .catch((error) => {
                console.error("Error submitting form:", error);
                setError("Failed to mark as selesai. Please try again.");
            });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-lg text-black font-bold mb-4">Tandai sebagai selesai</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="solusi" className="block text-sm font-medium text-gray-700">
                            Solusi
                        </label>
                        <textarea
                            id="solusi"
                            name="solusi"
                            value={formData.solusi}
                            onChange={handleChange}
                            className="mt-1 block w-full bg-white text-gray-700 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="tanggal_selesai" className="block text-sm font-medium text-gray-700">
                            Tanggal Selesai
                        </label>
                        <input
                            type="date"
                            id="tanggal_selesai"
                            name="tanggal_selesai"
                            value={formData.tanggal_selesai}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-white text-gray-700 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="jam_selesai" className="block text-sm font-medium text-gray-700">
                            Jam Selesai
                        </label>
                        <input
                            type="time"
                            id="jam_selesai"
                            name="jam_selesai"
                            value={formData.jam_selesai}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-white text-gray-700 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 bg-white text-red-700 rounded outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#1C94AC] text-white rounded hover:bg-opacity-90"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Done;
