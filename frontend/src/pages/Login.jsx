import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-900">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-[400px]"
      >

        <h1 className="text-3xl text-white text-center mb-6">
          Login
        </h1>

        <input
          className="w-full p-3 mb-4 rounded"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="w-full p-3 mb-4 rounded"
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button className="w-full bg-green-600 text-white p-3 rounded">
          Login
        </button>

        <p className="text-white mt-5">

          Don't have an account?

          <Link className="text-green-400 ml-2" to="/signup">
            Signup
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;