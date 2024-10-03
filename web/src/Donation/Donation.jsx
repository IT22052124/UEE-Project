// src/DonationForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const DonationForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amountRaised: 0,
    amountRequired: '',
    location: '',
    category: '',
    bankDetails: {
      accountNumber: '',
      bankName: '',
      accountHolderName: '',
    },
    directCash: '',
    organization: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('bankDetails.')) {
      const fieldName = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
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
    try {
      const response = await axios.post('http://localhost:5000/Donation', formData);
      setSuccess('Donation created successfully!');
      setError('');
      // Reset form data if needed
      setFormData({
        title: '',
        description: '',
        amountRaised: 0,
        amountRequired: '',
        location: '',
        category: '',
        bankDetails: {
          accountNumber: '',
          bankName: '',
          accountHolderName: '',
        },
        directCash: '',
        organization: '',
      });
    } catch (err) {
      setError('Failed to create donation. Please try again.');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Create Donation</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <div className="mb-4">
        <label className="block mb-2" htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2" htmlFor="amountRequired">Amount Required</label>
        <input
          type="number"
          id="amountRequired"
          name="amountRequired"
          value={formData.amountRequired}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2" htmlFor="amountRaised">Amount Raised</label>
        <input
          type="number"
          id="amountRaised"
          name="amountRaised"
          value={formData.amountRaised}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2" htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2" htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Select a category</option>
          <option value="food">Food</option>
          <option value="cloth">Cloth</option>
          <option value="money">Money</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2" htmlFor="organization">Organization</label>
        <input
          type="text"
          id="organization"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2" htmlFor="directCash">Direct Cash Allowed?</label>
        <input
          type="text"
          id="directCash"
          name="directCash"
          value={formData.directCash}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <h3 className="text-lg font-bold mb-2">Bank Details</h3>
      <div className="mb-4">
        <label className="block mb-2" htmlFor="bankDetails.accountNumber">Account Number</label>
        <input
          type="text"
          id="bankDetails.accountNumber"
          name="bankDetails.accountNumber"
          value={formData.bankDetails.accountNumber}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2" htmlFor="bankDetails.bankName">Bank Name</label>
        <input
          type="text"
          id="bankDetails.bankName"
          name="bankDetails.bankName"
          value={formData.bankDetails.bankName}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2" htmlFor="bankDetails.accountHolderName">Account Holder Name</label>
        <input
          type="text"
          id="bankDetails.accountHolderName"
          name="bankDetails.accountHolderName"
          value={formData.bankDetails.accountHolderName}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit Donation</button>
    </form>
  );
};

export default DonationForm;
