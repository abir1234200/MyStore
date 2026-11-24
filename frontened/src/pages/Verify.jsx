
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

import API_URL from "../config/api.js";

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/user/verify`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setSuccess(true);
          setMessage("Your email has been verified successfully!");

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }

      } catch (error) {
        console.log(error);

        setSuccess(false);
        setMessage(
          error.response?.data?.message ||
          "Email verification failed. Please try again."
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">

        <div className="text-5xl mb-4">
          {success ? "✅" : "📧"}
        </div>

        <h1 className="text-2xl font-bold mb-3">
          Email Verification
        </h1>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {success && (
          <p className="text-sm text-gray-500">
            Redirecting you to login...
          </p>
        )}

        {!success && (
          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Back to Login
          </Link>
        )}

      </div>

    </div>
  );
};

export default Verify;
