import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import Tailwind CSS
import './App.css'


import DonationForm from './Donation/DonationForm';
const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {


  return (
    <>
    <h1>jii</h1>
      <DonationForm/>
    </>
  )
}

export default App
