
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);


  const passwordChecks = [
    {
      label: "At least 8 characters",
      valid: formData.password.length >= 8
    },
    {
      label: "Maximum 64 characters",
      valid: formData.password.length <= 64
    },
    {
      label: "One uppercase letter (A-Z)",
      valid: /[A-Z]/.test(formData.password)
    },
    {
      label: "One lowercase letter (a-z)",
      valid: /[a-z]/.test(formData.password)
    },
    {
      label: "One number (0-9)",
      valid: /[0-9]/.test(formData.password)
    },
    {
      label: "One special character (@, #, $)",
      valid: /[^A-Za-z0-9]/.test(formData.password)
    }
  ];

  const isPasswordValid = passwordChecks.every(
    (check) => check.valid
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!isPasswordValid) {
      toast.error("Please enter a strong password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8004/user/register",
        formData
      );

      if (response.data.success) {
        toast.success(
          "Registration successful! Please verify your email."
        );

        setFormData({
          userName: "",
          email: "",
          password: ""
        });

        navigate("/login");
      } else {
        toast.error(response.data.message || "Registration failed");
      }

    } catch (error) {
      console.log(error);

      const errors = error.response?.data?.errors;

      if (errors?.length) {
        errors.forEach((message) => toast.error(message));
      } else {
        toast.error(
          error.response?.data?.message || "Registration failed"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Join My Store today!
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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
              placeholder="Create a password"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />


            <div className="mt-3 space-y-2">

              <p className="text-sm font-medium text-gray-600">
                Password must contain:
              </p>

              {passwordChecks.map((check, index) => (
                <p
                  key={index}
                  className={`text-sm flex items-center gap-2 ${check.valid ? "text-green-600" : "text-red-500"
                    }`}
                >
                  <span>
                    {check.valid ? "✓" : "✗"}
                  </span>

                  {check.label}
                </p>
              ))}

            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Signup;
