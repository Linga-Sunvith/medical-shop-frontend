import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    formula: "",
    purpose: "",
    box_location: "",
  });
  const [editMedicine, setEditMedicine] = useState(null);
  const [message, setMessage] = useState("");

  const fetchMedicines = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/medicines", {
        params: { search_query: searchQuery },
      });
      setMedicines(response.data);
    } catch {
      setMessage("Error fetching medicines.");
    }
  }, [searchQuery]);

  useEffect(() => {
    if (activeTab === "manage") {
      fetchMedicines();
    }
  }, [activeTab, fetchMedicines]);

  const handleInputChange = (e) => {
    setNewMedicine({ ...newMedicine, [e.target.name]: e.target.value });
  };

  const addOrUpdateMedicine = async (e) => {
    e.preventDefault();
    try {
      if (editMedicine) {
        await axios.put(`http://localhost:8000/api/medicines/${editMedicine.id}`, newMedicine);
        setMessage("Medicine updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/medicines", newMedicine);
        setMessage("Medicine added successfully!");
      }
      setNewMedicine({ name: "", formula: "", purpose: "", box_location: "" });
      setEditMedicine(null);
      fetchMedicines();
    } catch {
      setMessage("Error saving medicine.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/medicines/${id}`);
      setMessage("Medicine deleted successfully!");
      fetchMedicines();
    } catch {
      setMessage("Error deleting medicine.");
    }
  };

  // Called when Search button is clicked in the Search tab.
  const handleSearch = () => {
    fetchMedicines();
    setShowResults(true);
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>Medical Shop</h1>
        <div className="tabs">
          <button className={activeTab === "search" ? "active" : ""} onClick={() => { setActiveTab("search"); setShowResults(false); }}>
            Search
          </button>
          <button className={activeTab === "add" ? "active" : ""} onClick={() => setActiveTab("add")}>
            Add Medicine
          </button>
          <button className={activeTab === "manage" ? "active" : ""} onClick={() => setActiveTab("manage")}>
            Manage Medicines
          </button>
        </div>
      </nav>

      {message && <p className="message">{message}</p>}

      {activeTab === "search" && (
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search medicine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>
              <FaSearch /> Search
            </button>
          </div>
          {searchQuery && <p className="search-info">Searching for: {searchQuery}</p>}
          {showResults && (
            <div className="search-results">
              {medicines.length > 0 ? (
                medicines.map((med) => (
                  <div key={med.id} className="medicine-card">
                    <h3>{med.name}</h3>
                    <p><strong>Formula:</strong> {med.formula}</p>
                    <p><strong>Purpose:</strong> {med.purpose}</p>
                    <p><strong>Box Location:</strong> {med.box_location}</p>
                  </div>
                ))
              ) : (
                <p>No medicines found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "add" && (
        <div className="form-container">
          <h2>{editMedicine ? "Update Medicine" : "Add Medicine"}</h2>
          <form onSubmit={addOrUpdateMedicine}>
            <input
              type="text"
              name="name"
              placeholder="Name"
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
            <button type="submit" className="add-btn">
              <FaPlus /> {editMedicine ? "Update" : "Add"} Medicine
            </button>
          </form>
        </div>
      )}

      {activeTab === "manage" && (
        <div className="manage-container">
          <h2>Manage Medicines</h2>
          <div className="medicine-grid">
            {medicines.map((med) => (
              <div key={med.id} className="medicine-card-manage">
                <h3>{med.name}</h3>
                <p><strong>Formula:</strong> {med.formula}</p>
                <p><strong>Purpose:</strong> {med.purpose}</p>
                <p><strong>Box Location:</strong> {med.box_location}</p>
                <div className="card-buttons">
                  <button onClick={() => setEditMedicine(med)} className="edit-btn">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(med.id)} className="delete-btn">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
