
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";
import API_URL from "../config/api.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "All";

  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [error, setError] = useState("");

  const productsPerPage = 8;

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/category`
      );

      setCategories(response.data.categories || []);

    } catch (error) {
      console.log("Category error:", error);

    } finally {
      setCategoriesLoaded(true);
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/product`,
        {
          params: {
            page: currentPage,
            limit: productsPerPage,
            search,
            category: category === "All" ? "" : category,
            sort
          }
        }
      );

      const productList = response.data.products || [];

      const formattedProducts = productList.map((product) => {

        const matchedCategory = categories.find(
          (item) =>
            item._id ===
            (product.category?._id || product.category)
        );

        return {
          _id: product._id,
          id: product._id,

          title: product.name,

          image: getImageUrl(product.images?.[0]),

          images: product.images || [],

          price: product.price,
          rating: product.rating || 0,
          category: matchedCategory?.name || "",
          description: product.description,
          stock: product.stock
        };
      });

      setProducts(formattedProducts);
      setTotalPages(response.data.totalPages || 0);

    } catch (error) {
      console.log("Product error:", error.response?.data || error.message);
      setError("Failed to load products. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (!categoriesLoaded) return;

    getAllProducts();

  }, [
    search,
    category,
    sort,
    currentPage,
    categoriesLoaded
  ]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (selectedCategory === "All") {
        newParams.delete("category");
      } else {
        newParams.set("category", selectedCategory);
      }

      return newParams;
    });

    setCurrentPage(1);
  };

  return (
    <div className="p-4 md:p-8">

      <h1 className="text-3xl font-bold mb-6">
        Our Products
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 border p-3 rounded-lg"
        />

        <select
          value={category}
          onChange={handleCategoryChange}
          className="border p-3 rounded-lg"
        >
          <option value="All">
            All Categories
          </option>

          {categories.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-3 rounded-lg"
        >
          <option value="default">
            Default Sorting
          </option>

          <option value="lowToHigh">
            Price: Low to High
          </option>

          <option value="highToLow">
            Price: High to Low
          </option>

          <option value="nameAZ">
            Name: A to Z
          </option>

          <option value="nameZA">
            Name: Z to A
          </option>
        </select>

      </div>

      {loading ? (
        <p className="text-lg">
          Loading products...
        </p>
      ) : error ? (
        <p className="text-red-600">
          {error}
        </p>
      ) : (
        <>

          {products.length === 0 ? (
            <p className="text-gray-500 text-lg">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}

            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center flex-wrap gap-3 mt-10">

              <button
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setCurrentPage(index + 1)
                    }
                    className={`px-4 py-2 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
              >
                Next
              </button>

            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Products;
