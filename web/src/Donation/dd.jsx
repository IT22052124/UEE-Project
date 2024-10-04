import React from "react";
import DonationForm from "./Donation";
import Sidebar from "../../shared/components/Sidebar";

function DD() {
  return (
    <div className="flex">
      
      <div className="flex-grow">
        <DonationForm />
      </div>
    </div>
  );
}

export default DD;
