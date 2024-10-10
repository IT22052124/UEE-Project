import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Edit, Trash2, Search, DollarSign, Users, AlertTriangle, BarChart2, TrendingUp, Calendar } from 'lucide-react';

const EnhancedDonationDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDescription, setExpandedDescription] = useState({});
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

  const toggleDescription = (id) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEdit = (id) => {
    navigate(`/update/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  const totalDonations = donations.length;
  const totalAmountRaised = donations.reduce((sum, donation) => sum + donation.amountRaised, 0);
  const emergencyDonations = donations.filter(donation => donation.emergency === "yes").length;
  const averageDonationAmount = totalAmountRaised / totalDonations;

  const categoryData = donations.reduce((acc, donation) => {
    acc[donation.category] = (acc[donation.category] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  const monthlyDonationData = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 5000 },
    { name: 'Apr', amount: 2780 },
    { name: 'May', amount: 1890 },
    { name: 'Jun', amount: 2390 },
  ];

  const topDonors = [
    { name: 'John Doe', amount: 5000 },
    { name: 'Jane Smith', amount: 4500 },
    { name: 'Bob Johnson', amount: 4000 },
    { name: 'Alice Brown', amount: 3500 },
    { name: 'Charlie Davis', amount: 3000 },
  ];

  return (
    <div className="min-h-screen ml-64 bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Donation Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard icon={<BarChart2 size={24} />} title="Total Donations" value={totalDonations} />
          <DashboardCard icon={<DollarSign size={24} />} title="Total Amount Raised" value={`$${totalAmountRaised.toLocaleString()}`} />
          <DashboardCard icon={<AlertTriangle size={24} />} title="Emergency Donations" value={emergencyDonations} />
          <DashboardCard icon={<TrendingUp size={24} />} title="Avg. Donation" value={`$${averageDonationAmount.toFixed(2)}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Donations by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Monthly Donations</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyDonationData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Donations</h2>
            <ul className="space-y-4">
              {donations.slice(0, 5).map(donation => (
                <li key={donation.Id} className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">{donation.title}</span>
                  <span className="text-green-600 font-semibold">${donation.amountRaised}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Top Donors</h2>
            <ul className="space-y-4">
              {topDonors.map((donor, index) => (
                <li key={index} className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">{donor.name}</span>
                  <span className="text-blue-600 font-semibold">${donor.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

       
            </div>
          </div>
        
      
    
  );
};

const DashboardCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center transform transition-all hover:scale-105">
    <div className="rounded-full bg-blue-100 p-3 mr-4">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const getCategoryColor = (category) => {
  const colors = {
    Health: "bg-green-100 text-green-800",
    Education: "bg-blue-100 text-blue-800",
    Environment: "bg-teal-100 text-teal-800",
    Disaster: "bg-yellow-100 text-yellow-800",
    Hunger: "bg-orange-100 text-orange-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

export default EnhancedDonationDashboard;