import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Import the CSS file

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState(null);  // For handling errors
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    formula: '',
    purpose: '',
    box_location: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`/api/medicines?search_query=${searchQuery}`);
      if (response.data.length === 0) {
        setError('No medicines found.');
      } else {
        setMedicines(response.data);
        setError(null);  // Reset error if data fetch is successful
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setError('There was an error fetching the medicines. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    setNewMedicine({
      ...newMedicine,
      [e.target.name]: e.target.value
    });
  };

  const addMedicine = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/medicines', newMedicine);
      setSuccessMessage('Medicine added successfully!');
      setNewMedicine({
        name: '',
        formula: '',
        purpose: '',
        box_location: ''
      });  // Reset the form fields
    } catch (error) {
      console.error('Error adding medicine:', error);
      setError('There was an error adding the medicine. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <h1>Medical Shop</h1>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for medicines"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <button onClick={fetchMedicines}>Search</button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Success Message */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Display Medicines */}
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine.id}>
            <p><strong>{medicine.name}</strong></p>
            <p>Formula: {medicine.formula}</p>
            <p>Purpose: {medicine.purpose}</p>
            <p>Box Location: {medicine.box_location}</p>
          </li>
        ))}
      </ul>

      {/* Add Medicine Form */}
      <div>
        <h2>Add New Medicine</h2>
        <form onSubmit={addMedicine}>
          <input
            type="text"
            name="name"
            placeholder="Medicine Name"
            value={newMedicine.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="formula"
            placeholder="Formula"
            value={newMedicine.formula}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="purpose"
            placeholder="Purpose"
            value={newMedicine.purpose}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="box_location"
            placeholder="Box Location"
            value={newMedicine.box_location}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add Medicine</button>
        </form>
      </div>
    </div>
  );
}

export default App;
