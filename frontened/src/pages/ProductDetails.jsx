
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  FaShoppingCart,
  FaHeart,
  FaBolt
} from "react-icons/fa";
import toast from "react-hot-toast";

import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist } from "../features/wishlist/wishlistSlice";

import API_URL from "../config/api.js";

const ProductDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const getProduct = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/product/${id}`
      );

      if (response.data.success) {
        setProduct(response.data.product);
      }

    } catch (error) {
      console.log("Product details error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load product"
      );

      setProduct(null);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
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
          productId: product._id,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        dispatch(addToCart({
          id: product._id,
          title: product.name,
          price: product.price,
          image: getImageUrl(product.images?.[0]),
          quantity: 1
        }));

        toast.success("Product added to cart!");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to add product to cart"
      );
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/wishlist/add`,
        {
          productId: product._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        dispatch(addToWishlist({
          id: product._id,
          title: product.name,
          price: product.price,
          image: getImageUrl(product.images?.[0]),
          rating: product.rating || 0
        }));

        toast.success("Product added to wishlist!");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to add product to wishlist"
      );
    }
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    navigate("/checkout", {
      state: {
        buyNow: {
          productId: product._id,
          title: product.name,
          price: product.price,
          image: getImageUrl(product.images?.[0]),
          quantity: 1
        }
      }
    });
  };

  if (loading) {
    return (
      <h1 className="p-8 text-center">
        Loading product...
      </h1>
    );
  }

  if (!product) {
    return (
      <h1 className="p-8 text-center">
        Product not found
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-5 md:p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div>
            <img
              src={
                getImageUrl(product.images?.[0]) ||
                "https://placehold.co/600x400?text=No+Image"
              }
              alt={product.name}
              className="w-full max-h-[450px] object-contain rounded-lg"
            />
          </div>

          <div>

            <h1 className="text-3xl font-bold">
              {product.name}
            </h1>

            <p className="text-2xl font-semibold text-blue-600 mt-4">
              ₹{product.price}
            </p>

            <p className="text-gray-600 mt-5">
              {product.description}
            </p>

            <p className="mt-5">
              <span className="font-semibold">
                Available Stock:
              </span>{" "}
              {product.stock}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="bg-blue-600 text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400"
              >
                <FaShoppingCart />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="bg-orange-500 text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-orange-600 disabled:bg-gray-400"
              >
                <FaBolt />
                Buy Now
              </button>

              <button
                onClick={handleAddToWishlist}
                className="bg-pink-600 text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-pink-700"
              >
                <FaHeart />
                Add to Wishlist
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
