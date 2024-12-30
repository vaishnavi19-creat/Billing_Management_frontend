import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css';

const AddProduct = ({ searchQuery }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    stock: 0,
    category: '',
    keywords: '',
    shop_id: '',
    unit_id: '',
    base_unit: '',       // Base unit for conversion
    target_unit: '',     // Target unit for conversion
    conversion_factor: 1 // Conversion factor between units
  });

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch available products 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/product');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.price.toString().includes(searchQuery)
        );
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  console.log(filteredProducts);

  // Handle changes in input fields
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle unit conversion
  const handleUnitConversion = () => {
    if (product.base_unit && product.target_unit && product.conversion_factor) {
      const convertedQuantity = product.quantity * product.conversion_factor;
      setProduct((prevProduct) => ({
        ...prevProduct,
        quantity: convertedQuantity,
      }));
      alert(`Quantity converted to ${convertedQuantity} ${product.target_unit}`);
    }
  };

  // Submit form to add a new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/product', product);
      alert(response.data.message || 'Product added successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to add product');
    }
  };

  return (
    <div className="add-product-container">.
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={product.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input name="category" value={product.category} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <input name="price" type="number" value={product.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input name="quantity" type="number" value={product.quantity} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" value={product.stock} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Keywords</label>
            <input name="keywords" value={product.keywords} onChange={handleChange} />
          </div>
        </div>

        {/* Additional fields for Unit Conversion */}
        <div className="form-row">
          <div className="form-group">
            <label>Base Unit</label>
            <input name="base_unit" value={product.base_unit} onChange={handleChange} placeholder="e.g., kg" />
          </div>
          <div className="form-group">
            <label>Target Unit</label>
            <input name="target_unit" value={product.target_unit} onChange={handleChange} placeholder="e.g., g" />
          </div>
          <div className="form-group">
            <label>Conversion Factor</label>
            <input
              name="conversion_factor"
              type="number"
              value={product.conversion_factor}
              onChange={handleChange}
              placeholder="e.g., 1000"
            />
          </div>
          <button type="button" onClick={handleUnitConversion}>Convert Quantity</button>
        </div>

        <button type="submit" className="submit-button">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;




