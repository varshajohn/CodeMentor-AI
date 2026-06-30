import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaCode,
} from "react-icons/fa";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  function changeHandler(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submitHandler(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", form);

      alert("Account created successfully.");

      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Signup Failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-5">

      {/* Background */}

      <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[140px] top-[-150px] left-[-120px]" />

      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[160px] bottom-[-180px] right-[-120px]" />

      {/* Card */}

      <div className="glass w-full max-w-md rounded-3xl p-10 fade-up">

        {/* Logo */}

        <div className="flex justify-center mb-8">

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">

            <FaCode className="text-white text-3xl" />

          </div>

        </div>

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-center text-slate-400 mt-2 mb-8 text-sm">
          Join CodeMentor AI and start solving smarter.
        </p>

        <form
          onSubmit={submitHandler}
          className="space-y-5"
        >

          {/* Name */}

          <div className="relative">

            <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              className="input pl-14"
              type="text"
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={changeHandler}
            />

          </div>

          {/* Email */}

          <div className="relative">

            <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              className="input pl-14"
              type="email"
              placeholder="Email Address"
              name="email"
              value={form.email}
              onChange={changeHandler}
            />

          </div>

          {/* Password */}

          <div className="relative">

            <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              className="input pl-14"
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={changeHandler}
            />

          </div>

          <button
            disabled={loading}
            className="primary-btn w-full flex items-center justify-center gap-3 mt-2"
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Create Account
                <FaArrowRight />
              </>
            )}
          </button>

        </form>

        <div className="mt-8 text-center text-sm text-slate-400">

          Already have an account?

          <Link
            to="/login"
            className="text-indigo-400 font-semibold ml-2 hover:text-indigo-300"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}