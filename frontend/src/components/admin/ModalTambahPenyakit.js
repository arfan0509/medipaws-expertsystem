import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const ModalTambahPenyakit = ({ isOpen, onClose, onSave, }) => {
    // State untuk data form
    const [formData, setFormData] = useState({
        kode_penyakit: "",
        nama_penyakit: "",
        deskripsi: "",
        solusi: "",
    });
    // State untuk menampung pesan error di tiap field
    const [errors, setErrors] = useState({});
    // Jika modal tidak terbuka, jangan render apa-apa
    if (!isOpen)
        return null;
    // Fungsi validasi input
    const validate = () => {
        const newErrors = {};
        if (!formData.kode_penyakit.trim()) {
            newErrors.kode_penyakit = "Kode penyakit harus diisi!";
        }
        if (!formData.nama_penyakit.trim()) {
            newErrors.nama_penyakit = "Nama penyakit harus diisi!";
        }
        if (!formData.deskripsi.trim()) {
            newErrors.deskripsi = "Deskripsi penyakit harus diisi!";
        }
        if (!formData.solusi.trim()) {
            newErrors.solusi = "Solusi penyakit harus diisi!";
        }
        return newErrors;
    };
    // Event handler untuk tombol Simpan
    const handleSubmit = () => {
        // Jalankan validasi
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // Jika valid, panggil onSave
        onSave(formData);
        // Reset form & error
        setFormData({
            kode_penyakit: "",
            nama_penyakit: "",
            deskripsi: "",
            solusi: "",
        });
        setErrors({});
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4", children: _jsxs("div", { className: "bg-white p-6 rounded-lg w-full max-w-md shadow-lg", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4 text-center", children: "Tambah Penyakit" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Kode Penyakit" }), _jsx("input", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", type: "text", value: formData.kode_penyakit, onChange: (e) => setFormData({ ...formData, kode_penyakit: e.target.value }) }), errors.kode_penyakit && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.kode_penyakit }))] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Nama Penyakit" }), _jsx("input", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", type: "text", value: formData.nama_penyakit, onChange: (e) => setFormData({ ...formData, nama_penyakit: e.target.value }) }), errors.nama_penyakit && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.nama_penyakit }))] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Deskripsi Penyakit" }), _jsx("textarea", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7] resize-none", rows: 3, value: formData.deskripsi, onChange: (e) => setFormData({ ...formData, deskripsi: e.target.value }) }), errors.deskripsi && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.deskripsi }))] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Solusi Penyakit" }), _jsx("textarea", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7] resize-none", rows: 3, value: formData.solusi, onChange: (e) => setFormData({ ...formData, solusi: e.target.value }) }), errors.solusi && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.solusi }))] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition", children: "Batal" }), _jsx("button", { onClick: handleSubmit, className: "px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8] transition", children: "Simpan" })] })] }) }));
};
export default ModalTambahPenyakit;
