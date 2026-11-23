
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

import {
  FaShoppingCart,
  FaHeart,
  FaStore,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaUser,
  FaBox,
  FaChevronDown,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const wishlistCount = wishlistItems.length;

  const userName = localStorage.getItem("name") || "User";


  useEffect(() => {
    setIsLoggedIn(
      localStorage.getItem("loginStatus") === "true" &&
      Boolean(localStorage.getItem("accessToken"))
    );
  }, [location.pathname]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      await axios.delete(
        "http://localhost:8004/user/logout",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Logged out successfully");

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Logout request failed"
      );

    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("name");
      localStorage.removeItem("loginStatus");
      localStorage.removeItem("isSeller");

      setIsLoggedIn(false);
      setIsProfileOpen(false);
      closeMenu();

      navigate("/");
    }
  };

  return (
    <>

      <nav className="bg-[#171717] text-white px-4 md:px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between">


          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <FaStore className="text-2xl text-gray-300" />

            <span className="text-2xl font-bold tracking-wide">
              MyStore<span className="text-gray-400">.</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-5">

            <Link to="/" className="text-gray-300 hover:text-white">
              Home
            </Link>

            <Link to="/products" className="text-gray-300 hover:text-white">
              Products
            </Link>

            <Link to="/about" className="text-gray-300 hover:text-white">
              About
            </Link>

            <Link to="/contact" className="text-gray-300 hover:text-white">
              Contact
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center gap-2 text-gray-300 hover:text-pink-400"
            >
              <FaHeart />
              Wishlist ({wishlistCount})
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 text-gray-300 hover:text-blue-400"
            >
              <FaShoppingCart />
              Cart ({cartCount})
            </Link>


            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/seller/dashboard"
                  className="text-gray-300 hover:text-white"
                >
                  Sell Your Products
                </Link>


                <div className="relative" ref={profileRef}>

                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 bg-[#292929] hover:bg-[#383838] px-3 py-2 rounded-full"
                  >
                    <FaUserCircle className="text-2xl text-blue-400" />

                    <span className="font-medium">
                      {userName}
                    </span>

                    <FaChevronDown className="text-xs" />
                  </button>


                  {isProfileOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-50">

                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold">
                          {userName}
                        </p>

                        <p className="text-xs text-gray-500">
                          My Account
                        </p>
                      </div>


                      <Link
                        to="/my-account"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                      >
                        <FaUser />
                        My Account
                      </Link>

                      <Link
                        to="/my-orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                      >
                        <FaBox />
                        My Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                      >
                        <FaHeart />
                        My Wishlist
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-100 w-full text-left border-t"
                      >
                        <FaTimes />
                        Logout
                      </button>

                    </div>
                  )}
                </div>
              </>
            )}

          </div>


          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden text-2xl text-white"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <FaBars />
          </button>

        </div>
      </nav>


      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">


          <button
            onClick={closeMenu}
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
          />


          <aside
            id="mobile-menu"
            className="relative z-10 h-full w-4/5 max-w-sm bg-white text-gray-800 shadow-xl overflow-y-auto"
          >


            <div className="flex items-center justify-between bg-[#171717] text-white p-5">

              <div className="flex items-center gap-2">
                <FaStore className="text-xl" />

                <span className="text-xl font-bold">
                  MyStore.
                </span>
              </div>

              <button
                onClick={closeMenu}
                className="text-2xl"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>

            </div>


            <div className="bg-gray-100 p-5 border-b">
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-4xl text-blue-600" />

                <div>
                  <h2 className="text-lg font-semibold">
                    Hello, {isLoggedIn ? userName : "Welcome!"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Explore our store
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-6">


              <section>
                <h3 className="text-sm font-bold text-gray-400 mb-3">
                  MY ACCOUNT
                </h3>

                <div className="flex flex-col gap-4">

                  {!isLoggedIn ? (
                    <>
                      <Link to="/login" onClick={closeMenu}>
                        Login
                      </Link>

                      <Link to="/signup" onClick={closeMenu}>
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/my-account" onClick={closeMenu}>
                        My Account
                      </Link>

                      <Link to="/my-orders" onClick={closeMenu}>
                        My Orders
                      </Link>

                      <Link
                        to="/seller/dashboard"
                        onClick={closeMenu}
                      >
                        Sell Your Products
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="text-left text-red-600 font-medium"
                      >
                        Logout
                      </button>
                    </>
                  )}

                </div>
              </section>

              <hr />


              <section>
                <h3 className="text-sm font-bold text-gray-400 mb-3">
                  MAIN MENU
                </h3>

                <div className="flex flex-col gap-4">

                  <Link to="/" onClick={closeMenu}>
                    Home
                  </Link>

                  <Link to="/products" onClick={closeMenu}>
                    All Products
                  </Link>

                  <Link to="/about" onClick={closeMenu}>
                    About Us
                  </Link>

                  <Link to="/contact" onClick={closeMenu}>
                    Contact Us
                  </Link>

                </div>
              </section>

              <hr />


              <section>
                <h3 className="text-sm font-bold text-gray-400 mb-3">
                  MY SHOPPING
                </h3>

                <div className="flex flex-col gap-4">

                  <Link
                    to="/wishlist"
                    onClick={closeMenu}
                    className="flex items-center gap-3"
                  >
                    <FaHeart className="text-pink-500" />
                    Wishlist ({wishlistCount})
                  </Link>

                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="flex items-center gap-3"
                  >
                    <FaShoppingCart className="text-blue-500" />
                    Cart ({cartCount})
                  </Link>

                </div>
              </section>

              <hr />


              <section>
                <h3 className="text-sm font-bold text-gray-400 mb-3">
                  SHOP BY CATEGORY
                </h3>

                <div className="flex flex-col gap-4">

                  <Link to="/products" onClick={closeMenu}>
                    Electronics
                  </Link>

                  <Link to="/products" onClick={closeMenu}>
                    Fashion
                  </Link>

                  <Link to="/products" onClick={closeMenu}>
                    Home & Living
                  </Link>

                  <Link to="/products" onClick={closeMenu}>
                    Sports
                  </Link>

                  <Link to="/products" onClick={closeMenu}>
                    Beauty
                  </Link>

                  <Link to="/products" onClick={closeMenu}>
                    Accessories
                  </Link>

                </div>
              </section>

              <hr />


              <section>
                <h3 className="text-sm font-bold text-gray-400 mb-3">
                  INFORMATION
                </h3>

                <div className="flex flex-col gap-4">

                  <Link
                    to="/shipping-policy"
                    onClick={closeMenu}
                  >
                    Shipping Policy
                  </Link>

                  <Link
                    to="/return-policy"
                    onClick={closeMenu}
                  >
                    Return Policy
                  </Link>

                  <Link
                    to="/privacy-policy"
                    onClick={closeMenu}
                  >
                    Privacy Policy
                  </Link>

                </div>
              </section>

            </div>
          </aside>

        </div>
      )}
    </>
  );
};

export default Navbar;
