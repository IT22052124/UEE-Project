// src/DonationTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DonationTable = () => {
  const [donations, setDonations] = useState([]); // Ensure initial state is an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Donation'); // Replace with your API endpoint
        console.log(response.data); // Log the response data to check its structure
        setDonations(response.data.donations); // Ensure this matches the actual data structure returned by your API
      } catch (err) {
        setError('Failed to fetch donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Amount Required</th>
            <th className="py-2 px-4 border-b">Amount Raised</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Location</th>
            <th className="py-2 px-4 border-b">Organization</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(donations) && donations.length > 0 ? (
            donations.map((donation) => (
              <tr key={donation.Id}>
                <td className="py-2 px-4 border-b">{donation.Id}</td>
                <td className="py-2 px-4 border-b">{donation.title}</td>
                <td className="py-2 px-4 border-b">{donation.description}</td>
                <td className="py-2 px-4 border-b">{donation.amountRequired}</td>
                <td className="py-2 px-4 border-b">{donation.amountRaised}</td>
                <td className="py-2 px-4 border-b">{donation.category}</td>
                <td className="py-2 px-4 border-b">{donation.location}</td>
                <td className="py-2 px-4 border-b">{donation.organization}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-2 px-4 text-center">No donations available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DonationTable;
