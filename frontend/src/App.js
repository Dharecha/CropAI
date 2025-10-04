import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State for the main recommendation form
  const [formData, setFormData] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
  });

  // State for managing UI feedback
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // State specifically for the navbar temperature
  const [navTemperature, setNavTemperature] = useState(null);

  // A ref to allow smooth scrolling to the form
  const formRef = useRef(null);

  // Fetch weather once on page load for the navbar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/weather/?lat=${latitude}&lon=${longitude}`);
          setNavTemperature(Math.round(response.data.temperature));
        } catch (err) {
          console.error("Could not fetch navbar weather.");
        }
      });
    }
  }, []); // Empty array ensures this runs only once

  // Handles changes in the form input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Smoothly scrolls to the form section
  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Gets current weather to populate the form fields
  const handleGetWeather = () => {
    if (navigator.geolocation) {
      setError('');
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/weather/?lat=${latitude}&lon=${longitude}`);
          setFormData(prevData => ({
            ...prevData,
            temperature: response.data.temperature.toFixed(1),
            humidity: response.data.humidity.toFixed(1),
          }));
        } catch (err) {
          setError('Could not fetch weather data. Please enter it manually.');
        }
      }, () => {
        setError('Geolocation is not enabled. Please allow location access.');
      });
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  // Submits the form data to the backend for a crop recommendation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/recommend/', formData);
      setResult(response.data.recommended_crop);
    } catch (err) {
      setError('Failed to get recommendation. Please ensure the backend is running and all fields are correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-logo">KrishiRatna 🌱</div>
        {navTemperature !== null && (
          <div className="navbar-weather">
            ☀️ {navTemperature}°C in Ahmedabad
          </div>
        )}
        <button onClick={handleScrollToForm} className="nav-button">Get Recommendation</button>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <h1>Smarter Farming Starts Here.</h1>
          <p>Get instant, AI-powered crop recommendations tailored for your farm's unique soil and climate conditions in Ahmedabad.</p>
          <button onClick={handleScrollToForm} className="cta-button">Find Your Perfect Crop</button>
        </div>
      </header>

      <section className="how-it-works-section">
        <h2>A Simple Path to a Better Harvest</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">📄</div>
            <h3>1. Enter Your Data</h3>
            <p>Provide your field's data below, or use your current weather to autofill.</p>
          </div>
          <div className="step">
            <div className="step-icon">🧠</div>
            <h3>2. AI Analyzes</h3>
            <p>Our AI analyzes thousands of data points to find the perfect match for Gujarat's climate.</p>
          </div>
          <div className="step">
            <div className="step-icon">🏆</div>
            <h3>3. Get Recommendation</h3>
            <p>Receive an instant recommendation for the most suitable and profitable crop.</p>
          </div>
        </div>
      </section>

      <section ref={formRef} className="form-section">
        <h2>Find Your Perfect Crop</h2>
        <div className="weather-button-container">
          <button type="button" onClick={handleGetWeather} className="weather-button">
            📍 Use Current Location's Weather
          </button>
        </div>

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

        {result && !loading && (
          <div className="result-card">
            <h3>Our Recommendation For You</h3>
            <p className="crop-name">{result}</p>
            <span>This crop is highly suitable for the conditions provided.</span>
          </div>
        )}
        {error && !loading && <p className="error">{error}</p>}
      </section>

      <footer className="footer">
        <p>© 2025 KrishiRatna Ahmedabad | Built with AI for a greener future. GreenCoders</p>
      </footer>
    </div>
  );
}

export default App;