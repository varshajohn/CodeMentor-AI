import { FaCode, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-100 h-10 w-10 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
            <FaCode className="text-base" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
              CodeMentor AI
            </h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Student Hub
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => navigate("/dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-150 border ${
            isActive("/dashboard")
              ? "bg-blue-50 text-blue-600 border-blue-100"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
          }`}
        >
          <FaCode className="text-sm" />
          <span>New Session</span>
        </button>

        <button
          onClick={() => navigate("/history")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-150 border ${
            isActive("/history")
              ? "bg-blue-50 text-blue-600 border-blue-100"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
          }`}
        >
          <FaHistory className="text-sm" />
          <span>Learning History</span>
        </button>
      </nav>

      {/* Sidebar Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 shadow-xs">
          <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Workspace Live</h4>
          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
            Write, optimize, and maintain complete reference study records.
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 py-2.5 rounded-xl text-xs font-semibold transition"
        >
          <FaSignOutAlt className="text-xs" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}