import {
  FaCode,
  FaHistory,
  FaSignOutAlt,
  FaRobot,
} from "react-icons/fa";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

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
    <aside className="hidden md:flex w-72 p-5">

      <div className="glass rounded-3xl flex flex-col w-full">

        {/* Logo */}

        <div className="p-8 border-b border-white/10">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">

              <FaRobot className="text-2xl text-white" />

            </div>

            <div>

              <h2 className="text-xl font-bold">
                CodeMentor
              </h2>

              <p className="text-slate-400 text-sm">
                AI Coding Assistant
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <div className="flex-1 px-5 py-8 space-y-4">

          {menu.map((item) => {

            const active =
              location.pathname === item.path;

            return (

              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300

                ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
                    : "hover:bg-white/5"
                }`}
              >

                <div
                  className={`text-xl ${
                    active
                      ? "text-white"
                      : "text-slate-400"
                  }`}
                >
                  {item.icon}
                </div>

                <span
                  className={`font-medium ${
                    active
                      ? "text-white"
                      : "text-slate-300"
                  }`}
                >
                  {item.name}
                </span>

              </button>

            );

          })}

        </div>

        {/* User */}

        <div className="border-t border-white/10 p-6">

          <div className="flex items-center gap-4 mb-5">

            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-lg">

              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}

            </div>

            <div>

              <h4 className="font-semibold">

                {user?.name || "User"}

              </h4>

              <p className="text-xs text-slate-400 truncate">

                {user?.email}

              </p>

            </div>

          </div>

          <button
            onClick={logout}
            className="secondary-btn w-full flex justify-center items-center gap-3"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </div>

    </aside>
  );
}