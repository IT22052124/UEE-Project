import { useState } from 'react';
import './App.css';
import DonationForm from './Donation/Donation'; // Ensure this path is correct
import Table from './Donation/Table'; // Ensure this path is correct
import Sidebar from '../shared/components/Sidebar'; // Ensure this path is correct
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DD from "./Donation/dd";
import EditDonation from './Donation/EditDonation'
 
function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="flex">
        <Sidebar /> {/* Sidebar is always visible in this layout */}
        <div className="flex-grow">
          <Routes>
            <Route path="/i" element={<DD />} /> {/* This route shows DD component */}
            <Route path="/donation" element={<DonationForm />} />
            <Route path="/table" element={<Table />} />
            <Route path="/update/:id" element={<EditDonation />} />
            {/* Add additional routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
