import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditDonation = () => {
  const { id } = useParams(); // Get donation ID from URL
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/Donation/${id}`
        );
        setDonation(response.data.donation);
      } catch (err) {
        setError("Failed to fetch donation");
      }
    };

    fetchDonation();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Send updated donation data (excluding id, amountRaised, and organization)
      const { amountRaised, organization, ...updateData } = donation; // Exclude these fields from update

      await axios.put(
        `http://localhost:5000/Donation/update/${id}`,
        updateData
      );
      navigate("/table");
    } catch (err) {
      setError("Failed to update donation");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("bankDetails.")) {
      const fieldName = name.split(".")[1];
      setDonation((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [fieldName]: value,
        },
      }));
    } else if (name.startsWith("directCash.")) {
      const fieldName = name.split(".")[1];
      setDonation((prev) => ({
        ...prev,
        directCash: {
          ...prev.directCash,
          [fieldName]: value,
        },
      }));
    } else {
      setDonation((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (!donation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8">
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleUpdate}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded-md"
            value={donation.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded-md"
            value={donation.description}
            onChange={handleChange}
          />
        </div>

        {/* Amount Required */}
        <div className="mb-4">
          <label className="block text-gray-700">Amount Required</label>
          <input
            type="number"
            name="amountRequired"
            className="w-full p-2 border rounded-md"
            value={donation.amountRequired}
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <textarea
            name="location"
            className="w-full p-2 border rounded-md"
            value={donation.location}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            name="category"
            className="w-full p-2 border rounded-md"
            value={donation.category}
            onChange={handleChange}
          >
            <option value="Hunger">Hunger</option>
            <option value="Medical">Medical</option>
            <option value="Education">Education</option>
            <option value="Poverty">Poverty</option>
            <option value="Disaster">Disaster</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Bank Details */}
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
                value={donation.bankDetails.accountNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
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
                value={donation.bankDetails.bankName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
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
                value={donation.bankDetails.accountHolderName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Direct Deposits */}
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
                value={donation.directCash.orgName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
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
                value={donation.directCash.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
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
                value={donation.directCash.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Emergency */}
        <div className="mb-4">
          <label className="block text-gray-700">Emergency</label>
          <select
            name="emergency"
            className="w-full p-2 border rounded-md"
            value={donation.emergency}
            onChange={handleChange}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditDonation;
