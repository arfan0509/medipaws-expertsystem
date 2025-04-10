import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
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
    if (!isOpen)
        return null;
    const handleSubmit = () => {
        if (!formData.nama_gejala.trim()) {
            return alert("Nama gejala harus diisi!");
        }
        if (!formData.kode_gejala.trim()) {
            return alert("Kode gejala harus diisi!");
        }
        onSave(formData);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4", children: _jsxs("div", { className: "bg-white p-6 rounded-lg w-full max-w-md shadow-lg", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4 text-center", children: "Edit Gejala" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Kode Gejala" }), _jsx("input", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", type: "text", placeholder: "Masukkan kode gejala", value: formData.kode_gejala, onChange: (e) => setFormData({ ...formData, kode_gejala: e.target.value }) })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Nama Gejala" }), _jsx("input", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", type: "text", placeholder: "Masukkan nama gejala", value: formData.nama_gejala, onChange: (e) => setFormData({ ...formData, nama_gejala: e.target.value }) })] }), errorMessage && (_jsx("p", { className: "text-red-600 text-sm mb-3", children: errorMessage })), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition", children: "Batal" }), _jsx("button", { onClick: handleSubmit, className: "px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8] transition", children: "Simpan" })] })] }) }));
};
export default ModalEditGejala;
