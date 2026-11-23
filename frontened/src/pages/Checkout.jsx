
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const cartItems = useSelector(
        (state) => state.cart.cartItems
    );

    const buyNowItem = location.state?.buyNow || null;

    const checkoutItems = buyNowItem
        ? [buyNowItem]
        : cartItems;

    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("accessToken");

    const totalAmount = checkoutItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );


    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const existingScript = document.querySelector(
                'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
            );

            if (existingScript) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };


    const handleCOD = async () => {
        const orderData = buyNowItem
            ? {
                shippingAddress,
                paymentMethod: "COD",
                productId: buyNowItem.productId,
                quantity: buyNowItem.quantity
            }
            : {
                shippingAddress,
                paymentMethod: "COD"
            };

        const response = await axios.post(
            "http://localhost:8004/order/place",
            orderData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data.success) {
            toast.success("Order placed successfully!");
            navigate("/my-orders");
        }
    };


    const handleOnlinePayment = async () => {

        const scriptLoaded = await loadRazorpay();

        if (!scriptLoaded) {
            throw new Error(
                "Unable to load Razorpay. Check your internet connection."
            );
        }


        const paymentData = buyNowItem
            ? {
                shippingAddress,
                productId: buyNowItem.productId,
                quantity: buyNowItem.quantity
            }
            : {
                shippingAddress
            };


        const response = await axios.post(
            "http://localhost:8004/payment/create-order",
            paymentData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.data.success) {
            throw new Error("Unable to create payment order");
        }

        const razorpayOrder = response.data.order;

        const options = {
            key: response.data.key,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "MyStore",
            description: buyNowItem
                ? "Individual Product Purchase"
                : "Complete Cart Purchase",
            order_id: razorpayOrder.id,

            handler: async (paymentResponse) => {
                try {
                    const verifyResponse = await axios.post(
                        "http://localhost:8004/payment/verify-payment",
                        paymentResponse,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (verifyResponse.data.success) {
                        toast.success(
                            "Payment successful! Order placed."
                        );

                        navigate("/my-orders");
                    }

                } catch (error) {
                    toast.error(
                        error.response?.data?.message ||
                        "Payment verification failed. Contact support before retrying."
                    );
                } finally {
                    setLoading(false);
                }
            },

            prefill: {},

            theme: {
                color: "#2563eb",
            },

            modal: {
                ondismiss: () => {
                    setLoading(false);
                    toast.error("Payment cancelled");
                },
            },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", (response) => {
            toast.error(
                response.error?.description ||
                "Payment failed"
            );

            setLoading(false);
        });

        razorpay.open();
    };


    const handlePlaceOrder = async () => {

        if (!token) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }

        if (!shippingAddress.trim()) {
            toast.error("Please enter your shipping address");
            return;
        }

        if (checkoutItems.length === 0) {
            toast.error("Your cart is empty");
            navigate("/cart");
            return;
        }

        setLoading(true);

        try {
            if (paymentMethod === "COD") {
                await handleCOD();
                setLoading(false);
            } else {
                await handleOnlinePayment();
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Unable to process your order"
            );

            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">

            <h1 className="text-3xl font-bold mb-8">
                Checkout
            </h1>

            <p className="mb-6 text-gray-600">
                {buyNowItem
                    ? "Buying one selected product"
                    : "Checking out your complete cart"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


                <div className="border rounded-lg p-6">

                    <h2 className="text-xl font-bold mb-4">
                        Shipping Address
                    </h2>

                    <textarea
                        value={shippingAddress}
                        onChange={(e) =>
                            setShippingAddress(e.target.value)
                        }
                        placeholder="Enter your full delivery address"
                        rows="5"
                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <h2 className="text-xl font-bold mt-8 mb-4">
                        Payment Method
                    </h2>

                    <div className="space-y-4">


                        <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">

                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                            />

                            <span>Cash on Delivery</span>

                        </label>


                        <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">

                            <input
                                type="radio"
                                name="payment"
                                value="ONLINE"
                                checked={paymentMethod === "ONLINE"}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                            />

                            <span>Pay Online (Razorpay)</span>

                        </label>

                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading || checkoutItems.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-8 disabled:opacity-50"
                    >
                        {loading
                            ? "Processing..."
                            : paymentMethod === "COD"
                                ? "Place COD Order"
                                : "Pay Now"}
                    </button>

                </div>


                <div className="border rounded-lg p-6 h-fit">

                    <h2 className="text-xl font-bold mb-6">
                        Order Summary
                    </h2>

                    {checkoutItems.length === 0 ? (
                        <p className="text-gray-500">
                            Your cart is empty
                        </p>
                    ) : (
                        <>
                            {checkoutItems.map((item) => (
                                <div
                                    key={item.productId || item.id}
                                    className="flex items-center justify-between gap-4 border-b py-4"
                                >

                                    <div className="flex items-center gap-3">

                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />

                                        <div>
                                            <p className="font-semibold">
                                                {item.title}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>

                                    </div>

                                    <p className="font-semibold">
                                        ₹{item.price * item.quantity}
                                    </p>

                                </div>
                            ))}

                            <div className="flex justify-between text-xl font-bold mt-6">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Checkout;
