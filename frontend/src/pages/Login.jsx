import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaCode,
} from "react-icons/fa";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  async function submitHandler(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-5">

      {/* Background Blur */}

      <div className="absolute w-[450px] h-[450px] rounded-full bg-indigo-600/20 blur-[130px] top-[-120px] left-[-120px]" />

      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[150px] bottom-[-180px] right-[-150px]" />

      {/* Card */}

      <div className="glass w-full max-w-md rounded-3xl p-10 fade-up">

        {/* Logo */}

        <div className="flex justify-center mb-8">

          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">

            <FaCode className="text-white text-3xl" />

          </div>

        </div>

        <h1 className="text-3xl font-bold text-center">
          CodeMentor AI
        </h1>

        <p className="text-center text-slate-400 mt-2 mb-8 text-sm">
          Sign in to continue your coding journey.
        </p>

        <form
          onSubmit={submitHandler}
          className="space-y-5"
        >

          {/* Email */}

          <div className="relative">

            <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              className="input pl-14"
              placeholder="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={changeHandler}
            />

          </div>

          {/* Password */}

          <div className="relative">

            <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              className="input pl-14"
              placeholder="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={changeHandler}
            />

          </div>

          {/* Button */}

          <button
            disabled={loading}
            className="primary-btn w-full flex items-center justify-center gap-3 mt-2"
          >
            {loading ? (
              "Signing In..."
            ) : (
              <>
                Login
                <FaArrowRight />
              </>
            )}
          </button>

        </form>

        <div className="mt-8 text-center text-sm text-slate-400">

          Don't have an account?

          <Link
            to="/signup"
            className="text-indigo-400 font-semibold ml-2 hover:text-indigo-300"
          >
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}