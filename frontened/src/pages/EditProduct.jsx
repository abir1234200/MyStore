
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: ""
  });


  const [existingImage, setExistingImage] = useState("");

  const [imageFile, setImageFile] = useState(null);


  const [previewImage, setPreviewImage] = useState("");

  const getProductDetails = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const [productResponse, categoryResponse] = await Promise.all([
        axios.get(`http://localhost:8004/product/${id}`),
        axios.get("http://localhost:8004/category")
      ]);

      const product = productResponse.data.product;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? "",
        stock: product.stock ?? "",
        category: product.category?._id || product.category || ""
      });

      const image = product.images?.[0]
        ? `http://localhost:8004${product.images[0]}`
        : "";

      setExistingImage(image);
      setPreviewImage(image);

      setCategories(categoryResponse.data.categories || []);

    } catch (error) {
      console.log(error);
      toast.error("Failed to load product details");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    setImageFile(file);

    const imageURL = URL.createObjectURL(file);
    setPreviewImage(imageURL);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const accessToken = localStorage.getItem("accessToken");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);


      if (imageFile) {
        data.append("images", imageFile);
      }

      const response = await axios.put(
        `http://localhost:8004/product/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
        navigate("/seller/my-products");
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to update product"
      );

    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center py-10">
        Loading product details...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-2">
          Edit Product
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Update your product details below
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
              min="0"
              required
              className="w-full border rounded-xl p-4"
            />
          </div>


          <div>
            <label className="block font-semibold mb-2">
              Category
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


          <div>
            <label className="block font-semibold mb-3">
              Product Image
            </label>

            {previewImage ? (
              <img
                src={previewImage}
                alt="Product preview"
                className="w-48 h-48 object-cover rounded-xl border mb-4"
              />
            ) : (
              <p className="text-gray-500 mb-4">
                No product image available
              </p>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-xl p-3"
            />

            <p className="text-sm text-gray-500 mt-2">
              Select a new image to replace the existing one.
            </p>
          </div>


          <button
            type="submit"
            disabled={updating}
            className="w-full bg-blue-600 text-white font-bold py-5 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {updating ? "Updating Product..." : "Update Product"}
          </button>

        </form>

        <div className="text-center mt-8">
          <Link
            to="/seller/my-products"
            className="text-blue-600 hover:underline"
          >
            Back to My Products
          </Link>
        </div>

      </div>
    </div>
  );
};

export default EditProduct;
