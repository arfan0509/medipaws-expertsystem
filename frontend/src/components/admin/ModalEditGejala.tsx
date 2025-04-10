import React, { useState, useEffect } from "react";

const ModalEditGejala = ({ isOpen, onClose, onSave, data, errorMessage }) => {
  const [formData, setFormData] = useState({
    id_gejala: "",
    kode_gejala: "",
    nama_gejala: "",
  });

  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        id_gejala: data.id_gejala,
        kode_gejala: data.kode_gejala,
        nama_gejala: data.nama_gejala,
      });
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.nama_gejala.trim()) {
      return alert("Nama gejala harus diisi!");
    }
    if (!formData.kode_gejala.trim()) {
      return alert("Kode gejala harus diisi!");
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Edit Gejala
        </h2>

        {/* Kode Gejala (Editable) */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">
            Kode Gejala
          </label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
            type="text"
            placeholder="Masukkan kode gejala"
            value={formData.kode_gejala}
            onChange={(e) =>
              setFormData({ ...formData, kode_gejala: e.target.value })
            }
          />
        </div>

        {/* Nama Gejala */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">
            Nama Gejala
          </label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
            type="text"
            placeholder="Masukkan nama gejala"
            value={formData.nama_gejala}
            onChange={(e) =>
              setFormData({ ...formData, nama_gejala: e.target.value })
            }
          />
        </div>

        {/* Alert Message - Tampilkan pesan error dari backend */}
        {errorMessage && (
          <p className="text-red-600 text-sm mb-3">{errorMessage}</p>
        )}

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8] transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditGejala;
