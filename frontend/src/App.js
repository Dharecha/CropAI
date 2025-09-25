import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
  });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setError('');

    try {
      // The "waiter" takes the order to the kitchen's API address
      const response = await axios.post('http://127.0.0.1:8000/api/recommend/', formData);
      setResult(`Recommended Crop: ${response.data.recommended_crop}`);
    } catch (err) {
      setError('Failed to get recommendation. Please ensure the backend server is running and check your input values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Crop Recommendation System 🌾</h1>
        <p>Enter the soil and weather conditions to get a crop recommendation.</p>
        <form onSubmit={handleSubmit} className="crop-form">
          <div className="form-grid">
            <input type="number" name="N" value={formData.N} onChange={handleChange} placeholder="Nitrogen (N)" required />
            <input type="number" name="P" value={formData.P} onChange={handleChange} placeholder="Phosphorus (P)" required />
            <input type="number" name="K" value={formData.K} onChange={handleChange} placeholder="Potassium (K)" required />
            <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="Temperature (°C)" required />
            <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} placeholder="Humidity (%)" required />
            <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} placeholder="Soil pH" required />
            <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} placeholder="Rainfall (mm)" required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
          </button>
        </form>
        {result && <h2 className="result">{result}</h2>}
        {error && <p className="error">{error}</p>}
      </header>
    </div>
  );
}

export default App;