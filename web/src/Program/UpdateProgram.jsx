import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const ProgramUpdateForm = () => {
  const { id } = useParams(); // Get the program ID from the URL parameters
  const [program, setProgram] = useState({
    title: '',
    description: '',
    label: '',
    address: '',
    locationRedirectUrl: '',
    startDate: "", // New start date field
    endDate: "",   // New end date field
    organizer: "",
  });

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Fetch the existing program data
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/Program/programs/${id}`);
        const programData = response.data.data;
        setProgram({
          title: programData.title,
          description: programData.description,
          label: programData.label,
          address: programData.address,
          locationRedirectUrl: programData.locationRedirectUrl,
          startDate: programData.startDate,
        endDate: programData.endDate,
        organizer: programData.organizer
        });
        setDownloadURLs([{ url: programData.mapImage[0] }]); // Set the current image URL
      } catch (err) {
        setError('Failed to fetch program data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setProgram({ ...program, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...program,
     
    };

    try {
      await axios.put(`http://localhost:5000/Program/programs/${id}`, updatedData);
      setSuccessMessage('Program updated successfully!');
      setError('');
      setTimeout(() => {
        navigate('/programtable'); // Navigate back to the program list after a successful update
      }, 2000);
    } catch (err) {
      setError('Failed to update program');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl ml-80 mr-15 mx-auto p-8 bg-gradient-to-br from-blue-50 to-blue-200 shadow-xl rounded-lg mt-5 border border-indigo-100">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-indigo-700">Update Program</h2>

      {successMessage && (
        <div className="bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-blue-200 shadow-md rounded-lg p-4">
        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={program.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={program.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
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
            value={program.organizer}
            onChange={handleChange}
            className="mt-1 block w-full  pl-3 rounded-lg h-12 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            required
          />
        </div>

        {/* Label Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
          <select
            name="label"
            value={program.label}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={program.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Location Redirect URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Location Redirect URL</label>
          <input
            type="url"
            name="locationRedirectUrl"
            value={program.locationRedirectUrl}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            pattern="https?://.+" // Ensures the URL starts with http/https
            required
          />
          <small className="text-gray-500">Please enter a valid URL (starting with http:// or https://).</small>
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
            value={program.startDate}
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
            value={program.endDate}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 rounded-lg h-12 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
            required
          />
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
          >
            Update
          </button>
          <button
            type="button"
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-200"
            onClick={() => navigate('/programtable')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramUpdateForm;
