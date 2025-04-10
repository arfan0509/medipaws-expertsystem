import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { FiMenu, FiHome, FiDatabase, FiFileText, FiActivity, FiBookOpen, FiClock, FiLogOut, FiChevronRight, FiChevronDown, } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
const AdminSidebar = ({ children }) => {
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
    const linkClasses = (path) => {
        const base = "block p-2 flex items-center rounded-md transition-colors w-full";
        const isActive = location.pathname === path;
        return isActive
            ? `${base} bg-white text-[#4F81C7] font-semibold`
            : `${base} hover:bg-[#3A6BA8]`;
    };
    return (_jsxs("div", { className: "flex min-h-screen", children: [_jsxs(_Fragment, { children: [isSidebarOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden", onClick: () => setIsSidebarOpen(false) })), _jsxs("div", { className: `fixed inset-y-0 left-0 w-64 bg-[#4F81C7] text-white p-4 transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:static md:translate-x-0 h-screen`, children: [_jsxs("div", { className: "flex items-center gap-2 p-2 mb-4 border-b border-white", children: [_jsx("img", { src: "/assets/logo-admin.svg", alt: "Logo", className: "h-10 w-auto" }), _jsx("span", { className: "text-lg font-semibold uppercase tracking-wide", children: "Admin Menu" })] }), _jsxs("ul", { className: "space-y-1", children: [_jsx("li", { children: _jsxs(Link, { to: "/admin-dashboard", className: linkClasses("/admin-dashboard"), onClick: () => setIsSidebarOpen(false), children: [_jsx(FiHome, { className: "mr-2" }), " Dashboard"] }) }), _jsxs("li", { className: "p-2 hover:bg-[#3A6BA8] flex justify-between items-center rounded-md cursor-pointer", onClick: toggleMaster, children: [_jsxs("span", { className: "flex items-center", children: [_jsx(FiDatabase, { className: "mr-2" }), " Master Data"] }), isMasterOpen ? _jsx(FiChevronDown, {}) : _jsx(FiChevronRight, {})] }), _jsx("div", { className: `overflow-hidden transition-all duration-500 ease-in-out ml-2 ${isMasterOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`, children: _jsxs("ul", { className: "pl-4 space-y-1", children: [_jsx("li", { children: _jsxs(Link, { to: "/data-penyakit-dan-solusi", className: linkClasses("/data-penyakit-dan-solusi"), onClick: () => setIsSidebarOpen(false), children: [_jsx(FiFileText, { className: "mr-2" }), " Penyakit & Solusi"] }) }), _jsx("li", { children: _jsxs(Link, { to: "/data-gejala", className: linkClasses("/data-gejala"), onClick: () => setIsSidebarOpen(false), children: [_jsx(FiActivity, { className: "mr-2" }), " Data Gejala"] }) })] }) }), _jsx("li", { children: _jsxs(Link, { to: "/data-relasi-gejala", className: `p-2 flex items-center rounded-md transition-colors w-full ${location.pathname === "/data-relasi-gejala"
                                                ? "bg-white text-[#4F81C7] font-semibold hover:bg-white"
                                                : "hover:bg-[#3A6BA8]"}`, onClick: () => setIsSidebarOpen(false), children: [_jsx(FiBookOpen, { className: "mr-2" }), " Rule Dempster Shafer"] }) }), _jsx("li", { children: _jsxs(Link, { to: "/riwayatdiagnosis-admin", className: `p-2 flex items-center rounded-md transition-colors w-full ${location.pathname === "/riwayatdiagnosis-admin"
                                                ? "bg-white text-[#4F81C7] font-semibold hover:bg-white"
                                                : "hover:bg-[#3A6BA8]"}`, onClick: () => setIsSidebarOpen(false), children: [_jsx(FiClock, { className: "mr-2" }), " Riwayat Diagnosis"] }) }), _jsxs("li", { className: "p-2 hover:bg-[#3A6BA8] flex items-center rounded-md cursor-pointer", onClick: handleLogout, children: [_jsx(FiLogOut, { className: "mr-2" }), " Logout"] })] })] })] }), _jsxs("div", { className: "flex-1 min-w-0 h-screen overflow-y-auto", children: [_jsxs("div", { className: "md:hidden bg-[#4F81C7] text-white p-4 flex items-center gap-2 sticky top-0 z-50", children: [_jsx("button", { onClick: () => setIsSidebarOpen(!isSidebarOpen), className: "focus:outline-none", children: _jsx(FiMenu, { size: 24 }) }), _jsx("img", { src: "/assets/logo-admin.svg", alt: "Logo", className: "h-8 w-auto" }), _jsx("span", { className: "text-lg font-semibold", children: "Admin Menu" })] }), _jsx("div", { className: "p-4", children: children })] })] }));
};
export default AdminSidebar;
