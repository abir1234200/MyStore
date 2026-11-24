
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  setWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";

import { addToCart } from "../features/cart/cartSlice";

import { FaShoppingCart, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

import API_URL from "../config/api.js";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems
  );

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${API_URL}/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const products = response.data.wishlist.products.map(
            (product) => ({
              id: product._id,
              title: product.name,
              price: product.price,
              image: getImageUrl(product.images?.[0]),
              rating: product.rating || 0,
            })
          );

          dispatch(setWishlist(products));
        }

      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load wishlist"
        );
      }
    };

    fetchWishlist();
  }, [dispatch, navigate]);

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.delete(
        `${API_URL}/wishlist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(removeFromWishlist(id));
        toast.success("Product removed from wishlist");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove product"
      );
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/cart/add`,
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(addToCart(product));
        toast.success("Product added to cart");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart"
      );
    }
  };

  return (
    <div className="p-4 md:p-8">

      <h1 className="text-3xl font-bold mb-8">
        My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <p className="text-gray-500 text-lg">
          Your Wishlist is Empty
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow"
            >

              <img
                src={getImageUrl(item.image)}
                alt={item.title}
                className="w-full h-48 object-cover rounded"
              />

              <h2 className="text-xl font-semibold mt-3">
                {item.title}
              </h2>

              <p className="text-gray-600 mt-2">
                ₹{item.price}
              </p>

              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  aria-label="Remove from wishlist"
                >
                  <FaTrash />
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Wishlist;
