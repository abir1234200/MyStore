
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

import productSchema from "../models/productSchema.js";
import categorySchema from "../models/categorySchema.js";

// =====================================
// HELPER: Delete image safely
// =====================================

const deleteImageSafely = async (image) => {
  try {
    if (!image || !image.startsWith("/uploads/")) {
      return;
    }

    const filename = path.basename(image);
    const imagePath = path.resolve("uploads", filename);

    // Check whether another product uses this image
    const productUsingImage = await productSchema.findOne({
      images: image
    });

    if (productUsingImage) {
      return;
    }

    // Check whether a category uses this image
    const categoryUsingImage = await categorySchema.findOne({
      image: image
    });

    if (categoryUsingImage) {
      return;
    }

    await fs.unlink(imagePath);

  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Image deletion failed:", error);
    }
  }
};


// =====================================
// HELPER: Delete newly uploaded files
// =====================================

const deleteUploadedFiles = async (files = []) => {
  for (const file of files) {
    try {
      await fs.unlink(file.path);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Uploaded file cleanup failed:", error);
      }
    }
  }
};



export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
    } = req.body;

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const existingCategory = await categorySchema.findOne({
      _id: category,
      isActive: true,
    });

    if (!existingCategory) {
      await deleteUploadedFiles(req.files);

      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one product image",
      });
    }

    const product = await productSchema.create({
      name,
      description,
      price,
      stock,
      images,
      category,
      seller: req.userId,
    });

    if (!existingCategory.image) {
      existingCategory.image = images[0];
      await existingCategory.save();
    }

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    await deleteUploadedFiles(req.files);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 8,
      search = "",
      category,
      sort = "default"
    } = req.query;

    const filter = {
      isActive: true
    };

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    if (category) {
      filter.category = category;
    }

    let sortOption = {};

    if (sort === "lowToHigh") {
      sortOption.price = 1;
    } else if (sort === "highToLow") {
      sortOption.price = -1;
    } else if (sort === "nameAZ") {
      sortOption.name = 1;
    } else if (sort === "nameZA") {
      sortOption.name = -1;
    }

    const pageNumber = Math.max(1, Number(page) || 1);

    const limitNumber = Math.min(
      50,
      Math.max(1, Number(limit) || 8)
    );

    const skip = (pageNumber - 1) * limitNumber;

    const products = await productSchema
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await productSchema.countDocuments(filter);

    const totalPages = Math.ceil(
      totalProducts / limitNumber
    );

    return res.status(200).json({
      success: true,
      products,
      currentPage: pageNumber,
      totalPages,
      totalProducts
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await productSchema.findOne({
      _id: id,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getMyProducts = async (req, res) => {
  try {
    const products = await productSchema.find({
      seller: req.userId
    });

    return res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const updateMyProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      stock,
      category
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await deleteUploadedFiles(req.files);

      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const existingProduct = await productSchema.findOne({
      _id: id,
      seller: req.userId
    });

    if (!existingProduct) {
      await deleteUploadedFiles(req.files);

      return res.status(404).json({
        success: false,
        message: "Product not found or you are not authorized"
      });
    }

    const existingCategory = await categorySchema.findOne({
      _id: category,
      isActive: true
    });

    if (!existingCategory) {
      await deleteUploadedFiles(req.files);

      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }


    let images = existingProduct.images;


    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
    }


    const updatedProduct = await productSchema.findOneAndUpdate(
      {
        _id: id,
        seller: req.userId
      },
      {
        name,
        description,
        price,
        stock,
        category,
        images
      },
      {
        new: true,
        runValidators: true
      }
    );


    if (req.files && req.files.length > 0) {
      for (const oldImage of existingProduct.images) {
        if (!images.includes(oldImage)) {
          await deleteImageSafely(oldImage);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    await deleteUploadedFiles(req.files);

    console.log("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




export const deleteMyProduct = async (req, res) => {
  try {
    const product = await productSchema.findOneAndDelete({
      _id: req.params.id,
      seller: req.userId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you are not authorized to delete it"
      });
    }


    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        await deleteImageSafely(image);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Product and uploaded images deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
