import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProgramTable = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editProgram, setEditProgram] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null); // State for zoomed image
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Program/programs');
        setPrograms(response.data.data);
        setFilteredPrograms(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch programs');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = (programs || []).filter(
      (program) =>
        program.title.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query) ||
        program.label.toLowerCase().includes(query) ||
        program.address.toLowerCase().includes(query)
    );
    setFilteredPrograms(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Program/programs/${id}`);
      const updatedPrograms = programs.filter((program) => program._id !== id);
      setPrograms(updatedPrograms);
      setFilteredPrograms(updatedPrograms);
    } catch (err) {
      setError('Failed to delete program');
    }
  };

  const handleEdit = (id) => {
    navigate(`/pupdate/${id}`);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/Program/programs/${editProgram._id}`, editProgram);
      const updatedPrograms = programs.map((program) =>
        program._id === editProgram._id ? editProgram : program
      );
      setPrograms(updatedPrograms);
      setFilteredPrograms(updatedPrograms);
      setShowEditForm(false);
      setEditProgram(null);
    } catch (err) {
      setError('Failed to update program');
    }
  };

  const handleImageClick = (image) => {
    setZoomedImage(image);
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between w-full mb-1 sm:mb-0">
          <h2 className="text-3xl leading-tight text-gray-800 font-bold">Programs</h2>
          <div className="text-end">
            <form className="flex w-full max-w-sm space-x-3">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <button
                className="flex-shrink-0 bg-purple-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
                type="button"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {showEditForm && (
          <div className="mb-8 bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Edit Program</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={editProgram?.title || ''}
                  onChange={(e) => setEditProgram({ ...editProgram, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={editProgram?.description || ''}
                  onChange={(e) => setEditProgram({ ...editProgram, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Location</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={editProgram?.address || ''}
                  onChange={(e) => setEditProgram({ ...editProgram, address: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
              <button
                type="button"
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    Location URL
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((program) => (
                  <tr key={program._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{program.title}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{program.description}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{program.address}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{program.label}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <img
                        src={program.mapImage}
                        alt={program.title}
                        className="w-16 h-16 cursor-pointer"
                        onClick={() => handleImageClick(program.mapImage)}
                      />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <a href={program.locationRedirectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {program.locationRedirectUrl}
                      </a>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button onClick={() => handleEdit(program._id)} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(program._id)} className="text-red-600 hover:text-red-900 ml-4">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {zoomedImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative">
              <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full" />
              <button
                onClick={handleCloseZoom}
                className="absolute top-2 right-2 text-white text-2xl"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramTable;

