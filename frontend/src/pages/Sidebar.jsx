import {
  FaCode,
  FaHistory,
  FaSignOutAlt,
  FaRobot,
  FaRegComments,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function logout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  const menu = [
    {
      name: "New Session",
      icon: <FaCode />,
      path: "/dashboard",
    },
    {
      name: "History",
      icon: <FaHistory />,
      path: "/history",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col items-center w-20 bg-[#080d19] border-r border-white/5 py-6 justify-between h-screen sticky top-0">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg cursor-pointer" onClick={() => navigate("/dashboard")}>
          <FaRobot className="text-xl text-white" />
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-4 w-full px-3">
        {menu.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={item.name}
              className={`w-full aspect-square flex items-center justify-center rounded-2xl transition-all duration-300 ${
                active
                  ? "bg-[#6366f1]/20 text-[#8b5cf6]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
            </button>
          );
        })}
      </div>

      {/* User and Logout */}
      <div className="flex flex-col items-center gap-6 w-full px-3">
        {/* User Profile Circle with Active Green Indicator */}
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white border border-white/10">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#080d19] rounded-full"></span>
          
          {/* Tooltip */}
          <div className="absolute left-14 bottom-1 bg-slate-900 border border-white/10 text-xs text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
            {user?.name || "User"}
          </div>
        </div>

        <button
          onClick={logout}
          title="Logout"
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition duration-200"
        >
          <FaSignOutAlt className="text-lg" />
        </button>
      </div>
    </aside>
  );
}