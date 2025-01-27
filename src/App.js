import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [searched, setSearched] = useState(false); // Track if the user has searched

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle the search request
  const handleSearch = async () => {
    setSearched(true); // Mark that search has been done
    try {
      // Send GET request to FastAPI backend with query parameter
      const response = await axios.get('http://localhost:8000/medicines/', {
        params: { query: searchQuery }
      });

      if (response.data.length === 0) {
        alert("No medicines found.");
      } else {
        setMedicines(response.data); // Set response data to the medicines state
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert("Error fetching medicines.");
    }
  };

  return (
    <div className="app-container">
      <div className="search-bar-container">
        <input
          className="search-bar"
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for medicines..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Display medicines or message */}
      {searched && medicines.length === 0 ? (  // Show message only after search
        <p>No medicines found</p>
      ) : (
        <ul>
          {medicines.map((medicine, index) => (
            <li key={index}>
              <h3>{medicine.name}</h3>
              <p>Formula: {medicine.formula}</p>
              <p>Purpose: {medicine.purpose}</p>  {/* Updated from "usage" */}
              <p>Location: {medicine.box_location}</p>  {/* Updated from "location" */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
