
const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:8004"
).replace(/\/$/, "");

export default API_URL;
