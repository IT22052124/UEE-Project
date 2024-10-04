import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DonationTable = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDonation, setEditDonation] = useState(null); // State to handle the donation being edited
  const [showEditForm, setShowEditForm] = useState(false); // Toggle form visibility
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Donation');
        setDonations(response.data.donations);
        setFilteredDonations(response.data.donations); 
      } catch (err) {
        setError('Failed to fetch donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter donations based on title, description, or organization
    const filtered = donations.filter(
      (donation) =>
        donation.title.toLowerCase().includes(query) ||
        donation.description.toLowerCase().includes(query) ||
        donation.location.toLowerCase().includes(query)
    );
    setFilteredDonations(filtered);
  };
  

  // Handle delete donation
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Donation/${id}`);
       
      setDonations(donations.filter((donation) => donation.Id !== id));
      setFilteredDonations(filteredDonations.filter((donation) => donation.Id !== id));
    } catch (err) {
      setError('Failed to delete donation');
    }
  };

  // Handle edit donation (pre-fill the edit form)
  const handleEdit = (id) => {
    navigate(`/update/${id}`);
    
  };

  // Handle update donation
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/Donation/${editDonation.Id}`, editDonation);
      const updatedDonations = donations.map((donation) =>
        donation.Id === editDonation.Id ? editDonation : donation
      );
      setDonations(updatedDonations);
      setFilteredDonations(updatedDonations);
      setShowEditForm(false);
      setEditDonation(null);
    } catch (err) {
      setError('Failed to update donation');
    }
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
          <h2 className="text-3xl leading-tight text-gray-800 font-bold">Donations</h2>
          <div className="text-end">
            <form className="flex w-full max-w-sm space-x-3">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Search donations..."
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

        {/* Edit Form */}
        {showEditForm && (
          <div className="mb-8 bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Edit Donation</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={editDonation?.title}
                  onChange={(e) => setEditDonation({ ...editDonation, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={editDonation?.description}
                  onChange={(e) => setEditDonation({ ...editDonation, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Amount Required</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={editDonation?.amountRequired}
                  onChange={(e) => setEditDonation({ ...editDonation, amountRequired: e.target.value })}
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
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount Required
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount Raised
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((donation) => (
                    <tr key={donation.Id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{donation.Id}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{donation.title}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{donation.description}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{donation.amountRequired}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{donation.amountRaised}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                          <span className="relative">{donation.category}</span>
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{donation.location}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{donation.organization}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {donation.bankDetails?.bankName}<br />
                          {donation.directCash?.orgName}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleEdit(donation.Id)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(donation.Id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                      No donations available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
              <span className="text-xs xs:text-sm text-gray-900">
                Showing 1 to 4 of 50 Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                  Prev
                </button>
                <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationTable;