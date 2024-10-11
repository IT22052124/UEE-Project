import React, { useState } from "react";
import axios from "axios";


const ProgramForm = () => {
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    label: "", // Now will hold the selected option
    address: "",
    locationRedirectUrl: "",
    startDate: "", // New start date field
    endDate: "",   // New end date field
    organizer: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        mapImage: e.target.files[0], // Store the selected file
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

    // Date validation: Ensure endDate is not earlier than startDate
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end < start) {
      setError("End date cannot be earlier than the start date.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("label", formData.label);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("locationRedirectUrl", formData.locationRedirectUrl);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append("organizer", formData.organizer);

    try {
      const response = await axios.post("http://localhost:5000/Program", {
        title: formData.title,
        description: formData.description,
        label: formData.label,
        address: formData.address,
        locationRedirectUrl: formData.locationRedirectUrl,
        startDate: formData.startDate,
        endDate: formData.endDate,
        organizer: formData.organizer
        
      });
      setSuccess("Community program created successfully!");
      setError("");
      setFormData({
        title: "",
        description: "",
        label: "",
        address: "",
        locationRedirectUrl: "",
        startDate: "",
        endDate: "",
        organizer: "",
      });
    } catch (err) {
      setError("Failed to create program. Please try again.");
      setSuccess("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl ml-80 mr-15 mx-auto p-8 bg-gradient-to-br from-blue-50 to-blue-200 shadow-xl rounded-lg mt-5 border border-indigo-100"
    >
      <h2 className="text-4xl font-extrabold mb-6 text-center text-indigo-700">
        Create a Community Program
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

      <div className="space-y-6">
        {/* Title */}
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
            placeholder="Enter the title here"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full  pl-3 rounded-lg h-12 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
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
            placeholder="Enter the Description here"
            onChange={handleChange}
            className="mt-1 pl-3 block w-full rounded-lg border pl-3 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            rows="4"
            required
          />
        </div>

        {/* Organizer */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="organizer"
          >
            Organizer
          </label>
          <input
            type="text"
            id="organizer"
            name="organizer"
            placeholder="Enter the Organizer here"
            value={formData.organizer}
            onChange={handleChange}
            className="mt-1 block w-full  pl-3 rounded-lg h-12 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            required
          />
        </div>

        {/* Label */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="label"
          >
            Label
          </label>
          <select
            id="label"
            name="label"
            value={formData.label}
            onChange={handleChange}
            className="mt-1 block w-full  pl-3 rounded-lg h-12 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            required
          >
            <option value="">Select a program label</option>
            <option value="Education">Education</option>
            <option value="Medical">Medical</option>
            <option value="Employment">Employment</option>
            <option value="Housing">Housing</option>
            <option value="Food Assistance">Food Assistance</option>
            <option value="Community Service">Community Service</option>
            <option value="Emergency Response">Emergency Response</option>
          </select>
        </div>

        {/* Address */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="address"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter the address here"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full  pl-3 rounded-lg h-12 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            required
          />
        </div>

        {/* Location Redirect URL */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="locationRedirectUrl"
          >
            Location Redirect URL
          </label>
          <input
            type="url"
            id="locationRedirectUrl"
            name="locationRedirectUrl"
            placeholder="Enter the URL here"
            value={formData.locationRedirectUrl}
            onChange={handleChange}
            className="mt-1 block w-full  pl-3 rounded-lg h-12 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            required
          />
        </div>

        {/* Start Date */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="startDate"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 rounded-lg h-12 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="endDate"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 rounded-lg h-12 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            required
          />
        </div>

          

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Program
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProgramForm;
