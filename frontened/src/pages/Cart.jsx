
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} from "../features/cart/cartSlice";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector(
        (state) => state.cart.cartItems
    );

    const token = localStorage.getItem("accessToken");

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );


    const updateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await axios.put(
                `http://localhost:8004/cart/update/${item.id}`,
                { quantity: newQuantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                if (newQuantity > item.quantity) {
                    dispatch(increaseQuantity(item.id));
                } else {
                    dispatch(decreaseQuantity(item.id));
                }
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to update quantity"
            );
        }
    };


    const handleRemove = async (productId) => {
        try {
            const response = await axios.delete(
                `http://localhost:8004/cart/remove/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                dispatch(removeFromCart(productId));
                toast.success("Product removed from cart");
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to remove product"
            );
        }
    };


    const handleClearCart = async () => {
        try {
            const response = await axios.delete(
                "http://localhost:8004/cart/clear",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                dispatch(clearCart());
                toast.success("Cart cleared successfully");
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to clear cart"
            );
        }
    };


    const handleBuyNow = (item) => {
        if (!token) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }

        navigate("/checkout", {
            state: {
                buyNow: {
                    productId: item.id,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity,
                },
            },
        });
    };

    return (
        <div className="p-4 md:p-8">

            <h1 className="text-3xl font-bold mb-8">
                Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-500 text-lg">
                    Your Cart is Empty
                </p>
            ) : (
                <div>

                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="border p-4 rounded-lg mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        >


                            <div className="flex items-center gap-4">

                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />

                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {item.title}
                                    </h2>

                                    <p>
                                        Price: ₹{item.price}
                                    </p>

                                    <p>
                                        Subtotal: ₹
                                        {item.price * item.quantity}
                                    </p>
                                </div>

                            </div>


                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item,
                                            item.quantity - 1
                                        )
                                    }
                                    disabled={item.quantity <= 1}
                                    className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
                                >
                                    -
                                </button>

                                <span className="font-semibold">
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item,
                                            item.quantity + 1
                                        )
                                    }
                                    className="bg-gray-200 px-3 py-1 rounded"
                                >
                                    +
                                </button>

                            </div>


                            <div className="flex flex-wrap gap-2">

                                <button
                                    onClick={() => handleBuyNow(item)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                                >
                                    Buy Now
                                </button>

                                <button
                                    onClick={() =>
                                        handleRemove(item.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>
                    ))}


                    <div className="mt-8 border-t pt-6">

                        <h2 className="text-2xl font-bold">
                            Total: ₹{totalPrice}
                        </h2>

                        <div className="flex flex-wrap gap-3 mt-4">

                            <button
                                onClick={handleClearCart}
                                className="bg-red-700 hover:bg-red-800 text-white px-5 py-3 rounded"
                            >
                                Clear Cart
                            </button>

                            <button
                                onClick={() => navigate("/checkout")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded"
                            >
                                Proceed to Checkout
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Cart;
