import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUpload from "../shared/ImageUpload"; // Assuming this component is used for image uploading

const ProgramUpdateForm = () => {
  const { id } = useParams(); // Get the program ID from the URL parameters
  const [program, setProgram] = useState({
    title: '',
    description: '',
    label: '',
    address: '',
    locationRedirectUrl: '',
    mapImage: '', // Store the image URL
  });
  const [downloadURLs, setDownloadURLs] = useState([]); // Store the uploaded image URLs
  const [imageUploading, setImageUploading] = useState(false);
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
          mapImage: programData.mapImage[0], // Assuming it's a single image URL
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
      mapImage: downloadURLs.map((fileData) => fileData.url), // Updated images
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
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6">Update Program</h2>

      {successMessage && (
        <div className="bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={program.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={program.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="4"
            required
          />
        </div>

        {/* Label Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Label</label>
          <select
            name="label"
            value={program.label}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
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
          <label className="block text-gray-700 font-bold mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={program.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Location Redirect URL */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Location Redirect URL</label>
          <input
            type="url"
            name="locationRedirectUrl"
            value={program.locationRedirectUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            pattern="https?://.+" // Ensures the URL starts with http/https
            required
          />
          <small className="text-gray-500">Please enter a valid URL (starting with http:// or https://).</small>
        </div>

        {/* Map Image Upload & Preview */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Map Image</label>
          <div className="flex space-x-4">
            {imageUploading && (
              <div className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-center text-lg text-black">{progress}%</p>
              </div>
            )}
            {!imageUploading &&
              downloadURLs.map((fileData, index) => (
                <div key={index} className="relative w-36 h-36">
                  <img
                    src={fileData.url}
                    alt={`Map ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setDownloadURLs(downloadURLs.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            {downloadURLs.length === 0 && !imageUploading && (
              <div className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-center text-lg text-black">Add map image</p>
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

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Update Program
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramUpdateForm;
