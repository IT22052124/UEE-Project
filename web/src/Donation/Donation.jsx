import React, { useState } from "react";
import axios from "axios";
import ImageUpload from "../shared/ImageUpload";

const DonationForm = () => {
  const [progress, setProgress] = useState(0);
  const [imageUploading, setImageUploading] = useState(false);
  const [downloadURLs, setDownloadURLs] = useState([]);
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
    image: [""],
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
    formDataToSend.append(
      "bankDetails[bankBranch]",
      formData.bankDetails.bankBranch
    );
    formDataToSend.append("directCash[orgName]", formData.directCash.orgName);
    formDataToSend.append("directCash[phone]", formData.directCash.phone);
    formDataToSend.append("directCash[address]", formData.directCash.address);

    if (formData.image) {
      formDataToSend.append("image", downloadURLs);
    }

    try {
      const response = await axios.post("http://localhost:5000/Donation", {
        title: formData.title,
        description: formData.description,
        amountRequired: formData.amountRequired,
        location: formData.location,
        category: formData.category,
        bankDetails: formData.bankDetails,
        directCash: formData.directCash,
        organization: formData.organization,
        emergency: formData.emergency,
        image: downloadURLs.map((fileData) => fileData.url),
      });
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
          bankBranch:""
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
      className="max-w-6xl ml-80 mr-15 mx-auto p-8 bg-gradient-to-br from-blue-50 to-blue-200 shadow-xl rounded-lg mt-5 border border-indigo-100"
    >
      <h2 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
        Create a Donation
      </h2>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6"
          role="alert"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6"
          role="alert"
        >
          {success}
        </div>
      )}

      <div className="space-y-8">
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
            id="title"
            name="title"
            value={formData.title}
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
            value={formData.description}
            onChange={handleChange}
            className="mt-1 pl-3 block w-full rounded-lg border pl-3 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            rows="3"
            placeholder="Enter the Description here..."

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
                value={formData.amountRequired}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
                required
                placeholder="5000"

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
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
                required
                placeholder="eg. Malabe"

              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="border-dashed border-2 border-indigo-200 p-4 rounded-lg bg-white">
          <div className="flex space-x-4 overflow-x-auto w-full">
            {imageUploading && (
              <div className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-center text-lg text-black">{progress}%</p>
              </div>
            )}
            {!imageUploading &&
              downloadURLs.map((fileData, index) => (
                <div key={index} className="relative w-36 h-36 flex-shrink-0">
                  <img
                    src={fileData.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDelete(fileData.ref, index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            {downloadURLs.length === 0 && !imageUploading && (
              <div className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-center text-lg text-black">Add media</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <ImageUpload
              setDownloadURLs={setDownloadURLs}
              setProgress={setProgress}
              setLoading={setImageUploading}
            />
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
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full h-12 pl-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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

          {/* Organization */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="organization"
            >
              Posted Organization Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
                required
                placeholder="eg. Resgional Office Matale"

              />
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
                  id="bankDetails.accountNumber"
                  name="bankDetails.accountNumber"
                  placeholder="eg. 000024242"

                  value={formData.bankDetails.accountNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
                  id="bankDetails.accountHolderName"
                  name="bankDetails.accountHolderName"
                  placeholder="eg. Jagath Bandara"

                  value={formData.bankDetails.accountHolderName}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
                id="bankDetails.bankName"
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
                className="mt-1 block w-full h-12 pl-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
              >
                <option value="">Select</option>
                <option value="BOC Bank">Bank Of ceylon</option>
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
                id="bankDetails.bankBranch"
                name="bankDetails.bankBranch"
                value={formData.bankDetails.bankBranch}
                onChange={handleChange}
                placeholder="eg. Malabe"

                className="mt-1 block w-full h-12 pl-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
                placeholder="eg. Matale Charity Organization"

                id="directCash.orgName"
                name="directCash.orgName"
                value={formData.directCash.orgName}
                onChange={handleChange}
                className="mt-1 block w-full h-12 pl-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
                              placeholder="eg. 066-2247912"

                type="text"
                id="directCash.phone"
                name="directCash.phone"
                value={formData.directCash.phone}
                onChange={handleChange}
                className="mt-1 block w-full h-12 pl-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
                              placeholder="eg. provincial council matale"

                type="text"
                id="directCash.address"
                name="directCash.address"
                value={formData.directCash.address}
                onChange={handleChange}
                className="mt-1 block w-full h-12 pl-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
                value={formData.directCash.additionalField}
                onChange={handleChange}
                className="mt-1 block w-full h-12  pl-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
            value={formData.emergency}
            onChange={handleChange}
            className="mt-1 pl-3 block w-full h-12 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
      </div>
    </form>
  );
};

export default DonationForm;
