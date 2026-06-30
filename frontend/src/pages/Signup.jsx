import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaChevronRight } from "react-icons/fa";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all form details.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/signup", form);
      alert("Account created successfully. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
      
      {/* Left Pane - Brand Showcase */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/20 flex-col justify-between p-12 relative overflow-hidden border-r border-slate-200">
        <div className="absolute -top-12 -left-12 w-80 h-80 bg-blue-300/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-indigo-300/20 blur-3xl rounded-full pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white h-9 w-9 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="font-extrabold text-sm font-mono">&lt;/&gt;</span>
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-sm">CodeMentor AI</span>
        </div>

        {/* Content Showcase */}
        <div className="relative my-auto space-y-8 max-w-sm">
          <div className="space-y-3">
            <span className="inline-flex bg-indigo-100/70 border border-indigo-200/40 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
              Get Started
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Interactive Coding Mentor
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              Create your profile to start solving programming problems, analyzing complexities, and compiling notes.
            </p>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-blue-600 mt-1 shrink-0 text-xs" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Smarter Solutions</h4>
                <p className="text-[11px] text-slate-500">Baseline and performance-optimized outputs side-by-side.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-blue-600 mt-1 shrink-0 text-xs" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Concept Dry-Runs</h4>
                <p className="text-[11px] text-slate-500">Engage with a dedicated mentor to break down complex logic lines.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-blue-600 mt-1 shrink-0 text-xs" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Complete Export</h4>
                <p className="text-[11px] text-slate-500">Convert summaries and Q&A history logs into study PDFs.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="relative text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          © CodeMentor AI Platform
        </div>
      </div>

      {/* Right Pane - Form Workspace */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-8 sm:p-16 bg-white relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Create Account
            </h1>
            <p className="text-slate-500 text-xs">
              Join the platform to start generating and storing study references.
            </p>
          </div>

          {/* Form container with generous spacing */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FaUser className="text-sm" />
                </div>
                <input
                  className="w-full bg-slate-50/50 hover:bg-slate-100/30 border border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition duration-150 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="John Doe"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FaEnvelope className="text-sm" />
                </div>
                <input
                  className="w-full bg-slate-50/50 hover:bg-slate-100/30 border border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition duration-150 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="name@domain.com"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FaLock className="text-sm" />
                </div>
                <input
                  className="w-full bg-slate-50/50 hover:bg-slate-100/30 border border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition duration-150 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl text-sm shadow-md shadow-indigo-500/10 transition-all duration-150 disabled:opacity-50 mt-4 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>{loading ? "Registering..." : "Register"}</span>
              {!loading && <FaChevronRight className="text-xs mt-0.5" />}
            </button>
          </form>

          {/* Redirect Option */}
          <p className="text-xs text-slate-500 text-center pt-4">
            Already registered?{" "}
            <Link className="text-blue-600 font-bold hover:underline" to="/login">
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}