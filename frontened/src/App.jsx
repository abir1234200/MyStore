import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { setCart } from "./features/cart/cartSlice";
import { setWishlist } from "./features/wishlist/wishlistSlice";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyAccount from "./pages/MyAccount";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";

function App() {
    const dispatch = useDispatch();
    const location = useLocation();


    useEffect(() => {
        const loadUserData = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                dispatch(setCart([]));
                dispatch(setWishlist([]));
                return;
            }

            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };


                const cartResponse = await axios.get(
                    "http://localhost:8004/cart",
                    { headers }
                );

                if (cartResponse.data.success) {
                    const cartProducts =
                        cartResponse.data.cart.items
                            .filter((item) => item.product)
                            .map((item) => ({
                                id: item.product._id,
                                title: item.product.name,
                                price: item.product.price,
                                image: item.product.images?.[0]
                                    ? `http://localhost:8004${item.product.images[0]}`
                                    : "",
                                quantity: item.quantity,
                            }));

                    dispatch(setCart(cartProducts));
                }
                const wishlistResponse = await axios.get(
                    "http://localhost:8004/wishlist",
                    { headers }
                );

                if (wishlistResponse.data.success) {
                    const wishlistProducts =
                        wishlistResponse.data.wishlist.products
                            .filter((product) => product)
                            .map((product) => ({
                                id: product._id,
                                title: product.name,
                                price: product.price,
                                image: product.images?.[0]
                                    ? `http://localhost:8004${product.images[0]}`
                                    : "",
                                rating: product.rating || 0,
                            }));

                    dispatch(setWishlist(wishlistProducts));
                }

            } catch (error) {
                console.log(
                    "Error loading Cart and Wishlist:",
                    error.response?.data || error.message
                );

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    dispatch(setCart([]));
                    dispatch(setWishlist([]));
                }
            }
        };

        loadUserData();

    }, [dispatch, location.pathname]);

    return (
        <>
            <Navbar />

            <Toaster position="top-right" />

            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user/verify/:token" element={<Verify />} />
                <Route
                    path="/seller/dashboard"
                    element={<SellerDashboard />}
                />
                <Route
                    path="/seller/add-product"
                    element={<AddProduct />}
                />
                <Route
                    path="/seller/my-products"
                    element={<MyProducts />}
                />
                <Route
                    path="/seller/edit-product/:id"
                    element={<EditProduct />}
                />
            </Routes>
        </>
    );
}

export default App;
