
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API_URL from "../config/api.js";

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: ""
  });

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/category`
      );

      setCategories(response.data.categories || []);

    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    if (images.length + selectedImages.length > 5) {
      toast.error("You can upload maximum 5 images");
      e.target.value = "";
      return;
    }

    const validImages = selectedImages.filter((file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported image`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5 MB`);
        return false;
      }

      return true;
    });

    setImages((prev) => [...prev, ...validImages]);

    setPreviews((prev) => [
      ...prev,
      ...validImages.map((file) => URL.createObjectURL(file))
    ]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      return toast.error("Please enter category name");
    }

    try {
      setCategoryLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/category`,
        {
          name: newCategoryName.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        const newCategory = response.data.category;

        setCategories((prev) => [...prev, newCategory]);

        setFormData((prev) => ({
          ...prev,
          category: newCategory._id
        }));

        setNewCategoryName("");
        setShowNewCategory(false);

        toast.success("Category added successfully!");
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to add category"
      );

    } finally {
      setCategoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      return toast.error("Please upload at least one product image");
    }

    try {
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const productData = new FormData();

      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("price", formData.price);
      productData.append("stock", formData.stock);
      productData.append("category", formData.category);

      images.forEach((image) => {
        productData.append("images", image);
      });

      const response = await axios.post(
        `${API_URL}/product`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Product added successfully!");

        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: ""
        });

        previews.forEach((preview) => URL.revokeObjectURL(preview));

        setImages([]);
        setPreviews([]);

        navigate("/seller/dashboard");
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to add product"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-2">
          Add New Product
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Enter your product details below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block font-semibold mb-2">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Product Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
              rows="4"
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Price (₹)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              required
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Stock Quantity
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              min="0"
              required
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Existing Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-4"
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border rounded-xl p-4">

            <button
              type="button"
              onClick={() => setShowNewCategory(!showNewCategory)}
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              {showNewCategory
                ? "− Close Add Category"
                : "+ Add New Category"}
            </button>

            {showNewCategory && (
              <div className="mt-4 space-y-3">

                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter new category name"
                  className="w-full border rounded-xl p-4"
                />

                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={categoryLoading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {categoryLoading ? "Saving..." : "Save Category"}
                </button>

              </div>
            )}

          </div>

          <div>
            <label className="block font-semibold mb-2">
              Product Images
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageChange}
              className="w-full border rounded-xl p-4"
            />

            <p className="text-sm text-gray-500 mt-2">
              Upload up to 5 images. Maximum 5 MB per image.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">

              {previews.map((preview, index) => (
                <div key={preview} className="relative">

                  <img
                    src={preview}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7"
                  >
                    ×
                  </button>

                </div>
              ))}

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-5 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

        </form>

        <div className="text-center mt-8">
          <Link
            to="/seller/dashboard"
            className="text-blue-600 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AddProduct;
