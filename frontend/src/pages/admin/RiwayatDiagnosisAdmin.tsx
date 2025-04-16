/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  FaUserAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaCat,
  FaBirthdayCake,
  FaMars,
  FaVenus,
  FaGenderless,
  FaPalette,
  FaExclamationTriangle,
  FaNotesMedical,
  FaClock,
  FaChartBar,
  FaHeartbeat,
  FaMedkit,
} from "react-icons/fa";
import {
  FiChevronUp,
  FiChevronDown,
  FiSearch,
  FiEdit,
  FiPrinter,
  FiTrash,
} from "react-icons/fi";
import ModalKonfirmasi from "../../components/ModalKonfirmasi";
import SuccessModal from "../../components/SuccessModal";
import PrintSingleDiagnosis from "../../components/user/PrintSingleDiagnosis";
import ModalEditDiagnosis from "../../components/admin/ModalEditDiagnosis";

const RiwayatDiagnosisAdmin: React.FC = () => {
  const [diagnosisList, setDiagnosisList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataPerPage] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [diagnosisToDelete, setDiagnosisToDelete] = useState<any>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("baru");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [patients, setPatients] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>(null);

  // Format number untuk menampilkan belief dengan benar
  const formatNumber = (num: number) => parseFloat(num.toFixed(2)).toString();

  useEffect(() => {
    fetchDiagnosis();
  }, [sortOrder, selectedPatient]);

  const fetchDiagnosis = async () => {
    try {
      const response = await axiosInstance.get("/diagnosis");

      // Parse hasil_diagnosis kalau dia masih berupa string
      const parsedData = response.data.map((item: any) => {
        let hasil = item.hasil_diagnosis;
        if (typeof hasil === "string") {
          try {
            hasil = JSON.parse(hasil);
          } catch (e) {
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
      setFilteredData(
        selectedPatient
          ? sortedData.filter((item) => item.pasien.nama === selectedPatient)
          : sortedData
      );
      setPatients([...new Set(response.data.map((d) => d.pasien.nama))]);
    } catch (error) {
      console.error("Error fetching diagnosis data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortDiagnoses = (data: any[], order: string) => {
    return data.sort((a, b) =>
      order === "baru"
        ? new Date(b.tanggal_diagnosis).getTime() -
          new Date(a.tanggal_diagnosis).getTime()
        : new Date(a.tanggal_diagnosis).getTime() -
          new Date(b.tanggal_diagnosis).getTime()
    );
  };

  const handleSearch = () => {
    const filtered = diagnosisList.filter(
      (item) =>
        item.nama_kucing?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hasil_diagnosis?.penyakit
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.pasien?.nama?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/diagnosis/${id}`);
      setIsDeleteModalOpen(false);
      setSuccessMessage("Diagnosis berhasil dihapus!");
      setIsSuccessModalOpen(true);
      fetchDiagnosis(); // Refresh data
    } catch (error) {
      console.error("Error deleting diagnosis:", error);
    }
  };

  const handlePrint = (diagnosis: any) => {
    PrintSingleDiagnosis(diagnosis);
  };

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  const toggleDropdown = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // ✅ Handler untuk membuka modal edit
  const openEditModal = (diagnosis: any) => {
    setSelectedDiagnosis(diagnosis);
    setIsEditModalOpen(true);
  };

  // ✅ Handler untuk menyimpan hasil edit
  const handleEditSave = async (updatedData: any) => {
    try {
      await axiosInstance.put(
        `/diagnosis/${updatedData.id_diagnosis}`,
        updatedData
      );
      setSuccessMessage("Diagnosis berhasil diperbarui!");
      setIsSuccessModalOpen(true);
      setIsEditModalOpen(false);
      fetchDiagnosis(); // Refresh data
    } catch (error) {
      console.error("Error updating diagnosis:", error);
    }
  };

  return (
    <div className="flex-1 p-2 min-h-screen">
      <h1 className="text-3xl font-bold text-[#4F81C7] mb-6">
        Riwayat Diagnosis
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Cari nama pasien/kucing/penyakit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-lg w-full focus:ring-[#4F81C7]"
          />
          <button
            onClick={handleSearch}
            className="bg-[#4F81C7] text-white px-4 py-2 rounded-lg hover:bg-[#3e6b99]"
          >
            <FiSearch size={18} />
          </button>
        </div>

        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
        >
          <option value="">Semua Pasien</option>
          {patients.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
        >
          <option value="baru">Urutkan: Terbaru</option>
          <option value="lama">Urutkan: Terlama</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin border-4 border-[#4F81C7] border-t-transparent rounded-full w-16 h-16"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentData.map((diagnosis, index) => (
            <div
              key={diagnosis.id_diagnosis}
              className="bg-[#F8FAFC] p-6 rounded-lg shadow-md hover:shadow-xl border-l-4 border-[#4F81C7] transition duration-300"
            >
              <div className="space-y-3">
                {/* Informasi Pasien */}
                <p className="flex items-center gap-2">
                  <FaUserAlt className="text-[#4F81C7]" />
                  <strong>Nama Pemilik:</strong> {diagnosis.pasien.nama}
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#4F81C7]" />
                  <strong>Alamat:</strong> {diagnosis.pasien.alamat}
                </p>
                <p className="flex items-center gap-2">
                  <FaPhone className="text-[#4F81C7]" />
                  <strong>No. Telepon:</strong> {diagnosis.pasien.no_telp}
                </p>

                <div className="border-t border-gray-300 my-2"></div>

                {/* Informasi Kucing */}
                <p className="flex items-center gap-2">
                  <FaCat className="text-[#4F81C7]" />
                  <strong>Nama Kucing:</strong> {diagnosis.nama_kucing}
                </p>
                <p className="flex items-center gap-2">
                  <FaBirthdayCake className="text-[#4F81C7]" />
                  <strong>Usia:</strong> {diagnosis.usia}
                </p>
                <p className="flex items-center gap-2">
                  {diagnosis.jenis_kelamin.toLowerCase() === "jantan" ? (
                    <FaMars className="text-[#4F81C7]" />
                  ) : diagnosis.jenis_kelamin.toLowerCase() === "betina" ? (
                    <FaVenus className="text-[#4F81C7]" />
                  ) : (
                    <FaGenderless className="text-[#4F81C7]" />
                  )}
                  <strong>Jenis Kelamin:</strong> {diagnosis.jenis_kelamin}
                </p>
                <p className="flex items-center gap-2">
                  <FaPalette className="text-[#4F81C7]" />
                  <strong>Warna Bulu:</strong> {diagnosis.warna_bulu}
                </p>

                <div className="border-t border-gray-300 my-2"></div>

                {/* Hasil Diagnosis - Versi yang sudah diperbaiki untuk mobile */}
                <div className="bg-[#4F81C7] text-white p-4 rounded-lg shadow-sm">
                  {/* Judul Penyakit */}
                  <p className="flex items-center gap-2 font-semibold text-lg mb-2">
                    <FaExclamationTriangle />
                    {diagnosis.hasil_diagnosis?.penyakit ?? "Tidak tersedia"}
                  </p>

                  {/* Tampilkan nilai belief di bawah judul, bukan di samping */}
                  {diagnosis.hasil_diagnosis?.belief && (
                    <div className="mt-1 mb-2">
                      <div className="flex items-center gap-1 text-sm">
                        <FaChartBar className="text-white" />
                        <span>
                          Kemungkinan:{" "}
                          {formatNumber(diagnosis.hasil_diagnosis.belief)}%
                        </span>
                      </div>

                      {/* Progress bar untuk belief */}
                      <div className="mt-1">
                        <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                          <div
                            className="bg-green-400 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${diagnosis.hasil_diagnosis.belief}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Deskripsi penyakit */}
                  {diagnosis.hasil_diagnosis?.deskripsi && (
                    <p className="text-sm mt-2 text-white text-opacity-90">
                      <strong>Deskripsi:</strong>{" "}
                      {diagnosis.hasil_diagnosis.deskripsi}
                    </p>
                  )}
                </div>

                <p className="flex items-center gap-2">
                  <FaNotesMedical className="text-[#4F81C7]" />
                  <strong>Gejala:</strong>{" "}
                </p>

                {/* Gejala terdeteksi dengan tampilan yang lebih baik */}
                <div className="flex flex-wrap gap-2 pl-6">
                  {Array.isArray(
                    diagnosis.hasil_diagnosis?.gejala_terdeteksi
                  ) &&
                    diagnosis.hasil_diagnosis.gejala_terdeteksi.map(
                      (gejala: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-[#E3F2FD] text-[#4F81C7] text-sm py-1 px-3 rounded-full"
                        >
                          {gejala}
                        </span>
                      )
                    )}
                </div>

                {/* Solusi */}
                <p className="flex items-center gap-2">
                  <FaMedkit className="text-[#4F81C7]" />
                  <strong>Solusi:</strong>{" "}
                </p>

                {/* Solusi text dengan format yang sama seperti gejala */}
                <div className="flex flex-wrap gap-2 pl-6">
                  {diagnosis.hasil_diagnosis?.solusi && (
                    <span className="text-gray-700">
                      {diagnosis.hasil_diagnosis.solusi}
                    </span>
                  )}
                </div>

                {Array.isArray(
                  diagnosis.hasil_diagnosis?.kemungkinan_penyakit_lain
                ) &&
                  diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.length >
                    0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="w-full flex justify-between items-center text-[#4F81C7] font-semibold bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                      >
                        Kemungkinan Penyakit Lain (
                        {
                          diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain
                            .length
                        }
                        )
                        {expandedIndex === index ? (
                          <FiChevronUp size={20} />
                        ) : (
                          <FiChevronDown size={20} />
                        )}
                      </button>

                      {expandedIndex === index && (
                        <div className="mt-2 space-y-2">
                          {diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.map(
                            (penyakit: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white p-3 rounded-lg border border-[#4F81C7] shadow-md"
                              >
                                <p className="font-semibold text-[#4F81C7] flex items-center gap-1 mb-1">
                                  <FaHeartbeat />
                                  {penyakit.penyakit}
                                </p>

                                {/* Belief di bawah nama penyakit, bukan di samping */}
                                {penyakit.belief && (
                                  <div className="mb-2">
                                    <div className="flex items-center gap-1 text-xs text-yellow-800 mt-1">
                                      <FaChartBar className="text-yellow-800" />
                                      Kemungkinan:{" "}
                                      {formatNumber(penyakit.belief)}%
                                    </div>
                                    <div className="w-full bg-yellow-100 rounded-full h-1.5 mt-1">
                                      <div
                                        className="bg-yellow-500 h-1.5 rounded-full"
                                        style={{
                                          width: `${penyakit.belief}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {penyakit.deskripsi && (
                                  <p className="text-sm mt-1">
                                    <strong>Deskripsi:</strong>{" "}
                                    {penyakit.deskripsi}
                                  </p>
                                )}

                                <p className="text-sm mt-2">
                                  <strong>Gejala Terdeteksi:</strong>
                                </p>

                                <div className="flex flex-wrap gap-1 mt-1">
                                  {penyakit.gejalaCocok &&
                                  Array.isArray(penyakit.gejalaCocok) ? (
                                    penyakit.gejalaCocok.map(
                                      (gejala: string, gejalaIdx: number) => (
                                        <span
                                          key={gejalaIdx}
                                          className="bg-blue-50 text-blue-700 text-xs py-1 px-2 rounded-full"
                                        >
                                          {gejala}
                                        </span>
                                      )
                                    )
                                  ) : (
                                    <span className="text-gray-500 text-sm">
                                      Tidak tersedia
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm mt-2">
                                  <strong>Solusi:</strong> {penyakit.solusi}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <FaClock className="text-[#4F81C7]" />
                  {new Date(diagnosis.tanggal_diagnosis).toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>

              <div className="flex justify-center md:justify-start mt-4 gap-2">
                <button
                  onClick={() => handlePrint(diagnosis)}
                  className="border border-blue-500 text-blue-500 px-3 py-2 rounded-md w-24 flex items-center justify-center gap-1 hover:bg-[#4F81C7] hover:text-white transition"
                >
                  <FiPrinter /> Cetak
                </button>
                <button
                  onClick={() => openEditModal(diagnosis)}
                  className="bg-[#4F81C7] text-white px-3 py-2 rounded-lg hover:bg-[#3e6b99] flex items-center gap-1"
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => {
                    setDiagnosisToDelete(diagnosis);
                    setIsDeleteModalOpen(true);
                  }}
                  className="bg-red-800 text-white px-3 py-2 rounded-lg hover:bg-red-900 flex items-center gap-1"
                >
                  <FiTrash /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-[#4F81C7] text-white rounded-lg disabled:bg-gray-300"
        >
          ⮜
        </button>
        <span className="text-gray-700 py-1 px-3 bg-gray-100 rounded-lg">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-[#4F81C7] text-white rounded-lg disabled:bg-gray-300"
        >
          ⮞
        </button>
      </div>
      <ModalEditDiagnosis
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        data={selectedDiagnosis}
      />
      {diagnosisToDelete && (
        <ModalKonfirmasi
          isOpen={isDeleteModalOpen}
          message={`Apakah Anda yakin ingin menghapus diagnosis kucing bernama ${diagnosisToDelete.nama_kucing}?`}
          onConfirm={() => handleDelete(diagnosisToDelete.id_diagnosis)}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        message={successMessage}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default RiwayatDiagnosisAdmin;
