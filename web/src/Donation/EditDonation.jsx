import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditDonation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/Donation/${id}`);
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
      const { amountRaised, organization, ...updateData } = donation;

      await axios.put(`http://localhost:5000/Donation/update/${id}`, updateData);
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
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form
        onSubmit={handleUpdate}
        className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl rounded-lg mt-10 border border-blue-200"
        >
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Edit Donation
          </h2>

          {/* Title */}
          <div className="mb-6">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            value={donation.title}
            onChange={handleChange}
            className="mt-1 block w-full  pl-3 rounded-lg h-12 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            placeholder="Enter the title here..."
            required
          />
        </div>

          {/* Description */}
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
            value={donation.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            rows="4"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount Required */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="amountRequired"
            >
              Amount Required for cause
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
              <input
                type="number"
                id="amountRequired"
                name="amountRequired"
                value={donation.amountRequired}
                onChange={handleChange}
                className="mt-1 block w-full pl-10 h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="location"
            >
              Location of Cause
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
              <input
                type="text"
                id="location"
                name="location"
                value={donation.location}
                onChange={handleChange}
                className="mt-1 block w-full pl-10 h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
                required
              />
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
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
              value={donation.category}
              onChange={handleChange}
              className="mt-1 block w-full h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
          </div>
          </div>



          {/* Bank Details Section */}
          <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-semibold mr-2">
              1
            </span>
            Bank Details (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="bankDetails.accountNumber"
              >
                Account Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                <input
                  type="text"
                  name="bankDetails.accountNumber"
                  value={donation.bankDetails?.accountNumber || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-10 h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="bankDetails.accountHolderName"
              >
                Account Holder Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                <input
                  type="text"
                  name="bankDetails.accountHolderName"
                  value={donation.bankDetails?.accountHolderName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-10 h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="emergency"
              >
                Bank Name
              </label>
              <select
                name="bankDetails.bankName"
                value={donation.bankDetails?.bankName || ""}
                onChange={handleChange}
                className="mt-1 block w-full h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
              >
                <option value="">Select</option>
                <option value="Bank Of ceylon">Bank Of ceylon</option>
                <option value="Commercial Bank">Commercial Bank</option>
                <option value="Peoples Bank">Peoples Bank</option>
                <option value="HNB Bank">HNB Bank</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="bankDetails.branch"
              >
                Bank Branch
              </label>
              <input
                type="text"
                name="bankDetails.branch"
                value={donation.bankDetails?.branch || ""}
                onChange={handleChange}
                className="mt-1 block w-full h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
              />
            </div>
          </div>
        </div>

          {/* Direct Cash Section */}
          <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-semibold mr-2">
              2
            </span>
            Nearest Organization (Optional)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                value={donation.directCash?.orgName}
                onChange={handleChange}
                className="mt-1 block w-full h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
                value={donation.directCash?.phone}
                onChange={handleChange}
                className="mt-1 block w-full h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
                value={donation.directCash?.address}
                onChange={handleChange}
                className="mt-1 block w-full h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="directCash.additionalField"
              >
                Additional Field (if needed)
              </label>
              <input
                type="text"
                id="directCash.additionalField"
                name="directCash.additionalField"
                value={donation.directCash?.additionalField}
                onChange={handleChange}
                className="mt-1 block w-full h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
              />
            </div>
          </div>
        </div>

        {/* Emergency */}
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
            value={donation.emergency}
            onChange={handleChange}
            className="mt-1 block w-full h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            required
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
          <button type="submit" class="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-blue-900 to-blue-400 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20">
            <span class="text-lg">Submit</span>
            <div class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
              <div class="relative h-full w-10 bg-white/20"></div>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDonation;
