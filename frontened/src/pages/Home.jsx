
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import ProductCard from "../components/ProductCard";
import API_URL from "../config/api.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [productLoading, setProductLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const getProducts = async () => {
    try {
      setProductLoading(true);

      const response = await axios.get(
        `${API_URL}/product?limit=50`
      );

      const productList = response.data.products || [];

      const sortedProducts = [...productList].sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

      const formattedProducts = sortedProducts.map((product) => ({
        ...product,
        id: product._id,
        title: product.name,
        image: getImageUrl(product.images?.[0])
      }));

      setProducts(formattedProducts.slice(0, 4));

    } catch (error) {
      console.error(
        "Products loading error:",
        error.response?.data || error.message
      );
    } finally {
      setProductLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await axios.get(
        `${API_URL}/category`
      );

      const categoryList = response.data.categories || [];

      setCategories(categoryList);

    } catch (error) {
      console.error(
        "Categories loading error:",
        error.response?.data || error.message
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  return (
    <div className="bg-white text-gray-800">

      <section className="grid grid-cols-1 md:grid-cols-2 bg-gray-100">

        <div className="flex flex-col justify-center p-8 md:p-16">

          <p className="text-sm tracking-widest text-gray-500 mb-4">
            WELCOME TO MYSTORE
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Everything You Need,
            <span className="block text-gray-500">
              All in One Place.
            </span>
          </h1>

          <p className="text-gray-600 mt-5 max-w-md">
            Discover amazing products across electronics,
            fashion, lifestyle and more.
          </p>

          <Link
            to="/products"
            className="bg-gray-900 text-white px-7 py-3 rounded-md mt-8 w-fit hover:bg-gray-700 transition"
          >
            SHOP NOW →
          </Link>

        </div>

        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
          alt="Shopping collection"
          className="w-full h-80 md:h-[500px] object-cover"
        />

      </section>

      {!categoryLoading && categories.length > 0 && (

        <section className="p-5 md:p-10">

          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold">
              SHOP BY CATEGORY
            </h2>

            <p className="text-gray-500 mt-2">
              Explore our different collections
            </p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

            {categories.map((category) => (

              <Link
                to={`/products?category=${category._id}`}
                key={category._id}
                className="group"
              >

                {category.image ? (

                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition"
                  />

                ) : (

                  <div className="w-full h-40 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                    {category.name}
                  </div>

                )}

                <h3 className="text-center font-semibold mt-3">
                  {category.name}
                </h3>

              </Link>

            ))}

          </div>

        </section>

      )}

      {!productLoading && products.length > 0 && (

        <section className="p-5 md:p-10 bg-gray-50">

          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold">
              LATEST PRODUCTS
            </h2>

            <p className="text-gray-500 mt-2">
              Discover our newest arrivals
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {products.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
              />

            ))}

          </div>

          <div className="text-center mt-8">

            <Link
              to="/products"
              className="inline-block bg-gray-900 text-white px-7 py-3 rounded-lg hover:bg-gray-700"
            >
              View All Products
            </Link>

          </div>

        </section>

      )}

      <section className="bg-gray-100 p-8 md:p-12">

        <h2 className="text-3xl font-bold text-center mb-10">
          OUR SERVICES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div>
            <h3 className="font-bold text-lg">
              Easy Exchange
            </h3>

            <p className="text-gray-500 mt-2">
              Hassle-free product exchange.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg">
              7-Day Returns
            </h3>

            <p className="text-gray-500 mt-2">
              Return eligible products within 7 days.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg">
              Customer Support
            </h3>

            <p className="text-gray-500 mt-2">
              We're here to help you.
            </p>
          </div>

        </div>

      </section>

      <section className="bg-white p-8 md:p-12">

        <div className="text-center mb-10">

          <h2 className="text-3xl font-bold">
            OUR POLICIES
          </h2>

          <p className="text-gray-500 mt-2">
            Shop with confidence at MyStore.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Link
            to="/shipping-policy"
            className="border border-gray-200 rounded-lg p-7 text-center hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">
              🚚
            </div>

            <h3 className="text-xl font-bold mb-3">
              Shipping Policy
            </h3>

            <p className="text-gray-500">
              Learn about our delivery process and shipping information.
            </p>
          </Link>

          <Link
            to="/return-policy"
            className="border border-gray-200 rounded-lg p-7 text-center hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">
              🔄
            </div>

            <h3 className="text-xl font-bold mb-3">
              Return Policy
            </h3>

            <p className="text-gray-500">
              Return eligible products within 7 days of delivery.
            </p>
          </Link>

          <Link
            to="/privacy-policy"
            className="border border-gray-200 rounded-lg p-7 text-center hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">
              🔒
            </div>

            <h3 className="text-xl font-bold mb-3">
              Privacy Policy
            </h3>

            <p className="text-gray-500">
              Learn how we protect and handle your information.
            </p>
          </Link>

        </div>

      </section>

      <footer className="bg-gray-900 text-white p-8 md:p-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          <div>
            <h2 className="text-2xl font-bold">
              MyStore
            </h2>

            <p className="text-gray-400 mt-3">
              Your destination for everyday shopping.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3">
              COMPANY
            </h3>

            <Link to="/" className="block text-gray-400 mb-2 hover:text-white">
              Home
            </Link>

            <Link to="/products" className="block text-gray-400 mb-2 hover:text-white">
              Products
            </Link>

            <Link to="/about" className="block text-gray-400 mb-2 hover:text-white">
              About Us
            </Link>

            <Link to="/contact" className="block text-gray-400 hover:text-white">
              Contact Us
            </Link>
          </div>

          <div>
            <h3 className="font-bold mb-3">
              POLICIES
            </h3>

            <Link
              to="/privacy-policy"
              className="block text-gray-400 mb-2 hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/return-policy"
              className="block text-gray-400 mb-2 hover:text-white"
            >
              Return Policy
            </Link>

            <Link
              to="/shipping-policy"
              className="block text-gray-400 hover:text-white"
            >
              Shipping Policy
            </Link>
          </div>

          <div>
            <h3 className="font-bold mb-3">
              CUSTOMER SUPPORT
            </h3>

            <p className="text-gray-400 mb-2">
              Email: Abirde10@gmail.com
            </p>

            <p className="text-gray-400">
              Phone: +91 9330149337
            </p>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
          © 2026 MyStore. All rights reserved.
        </div>

      </footer>

    </div>
  );
};

export default Home;
