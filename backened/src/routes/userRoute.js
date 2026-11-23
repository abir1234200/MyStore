
import express from "express";

import {
    login,
    logout,
    register,
    becomeSeller,
    getProfile,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from "../controllers/userController.js";

import { verification } from "../middleware/verifyToken.js";
import { userSchema, validateUser } from "../validators/userValidate.js";
import { hasToken } from "../middleware/hasToken.js";

const userRoute = express.Router();




userRoute.post("/register", validateUser(userSchema), register);

userRoute.get("/verify", verification);

userRoute.post("/login", login);

userRoute.delete("/logout", hasToken, logout);




userRoute.get("/profile", hasToken, getProfile);




userRoute.post("/become-seller", hasToken, becomeSeller);


userRoute.get("/addresses", hasToken, getAddresses);


userRoute.post("/addresses", hasToken, addAddress);


userRoute.put("/addresses/:addressId", hasToken, updateAddress);


userRoute.delete("/addresses/:addressId", hasToken, deleteAddress);


userRoute.patch(
    "/addresses/:addressId/default",
    hasToken,
    setDefaultAddress
);


export default userRoute;
