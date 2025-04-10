import React, { useState } from "react";
import {
  FiMenu,
  FiHome,
  FiDatabase,
  FiFileText,
  FiActivity,
  FiBookOpen,
  FiClock,
  FiLogOut,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface AdminSidebarProps {
  children: React.ReactNode;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMaster = () => setIsMasterOpen(!isMasterOpen);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  const linkClasses = (path: string) => {
    const base =
      "block p-2 flex items-center rounded-md transition-colors w-full";
    const isActive = location.pathname === path;
    return isActive
      ? `${base} bg-white text-[#4F81C7] font-semibold`
      : `${base} hover:bg-[#3A6BA8]`;
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-[#4F81C7] text-white p-4 transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:static md:translate-x-0 h-screen`}
        >
          {/* Header Sidebar */}
          <div className="flex items-center gap-2 p-2 mb-4 border-b border-white">
            <img
              src="/assets/logo-admin.svg"
              alt="Logo"
              className="h-10 w-auto"
            />
            <span className="text-lg font-semibold uppercase tracking-wide">
              Admin Menu
            </span>
          </div>

          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <Link
                to="/admin-dashboard"
                className={linkClasses("/admin-dashboard")}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiHome className="mr-2" /> Dashboard
              </Link>
            </li>

            {/* Master Data Toggle */}
            <li
              className="p-2 hover:bg-[#3A6BA8] flex justify-between items-center rounded-md cursor-pointer"
              onClick={toggleMaster}
            >
              <span className="flex items-center">
                <FiDatabase className="mr-2" /> Master Data
              </span>
              {isMasterOpen ? <FiChevronDown /> : <FiChevronRight />}
            </li>

            {/* Submenu Master Data */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ml-2 ${
                isMasterOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="pl-4 space-y-1">
                <li>
                  <Link
                    to="/data-penyakit-dan-solusi"
                    className={linkClasses("/data-penyakit-dan-solusi")}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FiFileText className="mr-2" /> Penyakit &amp; Solusi
                  </Link>
                </li>
                <li>
                  <Link
                    to="/data-gejala"
                    className={linkClasses("/data-gejala")}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FiActivity className="mr-2" /> Data Gejala
                  </Link>
                </li>
              </ul>
            </div>

            {/* Rule Dempster Shafer */}
            <li>
              <Link
                to="/data-relasi-gejala"
                className={`p-2 flex items-center rounded-md transition-colors w-full ${
                  location.pathname === "/data-relasi-gejala"
                    ? "bg-white text-[#4F81C7] font-semibold hover:bg-white"
                    : "hover:bg-[#3A6BA8]"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiBookOpen className="mr-2" /> Rule Dempster Shafer
              </Link>
            </li>

            {/* Riwayat Diagnosis */}
            <li>
              <Link
                to="/riwayatdiagnosis-admin"
                className={`p-2 flex items-center rounded-md transition-colors w-full ${
                  location.pathname === "/riwayatdiagnosis-admin"
                    ? "bg-white text-[#4F81C7] font-semibold hover:bg-white"
                    : "hover:bg-[#3A6BA8]"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiClock className="mr-2" /> Riwayat Diagnosis
              </Link>
            </li>

            {/* Logout */}
            <li
              className="p-2 hover:bg-[#3A6BA8] flex items-center rounded-md cursor-pointer"
              onClick={handleLogout}
            >
              <FiLogOut className="mr-2" /> Logout
            </li>
          </ul>
        </div>
      </>
      {/* Main Content */}
      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        {/* Navbar Mobile */}
        <div className="md:hidden bg-[#4F81C7] text-white p-4 flex items-center gap-2 sticky top-0 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="focus:outline-none"
          >
            <FiMenu size={24} />
          </button>
          <img src="/assets/logo-admin.svg" alt="Logo" className="h-8 w-auto" />
          <span className="text-lg font-semibold">Admin Menu</span>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminSidebar;
