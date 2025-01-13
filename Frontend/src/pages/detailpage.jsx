import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate hook
import axios from "axios";

const DetailPage = () => {
  const { id } = useParams(); // Get the ID parameter from URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login check
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check if the user is logged in (example using sessionStorage)
    const loginStatus = sessionStorage.getItem("isLoggedIn"); // Replace with actual auth logic
    setIsLoggedIn(loginStatus === "true");

    // Fetch data from API using jobId from URL
    axios
      .get(`http://localhost:5433/data/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job details:", error);
        setLoading(false);
      });
  }, [id]); // Re-fetch data whenever ID changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Ensure that data.pic is an array before using .map()
  const picArray = Array.isArray(data.pic) ? data.pic : [data.pic];

  const handleEdit = () => {
    navigate(`/edit/${id}`); // Navigate to edit page
  };

  const handleDelete = () => {
    // Confirm delete action
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (confirmDelete) {
      // Send delete request to the API
      axios
        .delete(`http://localhost:5433/data/${id}`)
        .then((response) => {
          alert("Job deleted successfully");
          navigate("/list"); // Navigate to the list page after deletion
        })
        .catch((error) => {
          console.error("Error deleting job:", error);
          alert("Failed to delete the job");
        });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Detail Pekerjaan</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Informasi Pekerjaan</h2>
        <p className="text-gray-700">
          <strong>Minggu: </strong>{data.minggu}
        </p>
        <p className="text-gray-700">
          <strong>Bulan: </strong>{data.bulan}
        </p>
        <p className="text-gray-700">
          <strong>Tahun: </strong>{data.tahun}
        </p>
        <p className="text-gray-700">
          <strong>Tanggal Awal: </strong>{new Date(data.tanggal_awal).toLocaleString()}
        </p>
        <p className="text-gray-700">
          <strong>Jam Awal: </strong>{data.jam_awal}
        </p>
        <p className="text-gray-700">
          <strong>Status Kerja: </strong>{data.status_kerja}
        </p>
        <p className="text-gray-700">
          <strong>Nama Pelapor: </strong>{data.nama_pelapor_telepon}
        </p>
        <p className="text-gray-700">
          <strong>Divisi: </strong>{data.divisi || "-"}
        </p>
        <p className="text-gray-700">
          <strong>Lokasi: </strong>{data.lokasi}
        </p>
        <p className="text-gray-700">
          <strong>Kategori Pekerjaan: </strong>{data.kategori_pekerjaan}
        </p>
        <p className="text-gray-700">
          <strong>Detail Pekerjaan: </strong>{data.detail_pekerjaan}
        </p>
        <p className="text-gray-700">
          <strong>Solusi: </strong>{data.solusi_keterangan || "-"}
        </p>
        <p className="text-gray-700">
          <strong>Tanggal Selesai: </strong>{new Date(data.tanggal_selesai).toLocaleString()}
        </p>
        <p className="text-gray-700">
          <strong>Jam Selesai: </strong>{data.jam_selesai}
        </p>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">PIC</h3>
          <ul className="list-disc pl-5">
            {/* Render PIC if it is an array */}
            {picArray.map((pic, index) => (
              <li key={index} className="text-gray-700">{pic}</li>
            ))}
          </ul>
        </div>

        {/* Conditional rendering of Edit and Delete buttons */}
        {isLoggedIn && (
          <div className="mt-4">
            <button
              onClick={handleEdit}
              className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
