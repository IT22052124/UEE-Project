import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DonationTable = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDonation, setEditDonation] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/Donation");
        setDonations(response.data.donations);
        setFilteredDonations(response.data.donations);
      } catch (err) {
        setError("Failed to fetch donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = donations.filter(
      (donation) =>
        donation.title.toLowerCase().includes(query) ||
        donation.description.toLowerCase().includes(query) ||
        donation.location.toLowerCase().includes(query)
    );
    setFilteredDonations(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Donation/${id}`);
      setDonations(donations.filter((donation) => donation.Id !== id));
      setFilteredDonations(
        filteredDonations.filter((donation) => donation.Id !== id)
      );
    } catch (err) {
      setError("Failed to delete donation");
    }
  };

  const handleEdit = (id) => {
    navigate(`/update/${id}`);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/Donation/${editDonation.Id}`,
        editDonation
      );
      const updatedDonations = donations.map((donation) =>
        donation.Id === editDonation.Id ? editDonation : donation
      );
      setDonations(updatedDonations);
      setFilteredDonations(updatedDonations);
      setShowEditForm(false);
      setEditDonation(null);
    } catch (err) {
      setError("Failed to update donation");
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
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between w-full mb-1 sm:mb-0">
          <h2 className="text-3xl leading-tight text-gray-800 font-bold">
            Donations
          </h2>
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
              <button className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-blue-900 to-blue-400 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20">
                <span className="text-lg">Search</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-white/20"></div>
                </div>
              </button>
            </form>
          </div>
        </div>

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
                  onChange={(e) =>
                    setEditDonation({ ...editDonation, title: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={editDonation?.description}
                  onChange={(e) =>
                    setEditDonation({
                      ...editDonation,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Amount Required</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={editDonation?.amountRequired}
                  onChange={(e) =>
                    setEditDonation({
                      ...editDonation,
                      amountRequired: e.target.value,
                    })
                  }
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
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Amount Required
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Amount Raised
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-blue-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation, index) => (
                  <tr
                    key={donation.Id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } transition duration-200 hover:bg-gray-300`}
                  >
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      {donation.Id}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      {donation.title}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      {donation.description}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      {donation.amountRequired}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      {donation.amountRaised}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      {donation.category}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      {donation.location}
                    </td>
                     <td className="px-5 py-5 border-b border-gray-200  text-sm">
                        <div className="flex space-x-4">
                          {/* Edit Button */}
                          <div className="group relative">
                            <button onClick={() => handleEdit(donation.Id)}>
                              <svg
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="w-6 h-6 hover:scale-125 duration-200 hover:stroke-blue-500" // Decreased size
                              >
                                <path d="M4 21h16M15 2l5 5-10 10H4v-5L15 2z" />
                              </svg>
                            </button>
                            <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                              Edit
                              <span></span>
                            </span>
                          </div>

                          {/* Delete Button */}
                          <div className="group relative">
                            <button onClick={() => handleDelete(donation.Id)}>
                              <svg
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="w-6 h-6 hover:scale-125 duration-200 hover:stroke-red-500" // Decreased size
                              >
                                <path d="M3 6h18M3 6h1.5a1 1 0 011-1h12a1 1 0 011 1H21m-3 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6M9 10v4M15 10v4" />
                              </svg>
                            </button>
                            <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                              Delete
                              <span></span>
                            </span>
                          </div>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationTable;
