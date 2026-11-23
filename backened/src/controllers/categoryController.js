import categorySchema from "../models/categorySchema.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const category = await categorySchema.create({
      name,
      description,
      image,
    });

    return res.status(201).json({
      success: true,
      category,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categorySchema.find();

    console.log("Categories found:", categories);
    console.log("Collection:", categorySchema.collection.name);

    return res.status(200).json({
      success: true,
      categories,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};