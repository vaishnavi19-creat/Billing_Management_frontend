import React, { useRef, useState } from 'react';
import axios from 'axios'; 
import './css/AddCustomer.css'; 

function AddCustomer() {
  const formRef = useRef(null); 
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Axios API call
      const response = await axios.post('http://localhost:3001/customer', customerData);

      if (response.status === 200 || response.status === 201) { // Success response
        setMessage({ text: 'Customer added successfully!', type: 'success' });
        setCustomerData({ name: '', email: '', phone: '', address: '' });
        formRef.current.scrollIntoView({ behavior: 'smooth' }); // Scrolls form into view
      } else {
        setMessage({ text: 'Error: Could not add customer.', type: 'error' });
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Error: Unable to connect to the server.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-customer-wrapper" ref={formRef}>
      {/* Title Section */}
      <div className="title-section">
        <h2>Add Customer</h2>
      </div>

      {/* Form Section */}
      <div className="form-section">
        {message && (
          <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="customer-form">
          <div className="row">
            <div className="field-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="field-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="row">
            <div className="field-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="field-group">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={customerData.address}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Customer'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;













