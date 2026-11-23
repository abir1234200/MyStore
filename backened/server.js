
import express from "express";
import "dotenv/config";
import { dbConnect } from "./src/config/dbConnect.js";
import cors from "cors";
import path from "path";

// Import routes
import userRoute from "./src/routes/userRoute.js";
import categoryRoute from "./src/routes/categoryRoute.js";
import productRoute from "./src/routes/productRoute.js";
import cartRoute from "./src/routes/cartRoute.js";
import wishlistRoute from "./src/routes/wishlistRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import paymentRoute from "./src/routes/paymentRoute.js";

const app = express();
const port = process.env.PORT;


dbConnect();


app.use(express.json());
app.use(cors());


app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);
app.use("/wishlist", wishlistRoute);
app.use("/order", orderRoute);
app.use("/payment", paymentRoute);

app.use("/uploads", express.static(path.resolve("uploads")));


app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

console.log(
    "Secret key loaded:",
    Boolean(process.env.secretKey)
);
