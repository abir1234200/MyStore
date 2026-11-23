
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaBolt
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist } from "../features/wishlist/wishlistSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const productId = product._id || product.id;


  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8004/cart/add",
        {
          productId,
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
          ...product,
          id: productId
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
          productId,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1
        }
      }
    });
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
        "http://localhost:8004/wishlist/add",
        {
          productId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        dispatch(addToWishlist(product));
        toast.success("Product added to wishlist!");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to add product to wishlist"
      );
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">


      <img
        src={product.image}
        alt={product.title}
        onClick={() =>
          navigate(`/products/${productId}`)
        }
        className="w-full h-48 object-cover rounded cursor-pointer"
      />


      <h2
        onClick={() =>
          navigate(`/products/${productId}`)
        }
        className="text-xl font-semibold mt-3 cursor-pointer hover:text-blue-600"
      >
        {product.title}
      </h2>


      <p className="text-gray-600 mt-2">
        ₹{product.price}
      </p>


      <div className="flex flex-wrap gap-2 mt-4">


        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="flex-1 bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 disabled:bg-gray-400"
        >
          <FaShoppingCart />
          Add to Cart
        </button>


        <button
          onClick={handleBuyNow}
          disabled={product.stock <= 0}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded flex items-center justify-center gap-2 disabled:bg-gray-400"
        >
          <FaBolt />
          Buy Now
        </button>


        <button
          onClick={handleAddToWishlist}
          className="bg-pink-600 text-white px-4 py-2 rounded"
          aria-label="Add to wishlist"
        >
          <FaHeart />
        </button>

      </div>

    </div>
  );
};

export default ProductCard;
