import React, { useState } from "react";
import axios from "axios";

const DonationForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amountRequired: "",
    location: "",
    category: "",
    bankDetails: {
      accountNumber: "",
      bankName: "",
      accountHolderName: "",
    },
    directCash: {
      orgName: "",
      phone: "",
      address: "",
    },
    image: null,
    organization: "",
    emergency: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files[0], // Store the selected file
      }));
    } else if (name.startsWith("bankDetails.")) {
      const fieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [fieldName]: value,
        },
      }));
    } else if (name.startsWith("directCash.")) {
      const fieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        directCash: {
          ...prev.directCash,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("amountRequired", formData.amountRequired);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("organization", formData.organization);
    formDataToSend.append("emergency", formData.emergency);
    formDataToSend.append(
      "bankDetails[accountNumber]",
      formData.bankDetails.accountNumber
    );
    formDataToSend.append(
      "bankDetails[bankName]",
      formData.bankDetails.bankName
    );
    formDataToSend.append(
      "bankDetails[accountHolderName]",
      formData.bankDetails.accountHolderName
    );
    formDataToSend.append("directCash[orgName]", formData.directCash.orgName);
    formDataToSend.append("directCash[phone]", formData.directCash.phone);
    formDataToSend.append("directCash[address]", formData.directCash.address);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/Donation",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      setSuccess("Donation created successfully!");
      setError("");
      setFormData({
        title: "",
        description: "",
        amountRequired: "",
        location: "",
        category: "",
        bankDetails: {
          accountNumber: "",
          bankName: "",
          accountHolderName: "",
        },
        directCash: {
          orgName: "",
          phone: "",
          address: "",
        },
        organization: "",
        emergency: "",
      });
    } catch (err) {
      setError("Failed to create donation. Please try again.");
      setSuccess("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-8 bg-grey shadow-lg rounded-lg"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create Donation
      </h2>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
          role="alert"
        >
          {success}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows="4"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="amountRequired"
            >
              Amount Required
            </label>
            <input
              type="number"
              id="amountRequired"
              name="amountRequired"
              value={formData.amountRequired}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="location"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="image"
            >
              File
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange} // Handle the file input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select a category</option>
              <option value="Hunger">Hunger</option>
              <option value="Medical">Medical</option>
              <option value="Education">Education</option>
              <option value="Poverty">Poverty</option>
              <option value="Disaster">Disaster</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="organization"
            >
              Organization
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Bank Details
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="bankDetails.accountNumber"
              >
                Account Number
              </label>
              <input
                type="text"
                id="bankDetails.accountNumber"
                name="bankDetails.accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="bankDetails.bankName"
              >
                Bank Name
              </label>
              <input
                type="text"
                id="bankDetails.bankName"
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="bankDetails.accountHolderName"
              >
                Account Holder Name
              </label>
              <input
                type="text"
                id="bankDetails.accountHolderName"
                name="bankDetails.accountHolderName"
                value={formData.bankDetails.accountHolderName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Direct Deposits
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="directCash.orgName"
              >
                Organization Name
              </label>
              <input
                type="text"
                id="directCash.orgName"
                name="directCash.orgName"
                value={formData.directCash.orgName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="directCash.phone"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="directCash.phone"
                name="directCash.phone"
                value={formData.directCash.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="directCash.address"
              >
                Address
              </label>
              <input
                type="text"
                id="directCash.address"
                name="directCash.address"
                value={formData.directCash.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="emergency"
          >
            Emergency
          </label>
          <select
            id="emergency"
            name="emergency"
            value={formData.emergency}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          >
            <option value="">Select</option>
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Donation
          </button>
        </div>
      </div>
    </form>
  );
};

export default DonationForm;
