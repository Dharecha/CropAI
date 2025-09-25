import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

// You can find simple icons online (e.g., from flaticon.com) and place them in src/assets
// Or use an icon library like React-Icons

function App() {
  const [formData, setFormData] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
  });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Create a ref for the form section
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/recommend/', formData);
      setResult(response.data.recommended_crop);
    } catch (err) {
      setError('Failed to get recommendation. Please ensure the backend server is running and check your input values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* --- Navigation Bar --- */}
      <nav className="navbar">
        <div className="navbar-logo">CropAI 🌾</div>
        <button onClick={handleScrollToForm} className="nav-button">Get Recommendation</button>
      </nav>

      {/* --- Hero Section --- */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Smarter Farming Starts Here.</h1>
          <p>Get instant, AI-powered crop recommendations tailored for your farm's unique soil and climate conditions.</p>
          <button onClick={handleScrollToForm} className="cta-button">Find Your Perfect Crop</button>
        </div>
      </header>

      {/* --- How It Works Section --- */}
      <section className="how-it-works-section">
        <h2>A Simple Path to a Better Harvest</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">📄</div>
            <h3>1. Enter Your Data</h3>
            <p>Provide your field's soil and weather data in the form below.</p>
          </div>
          <div className="step">
            <div className="step-icon">🧠</div>
            <h3>2. AI Analyzes</h3>
            <p>Our AI analyzes thousands of data points to find the perfect match.</p>
          </div>
          <div className="step">
            <div className="step-icon">🏆</div>
            <h3>3. Get Recommendation</h3>
            <p>Receive an instant recommendation for the most suitable crop.</p>
          </div>
        </div>
      </section>

      {/* --- The Form Section --- */}
      <section ref={formRef} className="form-section">
        <h2>Find Your Perfect Crop</h2>
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
          <button type="submit" className="cta-button form-button" disabled={loading}>
            {loading ? 'Analyzing...' : 'Get Recommendation'}
          </button>
        </form>

        {/* --- Result Display --- */}
        {result && !loading && (
          <div className="result-card">
            <h3>Our Recommendation For You</h3>
            <p className="crop-name">{result}</p>
            <span>This crop is highly suitable for the conditions provided.</span>
          </div>
        )}
        {error && !loading && <p className="error">{error}</p>}
      </section>

      {/* --- Footer --- */}
      <footer className="footer">
        <p>© 2025 CropAI Ahmedabad | Built with AI for a greener future.</p>
      </footer>
    </div>
  );
}

export default App;