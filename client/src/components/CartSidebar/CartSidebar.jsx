import React, { useState } from 'react';
import './CartSidebar.css';


import pic2 from '../../Assets/Picture2.png';
import pic3 from '../../Assets/Picture3.png';


const CartSidebar = ({ isOpen, toggleSidebar }) => {
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const cartItems = [
        {
            prodName: "Eco Panda Magic Car",
            proImage: pic2,
            proPrice: 452,
            size: "20x45x22",
        },
        {
            prodName: "Musical Activity Walker",
            proImage: pic3,
            proPrice: 785,
            size: "20x45x22",
        },
    ]

    return (
        <>
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="d-flex align-items-center justify-content-between cart-head" >
                    <h2>Cart</h2>
                    <button className="close-btn" onClick={toggleSidebar}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="cart-content">

                    {cartItems && cartItems.map((cartItem, index) => (
                        <div className="cart-item px-2">
                            <img src={cartItem.proImage} alt={cartItem.prodName} />
                            <div className="item-details">
                                <p>{cartItem.prodName}</p>
                                <p>₹{cartItem.proPrice}</p>
                                <p>{cartItem.size}</p>
                                <div className="quantity-selector">
                                    <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
                                    <input type="text" value={quantity} readOnly />
                                    <button className="quantity-btn" onClick={increaseQuantity}>+</button>
                                </div>
                            </div>
                        </div>

                    ))}
                    {/* Repeat for other cart items */}
                    <div className="cart-summary d-flex flex-column justify-content-between">
                        <div>
                            <p className="d-flex justify-content-between"><span>Cart total:</span> <span>₹2900.00</span></p>
                            <p className="d-flex justify-content-between"><span>Tax:</span> <span>₹29.00</span></p>
                            <p className="subtotal d-flex justify-content-between"><span>Subtotal:</span> <span>₹2929.00</span></p>
                        </div>
                        <button className="checkout-btn mt-3">Proceed to Checkout</button>
                    </div>

                </div>
            </div>
            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </>
    );
};

export default CartSidebar;
