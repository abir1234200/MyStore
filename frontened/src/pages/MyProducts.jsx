
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  const getMyProducts = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:8004/product/my-products",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      setProducts(response.data.products || []);

    } catch (error) {
      console.log(error);
      toast.error("Failed to load your products");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyProducts();
  }, []);


  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.delete(
        `http://localhost:8004/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        setProducts((prev) =>
          prev.filter((product) => product._id !== id)
        );

        toast.success("Product deleted successfully!");
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">


        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              My Products
            </h1>

            <p className="text-gray-600 mt-2">
              Manage the products you have added.
            </p>
          </div>

          <Link
            to="/seller/add-product"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            + Add Product
          </Link>

        </div>


        {loading ? (

          <p className="text-lg text-center py-10">
            Loading your products...
          </p>

        ) : products.length === 0 ? (


          <div className="bg-white rounded-xl shadow p-10 text-center">

            <div className="text-5xl mb-4">📦</div>

            <h2 className="text-xl font-semibold mb-2">
              No Products Added Yet
            </h2>

            <p className="text-gray-500 mb-5">
              Start selling by adding your first product.
            </p>

            <Link
              to="/seller/add-product"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Add Your First Product
            </Link>

          </div>

        ) : (


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map((product) => (

              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >


                <Link to={`/seller/edit-product/${product._id}`}>
                  <img
                    src={
                      product.images?.[0]
                        ? `http://localhost:8004${product.images[0]}`
                        : "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-52 object-cover cursor-pointer hover:opacity-90 transition"
                  />
                </Link>

                <div className="p-5">

                  <h2 className="text-xl font-semibold mb-2">
                    {product.name}
                  </h2>

                  <p className="text-gray-600 mb-2">
                    Price: ₹{product.price}
                  </p>

                  <p className="text-gray-600 mb-4">
                    Stock: {product.stock}
                  </p>


                  <button
                    onClick={() =>
                      navigate(`/seller/edit-product/${product._id}`)
                    }
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-3"
                  >
                    Edit Product
                  </button>


                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete Product
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
};

export default MyProducts;
