import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const ProgramTable = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editProgram, setEditProgram] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [showEnrollmentsModal, setShowEnrollmentsModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Program/programs');
        setPrograms(response.data.data);
        setFilteredPrograms(response.data.data);
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

  const handleEdit = (program) => {
    setEditProgram(program);
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
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

  const handleViewEnrollments = (program) => {
    const enrolled = program.user_enrollments.filter((enrollment) => enrollment.status === 'Enrolled');
    const enrolledEmails = enrolled.map((enrollment) => enrollment.email);
    setEnrolledUsers(enrolledEmails);
    setShowEnrollmentsModal(true);
  };

  const handleCloseModal = () => {
    setShowEnrollmentsModal(false);
    setEnrolledUsers([]);
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
    <div className="container ml-60 p-6 mt-0 mx-auto px-4 sm:px-8">
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
              <div className="mb-4">
                <label className="block text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={editProgram?.startDate?.split('T')[0] || ''}
                  onChange={(e) => setEditProgram({ ...editProgram, startDate: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={editProgram?.endDate?.split('T')[0] || ''}
                  onChange={(e) => setEditProgram({ ...editProgram, endDate: e.target.value })}
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
                    Organizer
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((program) => (
                  <tr key={program._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{program.title}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{program.description}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{program.organizer}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{program.address}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(program.startDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(program.endDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleEdit(program)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline ml-4"
                        onClick={() => handleDelete(program._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="text-green-500 hover:underline ml-4"
                        onClick={() => handleViewEnrollments(program)}
                      >
                        View Enrollments
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showEnrollmentsModal && (
              <Modal isOpen={showEnrollmentsModal} onRequestClose={handleCloseModal}>
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 shadow-lg" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                <h2 className="text-lg font-bold">Enrolled Users</h2>
                <ul>
                  {enrolledUsers.map((email, index) => (
                    <li key={index}>{email}</li>
                  ))}
                </ul>
                
                <button className="mt-auto bg-gray-500 text-white px-4 py-2 rounded-md self-end" onClick={handleCloseModal}>Close</button>
                </div>
                </div>
              </Modal>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramTable;



