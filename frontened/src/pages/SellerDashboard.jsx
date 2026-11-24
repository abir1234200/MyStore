
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API_URL from "../config/api.js";

const SellerDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [isSeller, setIsSeller] = useState(
    localStorage.getItem("isSeller") === "true"
  );

  const [showForm, setShowForm] = useState(false);
  const [upiId, setUpiId] = useState("");

  const becomeSeller = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const cleanUpiId = upiId.trim();

      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(cleanUpiId)) {
        toast.error("Please enter a valid UPI ID");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${API_URL}/user/become-seller`,
        { upiId: cleanUpiId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setUpiId("");
        setShowForm(false);

        if (response.data.isSeller === true) {
          localStorage.setItem("isSeller", "true");
          setIsSeller(true);
        }
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to submit UPI ID"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      <h1 className="mb-2 text-3xl font-bold">
        Sell Your Products
      </h1>

      <p className="mb-8 text-gray-600">
        Manage your products and grow your business with MyStore.
      </p>

      {!isSeller ? (

        <div className="max-w-lg rounded-xl bg-white p-6 shadow-md">

          <div className="mb-4 text-4xl">
            🏪
          </div>

          <h2 className="mb-2 text-xl font-semibold">
            Become a Seller
          </h2>

          <p className="mb-5 text-gray-600">
            Submit your UPI ID to register as a seller on MyStore.
          </p>

          {!showForm ? (

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Become a Seller
            </button>

          ) : (

            <form
              onSubmit={becomeSeller}
              className="space-y-4"
            >

              <h3 className="text-lg font-semibold">
                Seller Payment Details
              </h3>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  UPI ID
                </label>

                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@okaxis"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <p className="text-sm text-gray-500">
                Enter your UPI ID carefully. Never share your
                UPI PIN or OTP with anyone.
              </p>

              <div className="flex flex-wrap gap-3">

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit UPI ID"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setUpiId("");
                  }}
                  disabled={loading}
                  className="rounded-lg bg-gray-200 px-5 py-3 hover:bg-gray-300"
                >
                  Cancel
                </button>

              </div>

            </form>

          )}

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="rounded-xl bg-white p-6 shadow-md">

            <div className="mb-4 text-4xl">
              📦
            </div>

            <h2 className="mb-2 text-xl font-semibold">
              Add Product
            </h2>

            <p className="mb-5 text-gray-600">
              Add a new product with images, price,
              description and stock.
            </p>

            <Link
              to="/seller/add-product"
              className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Add Product
            </Link>

          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">

            <div className="mb-4 text-4xl">
              🛍️
            </div>

            <h2 className="mb-2 text-xl font-semibold">
              My Products
            </h2>

            <p className="mb-5 text-gray-600">
              View and manage all the products you
              have added.
            </p>

            <Link
              to="/seller/my-products"
              className="inline-block rounded-lg bg-gray-800 px-5 py-2 text-white hover:bg-gray-900"
            >
              View My Products
            </Link>

          </div>

        </div>

      )}

    </div>
  );
};

export default SellerDashboard;
