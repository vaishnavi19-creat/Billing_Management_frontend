import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddInvoice.css';

const AddInvoice = () => {
    const [shopId, setShopId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState('Direct');
    const [taxAmount, setTaxAmount] = useState(0);
    const [items, setItems] = useState([{ productId: '', productName: '', quantity: 1, price: 0, total: 0 }]);
    const [subtotal, setSubtotal] = useState(0);
    const [createdBy] = useState(1);

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    // New state for storing invoices
    const [invoices, setInvoices] = useState([]);

    // Fetch customers, products, and invoices for the selected shop
    useEffect(() => {
        axios.get(`/api/admin/customers?shopId=${shopId}`).then((res) => setCustomers(res.data));
        axios.get(`/api/admin/products?shopId=${shopId}`).then((res) => setProducts(res.data));
        axios.get('/api/admin/invoices').then((res) => setInvoices(res.data));  // Fetch invoices
    }, [shopId]);

    const handleAddItem = () => {
        setItems([...items, { productId: '', productName: '', quantity: 1, price: 0, total: 0 }]);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        if (field === 'quantity' || field === 'price') {
            newItems[index].total = newItems[index].quantity * newItems[index].price;
        }
        setItems(newItems);
    };

    const calculateTotal = () => {
        // Calculate subtotal
        const newSubtotal = items.reduce((acc, item) => acc + item.total, 0);
        setSubtotal(newSubtotal);

        // Apply discount
        const discountValue = discountType === 'Percentage' ? (newSubtotal * discount) / 100 : discount;

        // Calculate final amount after applying tax and discount
        const total = newSubtotal - discountValue + taxAmount;
        setAmount(total);
    };

    const handleSubmit = async () => {
        try {
            const invoiceData = {
                shopId,
                customerId,
                amount,
                paymentMode,
                invoiceNumber,
                dueDate,
                discount,
                discountType,
                taxAmount,
                items,
                createdBy,
                createdOn: new Date(),
            };

            const response = await axios.post('/api/v1.0/invoice', invoiceData);

            // Update the invoices state with the new invoice
            setInvoices([...invoices, response.data]);

            alert(`Invoice created successfully with ID: ${response.data.invoiceId}`);
        } catch (error) {
            console.error('Error creating invoice', error);
        }
    };

    return (
        <div className="invoice-container">
            <h2>Create New Invoice</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-section">
                    <div className="form-group">
                        <label>Shop ID:</label>
                        <input type="text" value={shopId} onChange={(e) => setShopId(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Customer:</label>
                        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Payment Mode:</label>
                        <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="Online">Online</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Due Date:</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Invoice Number:</label>
                        <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                    </div>
                </div>

                <div className="items-section">
                    <h3>Items</h3>
                    {items.map((item, index) => (
                        <div key={index} className="item-group">
                            <select
                                value={item.productId}
                                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            >
                                <option value="">Select Product</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                            />
                            <span>Total: {item.total.toFixed(2)}</span>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddItem}>
                        Add Item
                    </button>
                </div>

                <div className="summary-section">
                    <h3>Invoice Summary</h3>
                    <div className="form-group">
                        <label>Subtotal:</label>
                        <span>{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="form-group">
                        <label>Discount:</label>
                        <input
                            type="number"
                            placeholder="Discount"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value))}
                        />
                        <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                            <option value="Direct">Direct</option>
                            <option value="Percentage">Percentage</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Tax Amount:</label>
                        <input
                            type="number"
                            placeholder="Tax"
                            value={taxAmount}
                            onChange={(e) => setTaxAmount(Number(e.target.value))}
                        />
                    </div>
                    <div className="form-group">
                        <label>Total Amount:</label>
                        <span>{amount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={calculateTotal}>
                        Calculate Total
                    </button>
                    <button type="button" onClick={handleSubmit}>
                        Create Invoice
                    </button>
                </div>
            </form>

            
        </div>
    );
};

export default AddInvoice;
