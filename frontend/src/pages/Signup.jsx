import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      await api.post("/auth/signup", form);

      alert("Signup Successful");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-900">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-[400px]"
      >

        <h1 className="text-3xl text-white text-center mb-6">
          CodeMentor AI
        </h1>

        <input
          className="w-full p-3 mb-4 rounded"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

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

        <button className="w-full bg-blue-600 text-white p-3 rounded">
          Signup
        </button>

        <p className="text-white mt-5">

          Already have an account?

          <Link className="text-blue-400 ml-2" to="/login">
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Signup;