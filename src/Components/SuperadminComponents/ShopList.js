import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ShopList.css';

const ShopList = () => {
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [packageFilter, setPackageFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1); // For pagination
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
    const [selectedShop, setSelectedShop] = useState(null); // For update and view
    const [isModalOpen, setIsModalOpen] = useState(false); // For modal
    const [modalType, setModalType] = useState(''); // 'view' or 'update'

    const [isMenuOpen, setIsMenuOpen] = useState(false); // For hamburger menu

    const itemsPerPage = 5; // Number of shops per page

    // Simulate API URL
    const apiUrl = 'https://api/v1.0/shop'; // Replace with your API URL

    // Fetch data from API
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get(apiUrl);
                setShops(response.data);
                setFilteredShops(response.data);
            } catch (error) {
                console.error('Error fetching shops:', error);
            }
        };

        fetchShops();
    }, []);

    // Filter and sort logic
    useEffect(() => {
        let filtered = shops;

        if (searchQuery) {
            filtered = filtered.filter(shop =>
                shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.id.toString().includes(searchQuery) ||
                shop.shopType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(shop => shop.shopType === categoryFilter);
        }

        if (packageFilter) {
            filtered = filtered.filter(shop => shop.packageType === packageFilter);
        }

        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredShops(filtered);
    }, [searchQuery, categoryFilter, packageFilter, sortOrder, shops]);

    // Pagination logic
    const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
    const paginatedShops = filteredShops.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle delete operation
    const handleDelete = (id) => {
        setShops(shops.filter(shop => shop.id !== id));
    };

    // Toggle view modes
    const toggleViewMode = (mode) => {
        setViewMode(mode);
        setIsMenuOpen(false); // Close the menu after selecting a view mode
    };

    // Open modal for update or view
    const openModal = (shop, type) => {
        setSelectedShop({ ...shop });
        setModalType(type);
        setIsModalOpen(true);
    };

    // Handle input change for updating shop
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedShop({ ...selectedShop, [name]: value });
    };

    // Handle update submission
    const handleUpdate = () => {
        setShops(shops.map(shop => shop.id === selectedShop.id ? selectedShop : shop));
        setIsModalOpen(false);
    };

    return (
        <div className="shop-list-container">
            <h2>Shop List</h2>

            {/* Filter and Sorting Section */}
            <div className="filter-sort-container">
                <input
                    type="text"
                    placeholder="Search by name, owner, location, ID, or type"
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
                    <option value="General">General Shop</option>
                    <option value="Medical">Medical</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Clothes">Clothes</option>
                </select>

                <select
                    value={packageFilter}
                    onChange={(e) => setPackageFilter(e.target.value)}
                    className="sort-dropdown"
                >
                    <option value="">Filter by Package</option>
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="sort-dropdown"
                >
                    <option value="asc">Sort ASC</option>
                    <option value="desc">Sort DESC</option>
                </select>

                {/* Hamburger Icon for View Toggle */}
                <div className="hamburger-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    &#9776; {/* Hamburger icon */}
                </div>

                {/* Dropdown for List/Card View */}
                {isMenuOpen && (
                    <div className="view-dropdown">
                        <button onClick={() => toggleViewMode('list')}>List View</button>
                        <button onClick={() => toggleViewMode('card')}>Card View</button>
                    </div>
                )}
            </div>


            {/* Shop List */}
            {viewMode === 'list' ? (
                <table className="shop-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Shop Name</th>
                            <th>Owner Name</th>
                            <th>Location</th>
                            <th>Shop Type</th>
                            <th>Package Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedShops.map(shop => (
                            <tr key={shop.id}>
                                <td>{shop.id}</td>
                                <td>{shop.name}</td>
                                <td>{shop.ownerName}</td>
                                <td>{shop.location}</td>
                                <td>{shop.shopType}</td>
                                <td>{shop.packageType}</td>
                                <td>
                                    <button className="action-button view" onClick={() => openModal(shop, 'view')}>View</button>
                                    <button className="action-button update" onClick={() => openModal(shop, 'update')}>Update</button>
                                    <button className="action-button delete" onClick={() => handleDelete(shop.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="shop-cards">
                    {paginatedShops.map(shop => (
                        <div key={shop.id} className="shop-card">
                            <h3>{shop.name}</h3>
                            <p>Owner: {shop.ownerName}</p>
                            <p>Location: {shop.location}</p>
                            <p>Type: {shop.shopType}</p>
                            <p>Package: {shop.packageType}</p>
                            <button className="action-button view" onClick={() => openModal(shop, 'view')}>View</button>
                            <button className="action-button update" onClick={() => openModal(shop, 'update')}>Update</button>
                            <button className="action-button delete" onClick={() => handleDelete(shop.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{modalType === 'view' ? 'View Shop' : 'Update Shop'}</h3>
                        <form>
                            <div>
                                <label>Name:</label>
                                <input type="text" name="name" value={selectedShop.name} readOnly={modalType === 'view'} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label>Owner Name:</label>
                                <input type="text" name="ownerName" value={selectedShop.ownerName} readOnly={modalType === 'view'} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label>Location:</label>
                                <input type="text" name="location" value={selectedShop.location} readOnly={modalType === 'view'} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label>Shop Type:</label>
                                <input type="text" name="shopType" value={selectedShop.shopType} readOnly={modalType === 'view'} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label>Package Type:</label>
                                <input type="text" name="packageType" value={selectedShop.packageType} readOnly={modalType === 'view'} onChange={handleInputChange} />
                            </div>

                            {modalType === 'update' && (
                                <div>
                                    <button type="button" onClick={handleUpdate}>Save Changes</button>
                                </div>
                            )}
                        </form>
                        <button className="close-modal" onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopList;




























































// import React, { useState, useEffect } from 'react';
// import './css/ShopList.css';

// const ShopList = () => {
//     const [shops, setShops] = useState([]);
//     const [filteredShops, setFilteredShops] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [categoryFilter, setCategoryFilter] = useState('');
//     const [packageFilter, setPackageFilter] = useState('');
//     const [sortOrder, setSortOrder] = useState('asc');
//     const [currentPage, setCurrentPage] = useState(1); // For pagination
//     const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
//     const [selectedShop, setSelectedShop] = useState(null); // For update and view
//     const [isModalOpen, setIsModalOpen] = useState(false); // For modal
//     const [modalType, setModalType] = useState(''); // 'view' or 'update'

//     const [isMenuOpen, setIsMenuOpen] = useState(false); // For hamburger menu

//     const itemsPerPage = 5; // Number of shops per page

//     // Dummy data simulating backend response
//     const dummyData = [
//         {
//             id: 1,
//             name: 'General Store',
//             ownerName: 'John Doe',
//             location: 'New York',
//             shopType: 'General',
//             packageType: 'Basic',
//         },
//         {
//             id: 2,
//             name: 'Medical Supplies',
//             ownerName: 'Jane Smith',
//             location: 'California',
//             shopType: 'Medical',
//             packageType: 'Standard',
//         },
//         {
//             id: 3,
//             name: 'Footwear Hub',
//             ownerName: 'Alice Brown',
//             location: 'Texas',
//             shopType: 'Footwear',
//             packageType: 'Premium',
//         },
//         {
//             id: 4,
//             name: 'Electrical Bazaar',
//             ownerName: 'Bob Johnson',
//             location: 'Florida',
//             shopType: 'Electrical',
//             packageType: 'Basic',
//         },
//         {
//             id: 5,
//             name: 'Fashion Paradise',
//             ownerName: 'Sara Lee',
//             location: 'Nevada',
//             shopType: 'Clothes',
//             packageType: 'Standard',
//         },
//         {
//             id: 6,
//             name: 'Tech World',
//             ownerName: 'Mike Davis',
//             location: 'Washington',
//             shopType: 'Electronics',
//             packageType: 'Premium',
//         },
//     ];

//     // Simulate API call
//     useEffect(() => {
//         const fetchShops = async () => {
//             try {
//                 // Simulating an API call
//                 const response = { data: dummyData };
//                 setShops(response.data);
//                 setFilteredShops(response.data);
//             } catch (error) {
//                 console.error('Error fetching shops:', error);
//             }
//         };

//         fetchShops();
//     }, []);

//     // Filter and sort logic
//     useEffect(() => {
//         let filtered = shops;

//         if (searchQuery) {
//             filtered = filtered.filter(shop =>
//                 shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 shop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 shop.id.toString().includes(searchQuery) ||
//                 shop.shopType.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         if (categoryFilter) {
//             filtered = filtered.filter(shop => shop.shopType === categoryFilter);
//         }

//         if (packageFilter) {
//             filtered = filtered.filter(shop => shop.packageType === packageFilter);
//         }

//         if (sortOrder === 'asc') {
//             filtered.sort((a, b) => a.name.localeCompare(b.name));
//         } else {
//             filtered.sort((a, b) => b.name.localeCompare(a.name));
//         }

//         setFilteredShops(filtered);
//     }, [searchQuery, categoryFilter, packageFilter, sortOrder, shops]);

//     // Pagination logic
//     const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
//     const paginatedShops = filteredShops.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     const handlePreviousPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const handleNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     // Handle delete operation
//     const handleDelete = (id) => {
//         setShops(shops.filter(shop => shop.id !== id));
//     };

//     // Toggle view modes
//     const toggleViewMode = (mode) => {
//         setViewMode(mode);
//         setIsMenuOpen(false); // Close the menu after selecting a view mode
//     };

//     // Open modal for update or view
//     const openModal = (shop, type) => {
//         setSelectedShop({ ...shop });
//         setModalType(type);
//         setIsModalOpen(true);
//     };

//     // Handle input change for updating shop
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setSelectedShop({ ...selectedShop, [name]: value });
//     };

//     // Handle update submission
//     const handleUpdate = () => {
//         setShops(shops.map(shop => shop.id === selectedShop.id ? selectedShop : shop));
//         setIsModalOpen(false);
//     };

//     return (
//         <div className="shop-list-container">
//             <h2>Shop List</h2>

//             {/* Filter and Sorting Section */}
//             <div className="filter-sort-container">
//                 <input
//                     type="text"
//                     placeholder="Search by name, owner, location, ID, or type"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="search-input"
//                 />

//                 <select
//                     value={categoryFilter}
//                     onChange={(e) => setCategoryFilter(e.target.value)}
//                     className="sort-dropdown"
//                 >
//                     <option value="">Category</option>
//                     <option value="General">General Shop</option>
//                     <option value="Medical">Medical</option>
//                     <option value="Footwear">Footwear</option>
//                     <option value="Electrical">Electrical</option>
//                     <option value="Clothes">Clothes</option>
//                 </select>

//                 <select
//                     value={packageFilter}
//                     onChange={(e) => setPackageFilter(e.target.value)}
//                     className="sort-dropdown"
//                 >
//                     <option value="">Filter by Package</option>
//                     <option value="Basic">Basic</option>
//                     <option value="Standard">Standard</option>
//                     <option value="Premium">Premium</option>
//                 </select>

//                 <select
//                     value={sortOrder}
//                     onChange={(e) => setSortOrder(e.target.value)}
//                     className="sort-dropdown"
//                 >
//                     <option value="asc">Sort ASC</option>
//                     <option value="desc">Sort DESC</option>
//                 </select>

//                 {/* Hamburger Icon for View Toggle */}
//                 <div className="hamburger-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//                     &#9776; {/* Hamburger icon */}
//                 </div>

//                 {/* Dropdown for List/Card View */}
//                 {isMenuOpen && (
//                     <div className="view-dropdown">
//                         <button onClick={() => toggleViewMode('list')}>List View</button>
//                         <button onClick={() => toggleViewMode('card')}>Card View</button>
//                     </div>
//                 )}
//             </div>


//             {/* Shop List */}
//             {viewMode === 'list' ? (
//                 <table className="shop-table">
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Shop Name</th>
//                             <th>Owner Name</th>
//                             <th>Location</th>
//                             <th>Shop Type</th>
//                             <th>Package Type</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {paginatedShops.map(shop => (
//                             <tr key={shop.id}>
//                                 <td>{shop.id}</td>
//                                 <td>{shop.name}</td>
//                                 <td>{shop.ownerName}</td>
//                                 <td>{shop.location}</td>
//                                 <td>{shop.shopType}</td>
//                                 <td>{shop.packageType}</td>
//                                 <td>
//                                     <button className="action-button view" onClick={() => openModal(shop, 'view')}>View</button>
//                                     <button className="action-button update" onClick={() => openModal(shop, 'update')}>Update</button>
//                                     <button className="action-button delete" onClick={() => handleDelete(shop.id)}>Delete</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ) : (
//                 <div className="shop-cards">
//                     {paginatedShops.map(shop => (
//                         <div key={shop.id} className="shop-card">
//                             <h3>{shop.name}</h3>
//                             <p>Owner: {shop.ownerName}</p>
//                             <p>Location: {shop.location}</p>
//                             <p>Type: {shop.shopType}</p>
//                             <p>Package: {shop.packageType}</p>
//                             <button className="action-button view" onClick={() => openModal(shop, 'view')}>View</button>
//                             <button className="action-button update" onClick={() => openModal(shop, 'update')}>Update</button>
//                             <button className="action-button delete" onClick={() => handleDelete(shop.id)}>Delete</button>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Pagination */}
//             <div className="pagination">
//                 <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
//                 <span>Page {currentPage} of {totalPages}</span>
//                 <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
//             </div>

//             {/* Modal */}
//             {isModalOpen && (
//                 <div className="modal">
//                     <div className="modal-content">
//                         <h3>{modalType === 'view' ? 'View Shop' : 'Update Shop'}</h3>
//                         <form>
//                             <div>
//                                 <label>Name:</label>
//                                 <input type="text" name="name" value={selectedShop.name} readOnly={modalType === 'view'} onChange={handleInputChange} />
//                             </div>
//                             <div>
//                                 <label>Owner Name:</label>
//                                 <input type="text" name="ownerName" value={selectedShop.ownerName} readOnly={modalType === 'view'} onChange={handleInputChange} />
//                             </div>
//                             <div>
//                                 <label>Location:</label>
//                                 <input type="text" name="location" value={selectedShop.location} readOnly={modalType === 'view'} onChange={handleInputChange} />
//                             </div>
//                             <div>
//                                 <label>Shop Type:</label>
//                                 <input type="text" name="shopType" value={selectedShop.shopType} readOnly={modalType === 'view'} onChange={handleInputChange} />
//                             </div>
//                             <div>
//                                 <label>Package Type:</label>
//                                 <input type="text" name="packageType" value={selectedShop.packageType} readOnly={modalType === 'view'} onChange={handleInputChange} />
//                             </div>

//                             {modalType === 'update' && (
//                                 <div>
//                                     <button type="button" onClick={handleUpdate}>Save Changes</button>
//                                 </div>
//                             )}
//                         </form>
//                         <button className="close-modal" onClick={() => setIsModalOpen(false)}>Close</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ShopList;





































































