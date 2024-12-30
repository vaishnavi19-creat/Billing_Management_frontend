import React, { useState } from 'react';
import './QuotationPage.css';

const QuotationPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [quotationNumber] = useState('QT12345');
    const [quotationDate] = useState('2024-12-16');
    const [quotationTerms] = useState('Payment due within 30 days.');

    const productList = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 150 },
        { id: 3, name: 'Product 3', price: 200 }
    ];

    const addProduct = () => {
        const selectedProductData = productList.find(product => product.id === parseInt(selectedProduct));
        const total = selectedProductData.price * quantity;

        setProducts([
            ...products,
            {
                id: selectedProductData.id,
                name: selectedProductData.name,
                price: selectedProductData.price,
                quantity,
                total
            }
        ]);
        setQuantity(1); // Reset quantity input
    };

    const removeProduct = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
    };

    const getSubtotal = () => {
        return products.reduce((sum, product) => sum + product.total, 0);
    };

    const getTax = () => {
        return getSubtotal() * 0.10;
    };

    const getTotal = () => {
        return getSubtotal() + getTax();
    };

    return (
        <div className="quotation-container">
            <div className="shop-info">
                <h4>Shop Information</h4>
                <p><strong>Shop Name:</strong> ABC Store</p>
                <p><strong>Owner:</strong> John Doe</p>
                <p><strong>Address:</strong> 123 Main St, City</p>
            </div>

            <div className="quotation-details">
                <h5>Quotation Details</h5>
                <div className="form-group">
                    <label htmlFor="quotation-number">Quotation Number</label>
                    <input type="text" id="quotation-number" value={quotationNumber} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="quotation-date">Date</label>
                    <input type="date" id="quotation-date" value={quotationDate} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="quotation-terms">Terms</label>
                    <textarea id="quotation-terms" rows="4" value={quotationTerms} readOnly></textarea>
                </div>
            </div>

            <div className="product-section">
                <h5>Select Products</h5>
                <div className="form-group">
                    <label htmlFor="product-select">Product</label>
                    <select id="product-select" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                        <option value="">-- Select Product --</option>
                        {productList.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name} - ${product.price}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                </div>
                <button onClick={addProduct}>Add Product</button>
            </div>

            <div className="quotation-products">
                <h5>Selected Products</h5>
                <table id="product-list">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>${product.price}</td>
                                <td>${product.total}</td>
                                <td><button onClick={() => removeProduct(index)}>Remove</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="quotation-summary">
                <h4>Summary</h4>
                <p><strong>Subtotal:</strong> ${getSubtotal().toFixed(2)}</p>
                <p><strong>Tax (10%):</strong> ${getTax().toFixed(2)}</p>
                <p><strong>Total:</strong> ${getTotal().toFixed(2)}</p>
            </div>

            <div className="actions quotation">
                <button onClick={() => alert('Quotation Saved')}>Save Quotation</button>
                <button onClick={() => alert('PDF Generated')}>Generate PDF</button>
            </div>
        </div>
    );
};

export default QuotationPage;
