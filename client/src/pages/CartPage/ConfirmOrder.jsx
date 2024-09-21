import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ConfirmOrder.css';
import axios from 'axios';

const ConfirmOrder = () => {
  const { orderID } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);

  const fetchOrderById = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-order-by-id/${orderID}`);
      console.log('Order Id response:', res.data.data);
      setOrderDetail(res.data.data);
    } catch (error) {
      console.error('Error in fetch Order:', error);
    }
  };

  useEffect(() => {
    fetchOrderById();
  }, [orderID]);

  if (!orderDetail) {
    return <p>Loading...</p>;
  }

  return (
    <section className="confirm-order-section py-5">
      <div className="container">
        <div className="row">
          {/* Confirmation Message */}
          <div className="col-md-12 text-center">
            <h2><i className="fa-solid fa-circle-check"></i> Thank You for Your Order! </h2>
            <p>Your order has been placed successfully. You will receive a confirmation email shortly.</p>
          </div>

          {/* Order Summary */}
          <div className="col-md-6 mx-auto mb-2">
            <div className="checkout-order-summary">
              <p>Order ID: <span>{orderDetail._id}</span></p>
              <p>Payment Method: <span>{orderDetail.paymentMethod}</span></p>
              <p>Total Price: <span>₹{orderDetail.totalPrice.toFixed(2)}</span></p>
              {/* Add any additional fields as necessary */}
            </div>
          </div>

          {/* Order Actions */}
          <div className="col-md-12 text-center view-more-container py-0">
            <Link to="/" className="viewMoreBtn">Continue Shopping</Link> &nbsp;
            <Link to={`/my-orders/${orderID}`} className="viewMoreBtn">View Order History</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmOrder;
