import React, { useState } from 'react';
import axios from 'axios';
import './css/AddShop.css';

function AddShop() {
  // State variables for form fields
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [packageType, setPackageType] = useState('');
  const [message, setMessage] = useState(null); // For success or error message
  const [isLoading, setIsLoading] = useState(false); // For form loading state

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setMessage(null); // Clear previous message

    const shopData = {
      shopName,
      shopType,
      admin: {
        name: adminName,
        email: adminEmail,
      },
      packageType,
    };

    try {
      const response = await axios.post('http://localhost:3001/shop', shopData);
      
      if (response.status === 200) {
        // Success response
        setMessage({ text: 'Shop added successfully!', type: 'success' });
        // Clear form fields
        setShopName('');
        setShopType('');
        setAdminName('');
        setAdminEmail('');
        setPackageType('');
      } else {
        // Error response
        setMessage({ text: 'Error: Could not add shop.', type: 'error' });
      }
    } catch (error) {
      // Network or other error
      setMessage({ text: 'Error: Unable to connect to the server.', type: 'error' });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="add-shop-wrapper">
      {/* Title Section */}
      <div className="title-section">
        <h2>Register New Shop</h2>
      </div>

      {/* Message Section */}
      {message && (
        <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* Form Section */}
      <div className="form-section">
        <form onSubmit={handleSubmit} className="shop-form">
          <div className="row">
            <div className="field-group">
              <label htmlFor="shopName">Shop Name:</label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="field-group">
              <label htmlFor="shopType">Shop Type:</label>
              <select
                id="shopType"
                name="shopType"
                value={shopType}
                onChange={(e) => setShopType(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="">Select Shop Type</option>
                <option value="medical">Medical</option>
                <option value="general">General</option>
                <option value="bakery">Clothes</option>
                <option value="footwear">Footwear</option>
                <option value="electrical">Electrical</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="field-group">
              <label htmlFor="adminName">Owner Name:</label>
              <input
                type="text"
                id="adminName"
                name="adminName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="field-group">
              <label htmlFor="adminEmail">Owner Email:</label>
              <input
                type="email"
                id="adminEmail"
                name="adminEmail"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="row">
            <div className="field-group">
              <label htmlFor="packageType">Package Type:</label>
              <select
                id="packageType"
                name="packageType"
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="">Select Package</option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Shop'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddShop;
