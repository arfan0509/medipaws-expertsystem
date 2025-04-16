import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FaUserAlt, FaMapMarkerAlt, FaPhone, FaCat, FaBirthdayCake, FaMars, FaVenus, FaGenderless, FaPalette, FaExclamationTriangle, FaNotesMedical, FaClock, FaChartBar, FaHeartbeat, FaMedkit, } from "react-icons/fa";
import { FiChevronUp, FiChevronDown, FiSearch, FiEdit, FiPrinter, FiTrash, } from "react-icons/fi";
import ModalKonfirmasi from "../../components/ModalKonfirmasi";
import SuccessModal from "../../components/SuccessModal";
import PrintSingleDiagnosis from "../../components/user/PrintSingleDiagnosis";
import ModalEditDiagnosis from "../../components/admin/ModalEditDiagnosis";
const RiwayatDiagnosisAdmin = () => {
    const [diagnosisList, setDiagnosisList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [diagnosisToDelete, setDiagnosisToDelete] = useState(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [sortOrder, setSortOrder] = useState("baru");
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [patients, setPatients] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    // Format number untuk menampilkan belief dengan benar
    const formatNumber = (num) => parseFloat(num.toFixed(2)).toString();
    useEffect(() => {
        fetchDiagnosis();
    }, [sortOrder, selectedPatient]);
    const fetchDiagnosis = async () => {
        try {
            const response = await axiosInstance.get("/diagnosis");
            // Parse hasil_diagnosis kalau dia masih berupa string
            const parsedData = response.data.map((item) => {
                let hasil = item.hasil_diagnosis;
                if (typeof hasil === "string") {
                    try {
                        hasil = JSON.parse(hasil);
                    }
                    catch (e) {
                        console.warn("Gagal parsing hasil_diagnosis:", hasil);
                        hasil = null;
                    }
                }
                return {
                    ...item,
                    hasil_diagnosis: hasil,
                };
            });
            const sortedData = sortDiagnoses(parsedData, sortOrder);
            setDiagnosisList(sortedData);
            setFilteredData(selectedPatient
                ? sortedData.filter((item) => item.pasien.nama === selectedPatient)
                : sortedData);
            setPatients([...new Set(response.data.map((d) => d.pasien.nama))]);
        }
        catch (error) {
            console.error("Error fetching diagnosis data:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const sortDiagnoses = (data, order) => {
        return data.sort((a, b) => order === "baru"
            ? new Date(b.tanggal_diagnosis).getTime() -
                new Date(a.tanggal_diagnosis).getTime()
            : new Date(a.tanggal_diagnosis).getTime() -
                new Date(b.tanggal_diagnosis).getTime());
    };
    const handleSearch = () => {
        const filtered = diagnosisList.filter((item) => item.nama_kucing?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.hasil_diagnosis?.penyakit
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            item.pasien?.nama?.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredData(filtered);
        setCurrentPage(1);
    };
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/diagnosis/${id}`);
            setIsDeleteModalOpen(false);
            setSuccessMessage("Diagnosis berhasil dihapus!");
            setIsSuccessModalOpen(true);
            fetchDiagnosis(); // Refresh data
        }
        catch (error) {
            console.error("Error deleting diagnosis:", error);
        }
    };
    const handlePrint = (diagnosis) => {
        PrintSingleDiagnosis(diagnosis);
    };
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
    const totalPages = Math.ceil(filteredData.length / dataPerPage);
    const toggleDropdown = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };
    // ✅ Handler untuk membuka modal edit
    const openEditModal = (diagnosis) => {
        setSelectedDiagnosis(diagnosis);
        setIsEditModalOpen(true);
    };
    // ✅ Handler untuk menyimpan hasil edit
    const handleEditSave = async (updatedData) => {
        try {
            await axiosInstance.put(`/diagnosis/${updatedData.id_diagnosis}`, updatedData);
            setSuccessMessage("Diagnosis berhasil diperbarui!");
            setIsSuccessModalOpen(true);
            setIsEditModalOpen(false);
            fetchDiagnosis(); // Refresh data
        }
        catch (error) {
            console.error("Error updating diagnosis:", error);
        }
    };
    return (_jsxs("div", { className: "flex-1 p-2 min-h-screen", children: [_jsx("h1", { className: "text-3xl font-bold text-[#4F81C7] mb-6", children: "Riwayat Diagnosis" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Cari nama pasien/kucing/penyakit...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "p-2 border rounded-lg w-full focus:ring-[#4F81C7]" }), _jsx("button", { onClick: handleSearch, className: "bg-[#4F81C7] text-white px-4 py-2 rounded-lg hover:bg-[#3e6b99]", children: _jsx(FiSearch, { size: 18 }) })] }), _jsxs("select", { value: selectedPatient, onChange: (e) => setSelectedPatient(e.target.value), className: "p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", children: [_jsx("option", { value: "", children: "Semua Pasien" }), patients.map((name) => (_jsx("option", { value: name, children: name }, name)))] }), _jsxs("select", { value: sortOrder, onChange: (e) => setSortOrder(e.target.value), className: "p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", children: [_jsx("option", { value: "baru", children: "Urutkan: Terbaru" }), _jsx("option", { value: "lama", children: "Urutkan: Terlama" })] })] }), loading ? (_jsx("div", { className: "flex justify-center items-center py-20", children: _jsx("div", { className: "animate-spin border-4 border-[#4F81C7] border-t-transparent rounded-full w-16 h-16" }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6", children: currentData.map((diagnosis, index) => (_jsxs("div", { className: "bg-[#F8FAFC] p-6 rounded-lg shadow-md hover:shadow-xl border-l-4 border-[#4F81C7] transition duration-300", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("p", { className: "flex items-center gap-2", children: [_jsx(FaUserAlt, { className: "text-[#4F81C7]" }), _jsx("strong", { children: "Nama Pemilik:" }), " ", diagnosis.pasien.nama] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(FaMapMarkerAlt, { className: "text-[#4F81C7]" }), _jsx("strong", { children: "Alamat:" }), " ", diagnosis.pasien.alamat] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(FaPhone, { className: "text-[#4F81C7]" }), _jsx("strong", { children: "No. Telepon:" }), " ", diagnosis.pasien.no_telp] }), _jsx("div", { className: "border-t border-gray-300 my-2" }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(FaCat, { className: "text-[#4F81C7]" }), _jsx("strong", { children: "Nama Kucing:" }), " ", diagnosis.nama_kucing] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(FaBirthdayCake, { className: "text-[#4F81C7]" }), _jsx("strong", { children: "Usia:" }), " ", diagnosis.usia] }), _jsxs("p", { className: "flex items-center gap-2", children: [diagnosis.jenis_kelamin.toLowerCase() === "jantan" ? (_jsx(FaMars, { className: "text-[#4F81C7]" })) : diagnosis.jenis_kelamin.toLowerCase() === "betina" ? (_jsx(FaVenus, { className: "text-[#4F81C7]" })) : (_jsx(FaGenderless, { className: "text-[#4F81C7]" })), _jsx("strong", { children: "Jenis Kelamin:" }), " ", diagnosis.jenis_kelamin] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(FaPalette, { className: "text-[#4F81C7]" }), _jsx("strong", { children: "Warna Bulu:" }), " ", diagnosis.warna_bulu] }), _jsx("div", { className: "border-t border-gray-300 my-2" }), _jsxs("div", { className: "bg-[#4F81C7] text-white p-4 rounded-lg shadow-sm", children: [_jsxs("p", { className: "flex items-center gap-2 font-semibold text-lg mb-2", children: [_jsx(FaExclamationTriangle, {}), diagnosis.hasil_diagnosis?.penyakit ?? "Tidak tersedia"] }), diagnosis.hasil_diagnosis?.belief && (_jsxs("div", { className: "mt-1 mb-2", children: [_jsxs("div", { className: "flex items-center gap-1 text-sm", children: [_jsx(FaChartBar, { className: "text-white" }), _jsxs("span", { children: ["Kemungkinan:", " ", formatNumber(diagnosis.hasil_diagnosis.belief), "%"] })] }), _jsx("div", { className: "mt-1", children: _jsx("div", { className: "w-full bg-white bg-opacity-30 rounded-full h-2", children: _jsx("div", { className: "bg-green-400 h-2 rounded-full transition-all duration-500", style: {
                                                                width: `${diagnosis.hasil_diagnosis.belief}%`,
                                                            } }) }) })] })), diagnosis.hasil_diagnosis?.deskripsi && (_jsxs("p", { className: "text-sm mt-2 text-white text-opacity-90", children: [_jsx("strong", { children: "Deskripsi:" }), " ", diagnosis.hasil_diagnosis.deskripsi] }))] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(FaNotesMedical, { className: "text-[#4F81C7]" }), _jsx("strong", { children: "Gejala:" }), " "] }), _jsx("div", { className: "flex flex-wrap gap-2 pl-6", children: Array.isArray(diagnosis.hasil_diagnosis?.gejala_terdeteksi) &&
                                        diagnosis.hasil_diagnosis.gejala_terdeteksi.map((gejala, idx) => (_jsx("span", { className: "bg-[#E3F2FD] text-[#4F81C7] text-sm py-1 px-3 rounded-full", children: gejala }, idx))) }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(FaMedkit, { className: "text-[#4F81C7]" }), _jsx("strong", { children: "Solusi:" }), " "] }), _jsx("div", { className: "flex flex-wrap gap-2 pl-6", children: diagnosis.hasil_diagnosis?.solusi && (_jsx("span", { className: "text-gray-700", children: diagnosis.hasil_diagnosis.solusi })) }), Array.isArray(diagnosis.hasil_diagnosis?.kemungkinan_penyakit_lain) &&
                                    diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.length >
                                        0 && (_jsxs("div", { className: "mt-4", children: [_jsxs("button", { onClick: () => toggleDropdown(index), className: "w-full flex justify-between items-center text-[#4F81C7] font-semibold bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 transition", children: ["Kemungkinan Penyakit Lain (", diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain
                                                    .length, ")", expandedIndex === index ? (_jsx(FiChevronUp, { size: 20 })) : (_jsx(FiChevronDown, { size: 20 }))] }), expandedIndex === index && (_jsx("div", { className: "mt-2 space-y-2", children: diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.map((penyakit, idx) => (_jsxs("div", { className: "bg-white p-3 rounded-lg border border-[#4F81C7] shadow-md", children: [_jsxs("p", { className: "font-semibold text-[#4F81C7] flex items-center gap-1 mb-1", children: [_jsx(FaHeartbeat, {}), penyakit.penyakit] }), penyakit.belief && (_jsxs("div", { className: "mb-2", children: [_jsxs("div", { className: "flex items-center gap-1 text-xs text-yellow-800 mt-1", children: [_jsx(FaChartBar, { className: "text-yellow-800" }), "Kemungkinan:", " ", formatNumber(penyakit.belief), "%"] }), _jsx("div", { className: "w-full bg-yellow-100 rounded-full h-1.5 mt-1", children: _jsx("div", { className: "bg-yellow-500 h-1.5 rounded-full", style: {
                                                                        width: `${penyakit.belief}%`,
                                                                    } }) })] })), penyakit.deskripsi && (_jsxs("p", { className: "text-sm mt-1", children: [_jsx("strong", { children: "Deskripsi:" }), " ", penyakit.deskripsi] })), _jsx("p", { className: "text-sm mt-2", children: _jsx("strong", { children: "Gejala Terdeteksi:" }) }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: penyakit.gejalaCocok &&
                                                            Array.isArray(penyakit.gejalaCocok) ? (penyakit.gejalaCocok.map((gejala, gejalaIdx) => (_jsx("span", { className: "bg-blue-50 text-blue-700 text-xs py-1 px-2 rounded-full", children: gejala }, gejalaIdx)))) : (_jsx("span", { className: "text-gray-500 text-sm", children: "Tidak tersedia" })) }), _jsxs("p", { className: "text-sm mt-2", children: [_jsx("strong", { children: "Solusi:" }), " ", penyakit.solusi] })] }, idx))) }))] })), _jsxs("p", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx(FaClock, { className: "text-[#4F81C7]" }), new Date(diagnosis.tanggal_diagnosis).toLocaleString("id-ID")] })] }), _jsxs("div", { className: "flex justify-center md:justify-start mt-4 gap-2", children: [_jsxs("button", { onClick: () => handlePrint(diagnosis), className: "border border-blue-500 text-blue-500 px-3 py-2 rounded-md w-24 flex items-center justify-center gap-1 hover:bg-[#4F81C7] hover:text-white transition", children: [_jsx(FiPrinter, {}), " Cetak"] }), _jsxs("button", { onClick: () => openEditModal(diagnosis), className: "bg-[#4F81C7] text-white px-3 py-2 rounded-lg hover:bg-[#3e6b99] flex items-center gap-1", children: [_jsx(FiEdit, {}), " Edit"] }), _jsxs("button", { onClick: () => {
                                        setDiagnosisToDelete(diagnosis);
                                        setIsDeleteModalOpen(true);
                                    }, className: "bg-red-800 text-white px-3 py-2 rounded-lg hover:bg-red-900 flex items-center gap-1", children: [_jsx(FiTrash, {}), " Hapus"] })] })] }, diagnosis.id_diagnosis))) })), _jsxs("div", { className: "flex justify-center mt-6 gap-2", children: [_jsx("button", { onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: "px-3 py-1 bg-[#4F81C7] text-white rounded-lg disabled:bg-gray-300", children: "\u2B9C" }), _jsxs("span", { className: "text-gray-700 py-1 px-3 bg-gray-100 rounded-lg", children: ["Halaman ", currentPage, " dari ", totalPages] }), _jsx("button", { onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: "px-3 py-1 bg-[#4F81C7] text-white rounded-lg disabled:bg-gray-300", children: "\u2B9E" })] }), _jsx(ModalEditDiagnosis, { isOpen: isEditModalOpen, onClose: () => setIsEditModalOpen(false), onSave: handleEditSave, data: selectedDiagnosis }), diagnosisToDelete && (_jsx(ModalKonfirmasi, { isOpen: isDeleteModalOpen, message: `Apakah Anda yakin ingin menghapus diagnosis kucing bernama ${diagnosisToDelete.nama_kucing}?`, onConfirm: () => handleDelete(diagnosisToDelete.id_diagnosis), onCancel: () => setIsDeleteModalOpen(false) })), _jsx(SuccessModal, { isOpen: isSuccessModalOpen, message: successMessage, onClose: () => setIsSuccessModalOpen(false) })] }));
};
export default RiwayatDiagnosisAdmin;
