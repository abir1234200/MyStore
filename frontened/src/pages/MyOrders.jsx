
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import API_URL from "../config/api.js";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                const response = await axios.get(
                    `${API_URL}/order/my-orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success) {
                    setOrders(response.data.orders);
                }

            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Unable to load orders"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center">
                Loading your orders...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">

            <h1 className="text-3xl font-bold mb-8">
                My Orders
            </h1>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-lg">
                    You haven't placed any orders yet.
                </p>
            ) : (
                <div className="space-y-6">

                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border rounded-lg p-5 shadow-sm"
                        >

                            <div className="flex flex-col md:flex-row md:justify-between gap-3 border-b pb-4">

                                <div>
                                    <p className="font-semibold">
                                        Order ID: {order._id}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Date:{" "}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        Order Status:{" "}
                                        <span className="font-semibold">
                                            {order.orderStatus}
                                        </span>
                                    </p>

                                    <p>
                                        Payment:{" "}
                                        <span className="font-semibold">
                                            {order.paymentStatus}
                                        </span>
                                    </p>
                                </div>

                            </div>

                            <div className="py-4 space-y-4">

                                {order.items.map((item, index) => {
                                    const product = item.product;

                                    return (
                                        <div
                                            key={product?._id || index}
                                            className="flex items-center justify-between gap-4"
                                        >

                                            <div>
                                                <p className="font-semibold">
                                                    {product?.name ||
                                                        "Product unavailable"}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Quantity: {item.quantity}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Price: ₹{item.price}
                                                </p>
                                            </div>

                                            <p className="font-semibold">
                                                ₹{item.price * item.quantity}
                                            </p>

                                        </div>
                                    );
                                })}

                            </div>

                            <div className="border-t pt-4 flex flex-col sm:flex-row sm:justify-between gap-2">

                                <div>
                                    <p>
                                        Payment Method:{" "}
                                        {order.paymentMethod}
                                    </p>

                                    <p>
                                        Shipping Address:{" "}
                                        {order.shippingAddress}
                                    </p>
                                </div>

                                <p className="text-xl font-bold">
                                    Total: ₹{order.totalAmount}
                                </p>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default MyOrders;
