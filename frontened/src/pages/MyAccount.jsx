
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import API_URL from "../config/api.js";

const MyAccount = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState({
        userName: "",
        email: ""
    });

    const [profileLoading, setProfileLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false
    });

    const token = localStorage.getItem("accessToken");

    const API = `${API_URL}/user`;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const getProfile = async () => {
        try {
            setProfileLoading(true);

            const response = await axios.get(
                `${API}/profile`,
                config
            );

            setProfile(response.data.user);

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to load profile"
            );
        } finally {
            setProfileLoading(false);
        }
    };

    const getAddresses = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API}/addresses`,
                config
            );

            setAddresses(response.data.addresses || []);

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to load addresses"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
        getAddresses();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const resetForm = () => {
        setForm({
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
            isDefault: false
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put(
                    `${API}/addresses/${editingId}`,
                    form,
                    config
                );

                toast.success("Address updated successfully");

            } else {
                await axios.post(
                    `${API}/addresses`,
                    form,
                    config
                );

                toast.success("Address added successfully");
            }

            resetForm();
            getAddresses();

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to save address"
            );
        }
    };

    const handleEdit = (address) => {
        setForm({
            addressLine1: address.addressLine1 || "",
            addressLine2: address.addressLine2 || "",
            city: address.city || "",
            state: address.state || "",
            postalCode: address.postalCode || "",
            country: address.country || "India",
            isDefault: address.isDefault || false
        });

        setEditingId(address._id);
        setActiveTab("addresses");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) {
            return;
        }

        try {
            await axios.delete(
                `${API}/addresses/${id}`,
                config
            );

            toast.success("Address deleted successfully");

            getAddresses();

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to delete address"
            );
        }
    };

    const handleDefault = async (id) => {
        try {
            await axios.patch(
                `${API}/addresses/${id}/default`,
                {},
                config
            );

            toast.success("Default address updated");

            getAddresses();

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to update default address"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10">

            <div className="mx-auto max-w-6xl">

                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                    My Account
                </h1>

                <p className="mb-8 text-gray-500">
                    Manage your profile and addresses.
                </p>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

                    <div className="h-fit rounded-lg bg-white p-4 shadow">

                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`mb-2 w-full rounded-lg p-3 text-left ${activeTab === "profile"
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            My Profile
                        </button>

                        <button
                            onClick={() => setActiveTab("addresses")}
                            className={`mb-2 w-full rounded-lg p-3 text-left ${activeTab === "addresses"
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            My Addresses
                        </button>

                    </div>

                    <div className="rounded-lg bg-white p-6 shadow md:col-span-3">

                        {activeTab === "profile" && (

                            <div>

                                <h2 className="mb-6 text-xl font-bold">
                                    My Profile
                                </h2>

                                {profileLoading ? (

                                    <p className="text-gray-500">
                                        Loading profile...
                                    </p>

                                ) : (

                                    <>

                                        <div className="mb-6 flex items-center gap-4">

                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
                                                {profile.userName
                                                    ? profile.userName.charAt(0).toUpperCase()
                                                    : "U"}
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {profile.userName}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    MyStore Account
                                                </p>
                                            </div>

                                        </div>

                                        <div className="space-y-5">

                                            <div>
                                                <label className="mb-1 block text-sm text-gray-500">
                                                    Full Name
                                                </label>

                                                <div className="rounded-lg border bg-gray-50 p-3">
                                                    {profile.userName}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm text-gray-500">
                                                    Email Address
                                                </label>

                                                <div className="rounded-lg border bg-gray-50 p-3">
                                                    {profile.email}
                                                </div>
                                            </div>

                                        </div>

                                        <p className="mt-6 text-sm text-gray-500">
                                            Your registered name and email
                                            address cannot be changed here.
                                        </p>

                                    </>

                                )}

                            </div>

                        )}

                        {activeTab === "addresses" && (

                            <div>

                                <h2 className="mb-6 text-xl font-bold">
                                    My Addresses
                                </h2>

                                <form
                                    onSubmit={handleSubmit}
                                    className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2"
                                >

                                    <input
                                        name="addressLine1"
                                        placeholder="Address Line 1"
                                        value={form.addressLine1}
                                        onChange={handleChange}
                                        required
                                        className="rounded border p-3 md:col-span-2"
                                    />

                                    <input
                                        name="addressLine2"
                                        placeholder="Address Line 2 (Optional)"
                                        value={form.addressLine2}
                                        onChange={handleChange}
                                        className="rounded border p-3 md:col-span-2"
                                    />

                                    <input
                                        name="city"
                                        placeholder="City"
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                        className="rounded border p-3"
                                    />

                                    <input
                                        name="state"
                                        placeholder="State"
                                        value={form.state}
                                        onChange={handleChange}
                                        required
                                        className="rounded border p-3"
                                    />

                                    <input
                                        name="postalCode"
                                        placeholder="PIN Code"
                                        value={form.postalCode}
                                        onChange={handleChange}
                                        required
                                        className="rounded border p-3"
                                    />

                                    <input
                                        name="country"
                                        placeholder="Country"
                                        value={form.country}
                                        onChange={handleChange}
                                        required
                                        className="rounded border p-3"
                                    />

                                    <label className="flex items-center gap-2 md:col-span-2">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={form.isDefault}
                                            onChange={handleChange}
                                        />

                                        Set as default address
                                    </label>

                                    <div className="flex gap-3 md:col-span-2">

                                        <button
                                            type="submit"
                                            className="rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                                        >
                                            {editingId
                                                ? "Update Address"
                                                : "Add Address"}
                                        </button>

                                        {editingId && (

                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="rounded bg-gray-200 px-5 py-3"
                                            >
                                                Cancel
                                            </button>

                                        )}

                                    </div>

                                </form>

                                <h3 className="mb-4 text-lg font-semibold">
                                    Saved Addresses
                                </h3>

                                {loading ? (

                                    <p>Loading addresses...</p>

                                ) : addresses.length === 0 ? (

                                    <p className="text-gray-500">
                                        No saved addresses yet.
                                    </p>

                                ) : (

                                    <div className="space-y-4">

                                        {addresses.map((address) => (

                                            <div
                                                key={address._id}
                                                className="rounded-lg border p-4"
                                            >

                                                <div className="flex flex-wrap items-center justify-between gap-2">

                                                    <h4 className="font-semibold">
                                                        Delivery Address
                                                    </h4>

                                                    {address.isDefault && (

                                                        <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">
                                                            Default
                                                        </span>

                                                    )}

                                                </div>

                                                <p className="mt-2 text-gray-600">
                                                    {address.addressLine1}
                                                    {address.addressLine2 &&
                                                        `, ${address.addressLine2}`}
                                                </p>

                                                <p className="text-gray-600">
                                                    {address.city}, {address.state} - {address.postalCode}
                                                </p>

                                                <p className="text-gray-600">
                                                    {address.country}
                                                </p>

                                                <div className="mt-4 flex flex-wrap gap-3">

                                                    <button
                                                        onClick={() => handleEdit(address)}
                                                        className="text-blue-600"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(address._id)}
                                                        className="text-red-600"
                                                    >
                                                        Delete
                                                    </button>

                                                    {!address.isDefault && (

                                                        <button
                                                            onClick={() => handleDefault(address._id)}
                                                            className="text-green-600"
                                                        >
                                                            Set Default
                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default MyAccount;
