import { FaCode, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">

      {/* Logo */}

      <div className="p-8 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="bg-blue-600 h-12 w-12 rounded-xl flex items-center justify-center text-xl">

            <FaCode />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              CodeMentor AI
            </h1>

            <p className="text-slate-400 text-sm">
              Generate • Learn • Revise
            </p>

          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 p-6">

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition mb-4"
        >
          <FaCode />

          <span className="font-medium">
            New Coding Session
          </span>
        </button>

        <button
          onClick={() => navigate("/history")}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
        >
          <FaHistory />

          <span className="font-medium">
            Learning History
          </span>
        </button>

      </div>

      {/* Bottom */}

      <div className="border-t border-slate-800 p-6">

        <div className="bg-slate-800 rounded-xl p-4 mb-5">

          <h3 className="font-semibold">
            CodeMentor AI
          </h3>

          <p className="text-sm text-slate-400 mt-2">
            Solve coding problems, learn algorithms and generate interview-ready revision notes.
          </p>

        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 py-3 rounded-xl transition"
        >
          <FaSignOutAlt />

          Logout
        </button>

      </div>

    </aside>
  );
}