import React, { useRef, useState } from 'react';
import axios from 'axios'; 
import './AddAdminCustomer.css';

function AddAdminCustomer() {
  const formRef = useRef(null); 
  const [admincustomerData, setAdminCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post('http://localhost:3001/customer', admincustomerData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setMessage({ text: 'Customer added successfully!', type: 'success' });
        setAdminCustomerData({ name: '', email: '', phone: '', address: '' });
        formRef.current.scrollIntoView({ behavior: 'smooth' }); // Scrolls form into view
      } else {
        setMessage({ text: 'Error: Could not add customer.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error: Unable to connect to the server.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-admin-customer-wrapper" ref={formRef}>
      {/* Title Section */}
      <div className="admin-title-section">
        <h3>Add Customer</h3>
      </div>

      {/* Form Section */}
      <div className="admin-form-section">
        {message && (
          <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-customer-form">
          <div className="adminrow">
            <div className="admin-field-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={admincustomerData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="admin-field-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={admincustomerData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="adminrow">
            <div className="admin-field-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={admincustomerData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="admin-field-group">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={admincustomerData.address}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="admin-submit-button" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Customer'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAdminCustomer;


















































































// import React, { useRef, useState } from 'react';
// import './AddAdminCustomer.css'; 

// function AddAdminCustomer() {
//   const formRef = useRef(null); // Ref for the form
//   const [admincustomerData, setAdminCustomerData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//   });
//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAdminCustomerData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage(null);

//     try {
//       const response = await fetch('http://localhost:3000/customer', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(admincustomerData),
//       });

//       if (response.ok) {
//         setMessage({ text: 'Customer added successfully!', type: 'success' });
//         setAdminCustomerData({ name: '', email: '', phone: '', address: '' });
//         formRef.current.scrollIntoView({ behavior: 'smooth' }); // Scrolls form into view
//       } else {
//         setMessage({ text: 'Error: Could not add customer.', type: 'error' });
//       }
//     } catch (error) {
//       setMessage({ text: 'Error: Unable to connect to the server.', type: 'error' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="add-admin-customer-wrapper" ref={formRef}>
//       {/* Title Section */}
//       <div className="admin-title-section">
//         <h3>Add Customer</h3>
//       </div>

//       {/* Form Section */}
//       <div className="admin-form-section">
//         {message && (
//           <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="admin-customer-form">
//           <div className="adminrow">
//             <div className="admin-field-group">
//               <label htmlFor="name">Name:</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={admincustomerData.name}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="admin-field-group">
//               <label htmlFor="email">Email:</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={admincustomerData.email}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           <div className="adminrow">
//             <div className="admin-field-group">
//               <label htmlFor="phone">Phone:</label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={admincustomerData.phone}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="admin-field-group">
//               <label htmlFor="address">Address:</label>
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 value={admincustomerData.address}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           <button type="submit" className="admin-submit-button" disabled={isLoading}>
//             {isLoading ? 'Adding...' : 'Add Customer'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddAdminCustomer;



