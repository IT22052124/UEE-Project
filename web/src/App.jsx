import { useState } from "react";
import "./App.css";
import DonationForm from "./Donation/Donation"; // Ensure this path is correct
import Table from "./Donation/Table"; // Ensure this path is correct
import Sidebar from "./shared/components/Sidebar"; // Ensure this path is correct
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import DD from "./Donation/dd";
import EditDonation from "./Donation/EditDonation";
import ProgramForm from "./Program/Program"; 
import ProgramTable from "./Program/Table";
import EditProgram from "./Program/UpdateProgram";
import Dashboard from "./Donation/Dashboard";
import Login from "./Login/login";

function App() {
  const [count, setCount] = useState(0);
  
  // Custom hook to get the current location
  const location = useLocation();
  
  // Check if the current path is the login path
  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex">
      {!isLoginPage && <Sidebar />} {/* Sidebar only renders if not on login page */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} />
          {/* This route shows DD component */}
          <Route path="/donation" element={<DonationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/table" element={<Table />} />
          <Route path="/update/:id" element={<EditDonation />} />
          <Route path="/program" element={<ProgramForm />} />
          <Route path="/programtable" element={<ProgramTable />} />
          <Route path="/pupdate/:id" element={<EditProgram />} />
          {/* Add additional routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
