import React, { useState, useEffect } from 'react';
import './ProductSelector.css';

const API_BASE_URL = 'http://localhost:8000';

const PRODUCTS = [
  { name: 'Tomato', icon: '🍅', color: '#f44336' },
  { name: 'Potato', icon: '🥔', color: '#ff9800' },
  { name: 'Wheat', icon: '🌾', color: '#ffc107' },
  { name: 'Apple', icon: '🍎', color: '#4caf50' },
  { name: 'Banana', icon: '🍌', color: '#ffeb3b' },
];

const ProductSelector = ({ onProductChange }) => {
  const [selectedProduct, setSelectedProduct] = useState('Tomato');
  const [cargoValue, setCargoValue] = useState(1000000);
  const [rescuePoints, setRescuePoints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProductInfo();
  }, []);

  const fetchProductInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/product`);
      const data = await response.json();
      setSelectedProduct(data.product_type || 'Tomato');
      setCargoValue(data.cargo_value || 1000000);
      
      // Fetch rescue points
      const rescueResponse = await fetch(`${API_BASE_URL}/api/rescue-points`);
      const rescueData = await rescueResponse.json();
      setRescuePoints(rescueData.rescue_points || []);
    } catch (error) {
      console.error('Error fetching product info:', error);
    }
  };

  const handleProductChange = async (productName) => {
    setSelectedProduct(productName);
    setLoading(true);
    
    try {
      await fetch(`${API_BASE_URL}/api/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_type: productName,
          cargo_value: cargoValue
        })
      });
      
      // Fetch updated rescue points
      const rescueResponse = await fetch(`${API_BASE_URL}/api/rescue-points`);
      const rescueData = await rescueResponse.json();
      setRescuePoints(rescueData.rescue_points || []);
      
      if (onProductChange) {
        onProductChange(productName);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCargoValueChange = async (value) => {
    const numValue = parseFloat(value) || 1000000;
    setCargoValue(numValue);
    
    try {
      await fetch(`${API_BASE_URL}/api/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_type: selectedProduct,
          cargo_value: numValue
        })
      });
    } catch (error) {
      console.error('Error updating cargo value:', error);
    }
  };

  const selectedProductData = PRODUCTS.find(p => p.name === selectedProduct) || PRODUCTS[0];

  return (
    <div className="product-selector card">
      <h2 className="card-title">
        <span className="product-icon" style={{ color: selectedProductData.color }}>
          {selectedProductData.icon}
        </span>
        Product & Cargo Information
      </h2>

      <div className="product-selection">
        <div className="product-label">Select Product Type:</div>
        <div className="product-grid">
          {PRODUCTS.map((product) => (
            <button
              key={product.name}
              className={`product-card ${selectedProduct === product.name ? 'active' : ''}`}
              onClick={() => handleProductChange(product.name)}
              style={{
                borderColor: selectedProduct === product.name ? product.color : 'transparent',
                backgroundColor: selectedProduct === product.name 
                  ? `${product.color}20` 
                  : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <span className="product-card-icon" style={{ color: product.color }}>
                {product.icon}
              </span>
              <span className="product-card-name">{product.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cargo-value-section">
        <label className="cargo-label">Cargo Value (₹):</label>
        <div className="cargo-input-group">
          <input
            type="number"
            className="cargo-input"
            value={cargoValue}
            onChange={(e) => handleCargoValueChange(e.target.value)}
            min="10000"
            step="10000"
          />
          <span className="cargo-display">₹{cargoValue.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {rescuePoints.length > 0 && (
        <div className="rescue-points-preview">
          <div className="rescue-label">Available Rescue Points:</div>
          <div className="rescue-list">
            {rescuePoints.slice(0, 3).map((point, index) => (
              <div key={index} className="rescue-point-item">
                <span className="rescue-point-name">{point.name}</span>
                <span className="rescue-point-value">{point.rescue_value_pct}% Value</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-indicator">Updating...</div>
      )}
    </div>
  );
};

export default ProductSelector;
