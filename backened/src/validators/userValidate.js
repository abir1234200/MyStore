
import yup from "yup";

export const userSchema = yup.object({
    userName: yup.string().required(),
    email: yup.string().email().required(),

    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must contain at least 8 characters")
        .max(64, "Password cannot exceed 64 characters")
        .matches(/[A-Z]/, "At least one uppercase letter is required")
        .matches(/[a-z]/, "At least one lowercase letter is required")
        .matches(/[0-9]/, "At least one number is required")
        .matches(/[^A-Za-z0-9]/, "At least one special character is required"),
});

export const validateUser = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            errors: error.errors,
        });
    }
};
