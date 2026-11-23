
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8004/user/login",
        formData
      );

      if (response.data.success) {
        const user = response.data.data;

        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("name", user.userName);
        localStorage.setItem("loginStatus", "true");
        localStorage.setItem("isSeller", String(user.isSeller));

        toast.success("Logged in successfully!");

        setFormData({
          email: "",
          password: ""
        });


        navigate("/");

      } else {
        toast.error(response.data.message || "Login failed");
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Login to your My Store account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;
