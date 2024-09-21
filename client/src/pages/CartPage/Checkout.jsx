import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Checkout.css';
import axios from 'axios';

const statesAndCities = {
    // Define your state and city data here...
};

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderData, setOrderData] = useState({
        user: '',
        name: '',
        phone: '',
        state: '',
        city: '',
        address: '',
        postalCode: '',
        cartItems: [],
        paymentMethod: 'cod',
        totalPrice: 0,
        couponCode: ""
    });

    const navigate = useNavigate();
    const userID = localStorage.getItem('mamaLovelyToyUser');
    const IDUser = JSON.parse(userID);

    // Load cart details from localStorage
    useEffect(() => {
        const checkoutDetails = JSON.parse(localStorage.getItem('checkoutDetails')) || {};
        const storedCartItems = checkoutDetails.cartItems || [];
        const storedTotalPrice = checkoutDetails.totalPrice || 0;
        const storedCouponCode = checkoutDetails.couponCode || 0;

        setCartItems(storedCartItems);
        setTotalPrice(storedTotalPrice);

        if (IDUser && IDUser._id) {
            setOrderData((prevData) => ({
                ...prevData,
                user: IDUser._id,
                cartItems: storedCartItems,
                totalPrice: storedTotalPrice,
                couponCode: storedCouponCode
            }));
        }
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData({ ...orderData, [name]: value });
    };

    // Handle payment method changes
    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
        setOrderData({ ...orderData, paymentMethod: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        console.log(orderData);
        e.preventDefault();
        try {
            if(orderData.paymentMethod === "cod"){
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-order`, orderData);
                console.log('Order response:', res.data);
                navigate(`/order-confirm/${res.data.order._id}`);
            } else {
                
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h1 className="breadcrumb-title">Checkout</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Checkout
                            </li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="checkout-section py-5">
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Delivery Details */}
                            <div className="col-md-6 mb-4">
                                <h3>Delivery Details</h3>


                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        id="fullName"
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="state"
                                        id="state"
                                        onChange={handleChange}
                                        placeholder="Enter your State name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city"
                                        id="city"
                                        onChange={handleChange}
                                        placeholder="Enter your City name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        placeholder="Enter your address"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="postalCode"
                                        onChange={handleChange}
                                        id="postalCode"
                                        placeholder="Enter your postal code"
                                        required
                                    />
                                </div>


                            </div>
                            <div className="col-md-6">
                                {/* Payment Information */}
                                <h3>Payment Information</h3>
                                <div className="payment-options">
                                    <div className="payment-option">
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={handlePaymentChange}
                                        />
                                        <label htmlFor="cod">Cash on Delivery</label>
                                    </div>
                                    <div className="payment-option">
                                        <input
                                            type="radio"
                                            id="razorpay"
                                            name="paymentMethod"
                                            value="razorpay"
                                            checked={paymentMethod === 'razorpay'}
                                            onChange={handlePaymentChange}
                                        />
                                        <label htmlFor="razorpay">Razorpay Online Payment</label>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="order-summary">
                                    <h3>Order Summary</h3>
                                    <div className="summary-details">
                                        <p>Items: <span>{cartItems.length}</span></p>
                                        <p>Total: <span>₹{totalPrice}</span></p>
                                    </div>
                                    <button className="place-order" type="submit">Place Order</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Checkout;
