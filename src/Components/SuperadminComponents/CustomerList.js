import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './css/CustomerList.css';

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [viewType, setViewType] = useState('list');
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch customer data from backend API using Axios
    axios
      .get('https://api/v1.0/customer') // Replace with your actual backend API URL
      .then((response) => {
        setCustomers(response.data); // Assuming the response data is an array of customers
        setFilteredCustomers(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching customer data:', error);
      });
  }, []);

  useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'asc') return a[sortField]?.localeCompare(b[sortField]);
      return b[sortField]?.localeCompare(a[sortField]);
    });

    setFilteredCustomers(sorted);
  }, [searchQuery, customers, sortField, sortOrder]);

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const handleUpdateCustomer = (id) => {
    setIsEditing(true);
    setCurrentCustomer(customers.find((customer) => customer.id === id));
    setIsModalOpen(true);
  };

  const handleViewCustomer = (id) => {
    setIsEditing(false);
    setCurrentCustomer(customers.find((customer) => customer.id === id));
    setIsModalOpen(true);
  };

  const handleAddShop = () => {
    navigate('/add-shop'); // Navigate to the Add Shop page
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };

  const handleSave = () => {
    setCustomers(
      customers.map((customer) =>
        customer.id === currentCustomer.id ? currentCustomer : customer
      )
    );
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(firstIndex, lastIndex);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredCustomers.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleView = (type) => {
    setViewType(type);
    setShowMenu(false); // Close the menu after selection
  };

  return (
    <div className="customer-list-container">
      <h2>Customer List</h2>

      {/* Filter and Sorting Section */}
      <div className="filter-sort-container">
        <input
          type="text"
          placeholder="Search by name, email, phone or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="sort-dropdown"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="phone">Sort by Phone</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-dropdown"
        >
          <option value="asc">Sort ASC</option>
          <option value="desc">Sort DESC</option>
        </select>

        {/* View Mode Toggle */}
        <div className="view-mode-dropdown">
          <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
            &#9776;
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => toggleView('list')}>List View</button>
              <button onClick={() => toggleView('card')}>Card View</button>
            </div>
          )}
        </div>
      </div>

      {/* Render Customers in List or Card View */}
      {viewType === 'list' ? (
        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>

                  <td>
                    <button
                      className="action-button view"
                      onClick={() => handleViewCustomer(customer.id)}
                    >
                      View
                    </button>
                    <button
                      className="action-button update"
                      onClick={() => handleUpdateCustomer(customer.id)}
                    >
                      Update
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      Delete
                    </button>

                    <button
                      className="action-button add-shop"
                      onClick={handleAddShop}
                    >
                      Add Shop
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="card-container">
          {currentCustomers.map((customer) => (
            <div className="customer-card" key={customer.id}>
              <h3>{customer.name}</h3>
              <p>Email: {customer.email}</p>
              <p>Phone: {customer.phone}</p>
              <p>Address: {customer.address}</p>

              <div className="card-actions">
                <button
                  className="action-button view"
                  onClick={() => handleViewCustomer(customer.id)}
                >
                  View
                </button>
                <button
                  className="action-button update"
                  onClick={() => handleUpdateCustomer(customer.id)}
                >
                  Update
                </button>
                <button
                  className="action-button delete"
                  onClick={() => handleDeleteCustomer(customer.id)}
                >
                  Delete
                </button>
                <button
                  className="action-button add-shop"
                  onClick={handleAddShop}
                >
                  Add Shop
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && currentCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Customer' : 'View Customer'}</h3>
            <form>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={currentCustomer.name || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={currentCustomer.email || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </label>
              <label>
                Phone:
                <input
                  type="tel"
                  name="phone"
                  value={currentCustomer.phone || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={currentCustomer.address || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </label>

              {isEditing && (
                <button type="button" onClick={handleSave}>
                  Save
                </button>
              )}
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage >= Math.ceil(filteredCustomers.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomerList;































































// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './css/CustomerList.css';

// const CustomerList = () => {
//   const navigate = useNavigate();
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortField, setSortField] = useState('name');
//   const [sortOrder, setSortOrder] = useState('asc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5);
//   const [viewType, setViewType] = useState('list');
//   const [showMenu, setShowMenu] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentCustomer, setCurrentCustomer] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     // Dummy Data for Testing
//     const dummyData = [
//       { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890', address: 'abd' },
//       { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '2345678901', address: 'abd' },
//       { id: 3, name: 'Alice Brown', email: 'alice.brown@example.com', phone: '3456789012', address: 'abd' },
//       { id: 4, name: 'Bob White', email: 'bob.white@example.com', phone: '4567890123', address: 'abd' },
//       { id: 5, name: 'Charlie Black', email: 'charlie.black@example.com', phone: '5678901234', address: 'abd' },
//       { id: 6, name: 'Daisy Green', email: 'daisy.green@example.com', phone: '6789012345', address: 'abd' },
//       { id: 7, name: 'Ethan Blue', email: 'ethan.blue@example.com', phone: '7890123456', address: 'abd' },
//       { id: 8, name: 'Fiona Red', email: 'fiona.red@example.com', phone: '8901234567', address: 'abd' },
//     ];
//     setCustomers(dummyData);
//     setFilteredCustomers(dummyData);
//   }, []);

//   useEffect(() => {
//     const filtered = customers.filter((customer) =>
//       customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       customer.phone.includes(searchQuery)
//     );

//     const sorted = [...filtered].sort((a, b) => {
//       if (sortOrder === 'asc') return a[sortField]?.localeCompare(b[sortField]);
//       return b[sortField]?.localeCompare(a[sortField]);
//     });

//     setFilteredCustomers(sorted);
//   }, [searchQuery, customers, sortField, sortOrder]);

//   const handleDeleteCustomer = (id) => {
//     setCustomers(customers.filter((customer) => customer.id !== id));
//   };

//   const handleUpdateCustomer = (id) => {
//     setIsEditing(true);
//     setCurrentCustomer(customers.find((customer) => customer.id === id));
//     setIsModalOpen(true);
//   };

//   const handleViewCustomer = (id) => {
//     setIsEditing(false);
//     setCurrentCustomer(customers.find((customer) => customer.id === id));
//     setIsModalOpen(true);
//   };
   
  
//   const handleAddShop = () => {
//     navigate('/add-shop'); // Navigate to the Add Shop page
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentCustomer({ ...currentCustomer, [name]: value });
//   };

//   const handleSave = () => {
//     setCustomers(
//       customers.map((customer) =>
//         customer.id === currentCustomer.id ? currentCustomer : customer
//       )
//     );
//     setIsEditing(false);
//     setIsModalOpen(false);
//   };

//   const lastIndex = currentPage * itemsPerPage;
//   const firstIndex = lastIndex - itemsPerPage;
//   const currentCustomers = filteredCustomers.slice(firstIndex, lastIndex);

//   const handleNextPage = () => {
//     if (currentPage < Math.ceil(filteredCustomers.length / itemsPerPage)) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   const toggleView = (type) => {
//     setViewType(type);
//     setShowMenu(false); // Close the menu after selection
//   };

//   return (
//     <div className="customer-list-container">
//       <h2>Customer List</h2>

//       {/* Filter and Sorting Section */}
//       <div className="filter-sort-container">
//         <input
//           type="text"
//           placeholder="Search by name, email, phone or address"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="search-input"
//         />

//         <select
//           value={sortField}
//           onChange={(e) => setSortField(e.target.value)}
//           className="sort-dropdown"
//         >
//           <option value="name">Sort by Name</option>
//           <option value="email">Sort by Email</option>
//           <option value="phone">Sort by Phone</option>
//         </select>

//         <select
//           value={sortOrder}
//           onChange={(e) => setSortOrder(e.target.value)}
//           className="sort-dropdown"
//         >
//           <option value="asc">Sort ASC</option>
//           <option value="desc">Sort DESC</option>
//         </select>

//         {/* View Mode Toggle */}
//         <div className="view-mode-dropdown">
//           <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
//             &#9776;
//           </button>
//           {showMenu && (
//             <div className="dropdown-menu">
//               <button onClick={() => toggleView('list')}>List View</button>
//               <button onClick={() => toggleView('card')}>Card View</button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Render Customers in List or Card View */}
//       {viewType === 'list' ? (
//         <table className="customer-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Address</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentCustomers.length > 0 ? (
//               currentCustomers.map((customer) => (
//                 <tr key={customer.id}>
//                   <td>{customer.id}</td>
//                   <td>{customer.name}</td>
//                   <td>{customer.email}</td>
//                   <td>{customer.phone}</td>
//                   <td>{customer.address}</td>

//                   <td>
//                     <button
//                       className="action-button view"
//                       onClick={() => handleViewCustomer(customer.id)}
//                     >
//                       View
//                     </button>
//                     <button
//                       className="action-button update"
//                       onClick={() => handleUpdateCustomer(customer.id)}
//                     >
//                       Update
//                     </button>
//                     <button
//                       className="action-button delete"
//                       onClick={() => handleDeleteCustomer(customer.id)}
//                     >
//                       Delete
//                     </button>

//                       <button
//                       className="action-button add-shop"
//                         onClick={handleAddShop}
//                         >
//                         Add Shop
//                         </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5">No customers found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       ) : (
//         <div className="card-container">
//           {currentCustomers.map((customer) => (
//             <div className="customer-card" key={customer.id}>
//               <h3>{customer.name}</h3>
//               <p>Email: {customer.email}</p>
//               <p>Phone: {customer.phone}</p>
//               <p>Address: {customer.address}</p>

//               <div className="card-actions">
//                 <button
//                   className="action-button view"
//                   onClick={() => handleViewCustomer(customer.id)}
//                 >
//                   View
//                 </button>
//                 <button
//                   className="action-button update"
//                   onClick={() => handleUpdateCustomer(customer.id)}
//                 >
//                   Update
//                 </button>
//                 <button
//                   className="action-button delete"
//                   onClick={() => handleDeleteCustomer(customer.id)}
//                 >
//                   Delete
//                 </button>
//                     <button
//                       className="action-button add-shop"
//                       onClick={handleAddShop}
//                     >
//                       Add Shop
//                     </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal */}
//       {isModalOpen && currentCustomer && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>{isEditing ? 'Edit Customer' : 'View Customer'}</h3>
//             <form>
//               <label>
//                 Name:
//                 <input
//                   type="text"
//                   name="name"
//                   value={currentCustomer.name || ''}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                 />
//               </label>
//               <label>
//                 Email:
//                 <input
//                   type="email"
//                   name="email"
//                   value={currentCustomer.email || ''}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                 />
//               </label>
//               <label>
//                 Phone:
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={currentCustomer.phone || ''}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                 />
//               </label>
//               <label>
//                 Address:
//                 <input
//                   type="text"
//                   name="address"
//                   value={currentCustomer.address || ''}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                 />
//               </label>

//               {isEditing && (
//                 <button type="button" onClick={handleSave}>
//                   Save
//                 </button>
//               )}
//               <button type="button" onClick={() => setIsModalOpen(false)}>
//                 Close
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="pagination-container">
//         <button
//           className="pagination-button"
//           onClick={handlePreviousPage}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>{currentPage}</span>
//         <button
//           className="pagination-button"
//           onClick={handleNextPage}
//           disabled={currentPage >= Math.ceil(filteredCustomers.length / itemsPerPage)}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CustomerList;





































































