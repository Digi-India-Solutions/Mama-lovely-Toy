import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';
import { getCartItems } from '../../pages/CartPage/cartUtils';
import cartGif from './shopping-cart.gif';
import axios from 'axios';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [discountedTotal, setDiscountedTotal] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState(null);
    const [savings, setSavings] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [userToken, setUserToken] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Check if user is logged in
        const user = localStorage.getItem('mamaLovelyToyUser');
        if (user) {
            setUserToken(true);
        }

        // Fetch cart items and calculate total price
        const items = getCartItems();
        setCartItems(items);

        // Calculate total price
        const total = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
        setTotalPrice(total);
    }, []);

    const handleQuantityChange = (productId, delta) => {
        const updatedItems = cartItems.map((item) => {
            if (item.product._id === productId) {
                return {
                    ...item,
                    quantity: item.quantity + delta,
                };
            }
            return item;
        }).filter(item => item.quantity > 0); // Remove items with 0 quantity

        setCartItems(updatedItems);
        localStorage.setItem('MamaLovelyCart', JSON.stringify(updatedItems));

        // Recalculate total price
        const newTotal = updatedItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
        setTotalPrice(newTotal);
    };

    const handleRemoveItem = (productId) => {
        const updatedItems = cartItems.filter((item) => item.product._id !== productId);
        setCartItems(updatedItems);
        localStorage.setItem('MamaLovelyCart', JSON.stringify(updatedItems));

        // Recalculate total price
        const newTotal = updatedItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
        setTotalPrice(newTotal);
    };

    const handleApplyCoupon = async () => {
        if (!userToken) return; // Ensure user is logged in

        setIsApplyingCoupon(true); // Disable button while applying coupon
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/apply-vouchers`, {
                CouponeCode: couponCode,
                orderTotal: totalPrice
            });

            const { discountedTotal, discountPercentage } = response.data.data;

            // Calculate savings
            const savingsAmount = totalPrice - discountedTotal;

            setDiscountedTotal(discountedTotal);
            setDiscountPercentage(discountPercentage); // Store discount percentage
            setSavings(savingsAmount); // Store savings amount
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(error.response ? error.response.data.error : 'Error applying coupon');
            setDiscountedTotal(null);
            setDiscountPercentage(null);
            setSavings(null);
        } finally {
            setIsApplyingCoupon(false); // Re-enable button
        }
    };

    const handleProceedToCheckout = () => {
        if (!userToken) return; // Ensure user is logged in

        // Store relevant data in localStorage before checkout
        localStorage.setItem('checkoutDetails', JSON.stringify({
            cartItems,
            totalPrice: discountedTotal || totalPrice,
            couponCode,
        }));

        // Navigate to checkout page
        navigate('/checkout');
    };

    return (
        <>
            <section className="bread">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <h1 className='breadcrumb-title'>Your Cart</h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Cart</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="cart-page py-5">
                <div className="container">
                    <div className="row">
                        {cartItems.length === 0 ? (
                            <div className="col-md-6 blank-cart mx-auto text-center">
                                <div className="row">
                                    <div className="col-md-6 mx-auto text-center">
                                        <img src={cartGif} alt="Cart Gif" />
                                    </div>
                                </div>
                                <h4>Your cart is empty.</h4>
                                <div className='view-more-container'>
                                    <Link to={`/`} className='viewMoreBtn'>Add Item <i className="fa-solid fa-plus"></i></Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="col-md-8 mb-4">
                                    <div className="cart-items">
                                        {cartItems.map(item => (
                                            <div className="cart-item" key={item.product._id}>
                                                <img src={item.product.productImage} alt={item.product.name} className="cart-item-image" />
                                                <div className="cart-item-details">
                                                    <h4 className='mb-0'>{item.product.name}</h4>
                                                    <p className="item-price">Price: ₹{item.variant.price.toLocaleString()}</p>
                                                    <div className="quantity-control">
                                                        <button onClick={() => handleQuantityChange(item.product._id, -1)} disabled={item.quantity === 1}>-</button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => handleQuantityChange(item.product._id, 1)}>+</button>
                                                    </div>
                                                    <button className="remove-btn" onClick={() => handleRemoveItem(item.product._id)}>Remove</button>
                                                </div>
                                                <div className="cart-item-total">
                                                    <p>Total: ₹{(item.variant.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="cart-summary">
                                        <h2>Summary</h2>
                                        <p className="d-flex justify-content-between align-items-center">Total Items : <span>{cartItems.length} Items</span></p>
                                        <p className="d-flex justify-content-between align-items-center">
                                            Total Price :
                                            <span>₹{discountedTotal ? discountedTotal.toLocaleString() : totalPrice.toLocaleString()}</span>
                                        </p>

                                        {savings !== null && (
                                            <p className="d-flex justify-content-between align-items-center text-success " style={{ fontWeight: "500" }}>
                                                You Saved :
                                                <span>₹{savings.toLocaleString()}</span>
                                            </p>
                                        )}

                                        <div className="coupon-section">
                                            <input
                                                type="text"
                                                placeholder="Enter coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                disabled={!userToken} // Disable if not logged in
                                            />
                                            <button
                                                className="apply-coupon-btn"
                                                onClick={handleApplyCoupon}
                                                disabled={!userToken || isApplyingCoupon} // Disable if not logged in or applying coupon
                                            >
                                                {isApplyingCoupon ? 'Applying...' : 'Apply Coupon'}
                                            </button>
                                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                                        </div>

                                        {userToken ? (
                                            <>
                                                <button
                                                    className="checkout-btn"
                                                    onClick={handleProceedToCheckout}
                                                    disabled={!userToken} // Disable if not logged in
                                                >
                                                    Proceed to Checkout
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link to="/login" className="checkout-btn">Please Login To Proceed</Link>
                                                <p className="error-message text-danger text-center ">Please log in to proceed to checkout.</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default CartPage;
