import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [viewType, setViewType] = useState('list'); // Default to list view

  const itemsPerPage = 5;

  useEffect(() => {
    // Fetch products from the backend API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://your-backend-api.com/products'); // Replace with your actual API endpoint
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Apply filters and search logic
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.price.toString().includes(searchQuery)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, sortOrder, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const openModal = (product, type) => {
    setSelectedProduct({ ...product });
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handleUpdate = () => {
    setProducts(
      products.map((product) => (product.id === selectedProduct.id ? selectedProduct : product))
    );
    setIsModalOpen(false);
  };

  const toggleView = (view) => {
    setViewType(view); // 'list' or 'card'
  };

  return (
    <div className="product-list-container">
      <h2>Product List</h2>

      {/* Filter and Sorting Section */}
      <div className="filter-sort-container">
        <input
          type="text"
          placeholder="Search by name, description, category, or price"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="sort-dropdown"
        >
          <option value="">Category</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Groceries">Groceries</option>
          <option value="Footwear">Footwear</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-dropdown"
        >
          <option value="asc">Sort ASC</option>
          <option value="desc">Sort DESC</option>
        </select>
      </div>

      {/* Admin View Mode Dropdown */}
      <div className="admin-view-mode-dropdown">
        {/* Hamburger Menu Icon */}
        <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
          &#9776;
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="admin-dropdown-menu">
            <button onClick={() => toggleView('list')}>List View</button>
            <button onClick={() => toggleView('card')}>Card View</button>
          </div>
        )}
      </div>

      {/* Product List Display */}
      {viewType === 'list' ? (
        <table className="Product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.category}</td>
                <td>
                  <button className="action-button view" onClick={() => openModal(product, 'view')}>View</button>
                  <button className="action-button update" onClick={() => openModal(product, 'update')}>Update</button>
                  <button className="action-button delete" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="product-card-container">
          {paginatedProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.name}</h3>
              <p>Id: {product.id}</p>
              <p>Description: {product.description}</p>
              <p>Price: {product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Category: {product.category}</p>
              <div className="product-card-actions">
                <button className="action-button view" onClick={() => openModal(product, 'view')}>View</button>
                <button className="action-button update" onClick={() => openModal(product, 'update')}>Update</button>
                <button className="action-button delete" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalType === 'view' ? 'View Product' : 'Update Product'}</h2>
            <div>
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={selectedProduct.name || ''}
                onChange={handleInputChange}
                disabled={modalType === 'view'}
              />
            </div>
            <div>
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={selectedProduct.description || ''}
                onChange={handleInputChange}
                disabled={modalType === 'view'}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={selectedProduct.price || ''}
                onChange={handleInputChange}
                disabled={modalType === 'view'}
              />
            </div>
            <div>
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={selectedProduct.quantity || ''}
                onChange={handleInputChange}
                disabled={modalType === 'view'}
              />
            </div>
            <div>
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={selectedProduct.category || ''}
                onChange={handleInputChange}
                disabled={modalType === 'view'}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setIsModalOpen(false)}>Close</button>
              {modalType === 'update' && (
                <button onClick={handleUpdate}>Update</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;




















































// import React, { useState, useEffect } from 'react';
// import './ProductList.css';

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [sortOrder, setSortOrder] = useState('asc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState('');
//   const [showMenu, setShowMenu] = useState(false);
//   const [viewType, setViewType] = useState('list'); // Default to list view

//   const itemsPerPage = 5;

//   const dummyData = [
//     { id: 1, name: 'Product A', description: 'Description of Product A', price: 100, quantity: 10, category: 'Electronics' },
//     { id: 2, name: 'Product B', description: 'Description of Product B', price: 200, quantity: 5, category: 'Clothing' },
//     { id: 3, name: 'Product C', description: 'Description of Product C', price: 50, quantity: 20, category: 'Groceries' },
//     { id: 4, name: 'Product D', description: 'Description of Product D', price: 150, quantity: 8, category: 'Electronics' },
//     { id: 5, name: 'Product E', description: 'Description of Product E', price: 300, quantity: 12, category: 'Clothing' },
//     { id: 6, name: 'Product F', description: 'Description of Product F', price: 80, quantity: 25, category: 'Groceries' },
//   ];

//   useEffect(() => {
//     // Fetch the products from an API or use dummy data
//     const fetchProducts = async () => {
//       try {
//         const response = { data: dummyData }; // Simulating an API response
//         setProducts(response.data);
//         setFilteredProducts(response.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     let filtered = products;

//     // Apply filters and search logic
//     if (searchQuery) {
//       filtered = filtered.filter((product) =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.price.toString().includes(searchQuery)
//       );
//     }

//     if (categoryFilter) {
//       filtered = filtered.filter((product) => product.category === categoryFilter);
//     }

//     if (sortOrder === 'asc') {
//       filtered.sort((a, b) => a.name.localeCompare(b.name));
//     } else {
//       filtered.sort((a, b) => b.name.localeCompare(a.name));
//     }

//     setFilteredProducts(filtered);
//   }, [searchQuery, categoryFilter, sortOrder, products]);

//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePreviousPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const handleDelete = (id) => {
//     setProducts(products.filter((product) => product.id !== id));
//   };

//   const openModal = (product, type) => {
//     setSelectedProduct({ ...product });
//     setModalType(type);
//     setIsModalOpen(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedProduct({ ...selectedProduct, [name]: value });
//   };

//   const handleUpdate = () => {
//     setProducts(
//       products.map((product) => (product.id === selectedProduct.id ? selectedProduct : product))
//     );
//     setIsModalOpen(false);
//   };

//   const toggleView = (view) => {
//     setViewType(view); // 'list' or 'card'
//   };

//   return (
//     <div className="product-list-container">
//       <h2>Product List</h2>

//       {/* Filter and Sorting Section */}
//       <div className="filter-sort-container">
//         <input
//           type="text"
//           placeholder="Search by name, description, category, or price"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="search-input"
//         />

//         <select
//           value={categoryFilter}
//           onChange={(e) => setCategoryFilter(e.target.value)}
//           className="sort-dropdown"
//         >
//           <option value="">Category</option>
//           <option value="Clothing">Clothing</option>
//           <option value="Electronics">Electronics</option>
//           <option value="Groceries">Groceries</option>
//           <option value="Footwear">Footwear</option>
//         </select>

//         <select
//           value={sortOrder}
//           onChange={(e) => setSortOrder(e.target.value)}
//           className="sort-dropdown"
//         >
//           <option value="asc">Sort ASC</option>
//           <option value="desc">Sort DESC</option>
//         </select>
//       </div>

//       {/* Admin View Mode Dropdown */}
//       <div className="admin-view-mode-dropdown">
//         {/* Hamburger Menu Icon */}
//         <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
//           &#9776;
//         </button>

//         {/* Dropdown Menu */}
//         {showMenu && (
//           <div className="admin-dropdown-menu">
//             <button onClick={() => toggleView('list')}>List View</button>
//             <button onClick={() => toggleView('card')}>Card View</button>
//           </div>
//         )}
//       </div>

//       {/* Product List Display */}
//       {viewType === 'list' ? (
//         <table className="Product-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Product Name</th>
//               <th>Description</th>
//               <th>Price</th>
//               <th>Quantity</th>
//               <th>Category</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedProducts.map((product) => (
//               <tr key={product.id}>
//                 <td>{product.id}</td>
//                 <td>{product.name}</td>
//                 <td>{product.description}</td>
//                 <td>{product.price}</td>
//                 <td>{product.quantity}</td>
//                 <td>{product.category}</td>
//                 <td>
//                   <button className="action-button view" onClick={() => openModal(product, 'view')}>View</button>
//                   <button className="action-button update" onClick={() => openModal(product, 'update')}>Update</button>
//                   <button className="action-button delete" onClick={() => handleDelete(product.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <div className="product-card-container">
//           {paginatedProducts.map((product) => (
//             <div className="product-card" key={product.id}>
//               <h3>{product.name}</h3>
//               <p>Id: {product.id}</p>
//               <p>Description: {product.description}</p>
//               <p>Price: {product.price}</p>
//               <p>Quantity: {product.quantity}</p>
//               <p>Category: {product.category}</p>
//               <div className="product-card-actions">
//                 <button className="action-button view" onClick={() => openModal(product, 'view')}>View</button>
//                 <button className="action-button update" onClick={() => openModal(product, 'update')}>Update</button>
//                 <button className="action-button delete" onClick={() => handleDelete(product.id)}>Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="pagination">
//         <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
//         <span>{currentPage} of {totalPages}</span>
//         <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>{modalType === 'view' ? 'View Product' : 'Update Product'}</h2>
//             <div>
//               <label>Product Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={selectedProduct.name || ''}
//                 onChange={handleInputChange}
//                 disabled={modalType === 'view'}
//               />
//             </div>
//             <div>
//               <label>Description</label>
//               <input
//                 type="text"
//                 name="description"
//                 value={selectedProduct.description || ''}
//                 onChange={handleInputChange}
//                 disabled={modalType === 'view'}
//               />
//             </div>
//             <div>
//               <label>Price</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={selectedProduct.price || ''}
//                 onChange={handleInputChange}
//                 disabled={modalType === 'view'}
//               />
//             </div>
//             <div>
//               <label>Quantity</label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={selectedProduct.quantity || ''}
//                 onChange={handleInputChange}
//                 disabled={modalType === 'view'}
//               />
//             </div>
//             <div>
//               <label>Category</label>
//               <input
//                 type="text"
//                 name="category"
//                 value={selectedProduct.category || ''}
//                 onChange={handleInputChange}
//                 disabled={modalType === 'view'}
//               />
//             </div>
//             <div className="modal-buttons">
//               <button onClick={() => setIsModalOpen(false)}>Close</button>
//               {modalType === 'update' && (
//                 <button onClick={handleUpdate}>Update</button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;






















