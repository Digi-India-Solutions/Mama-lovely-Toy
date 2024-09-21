import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Components/Loading/Loading';

const UpdateOrder = () => {
    const { _id } = useParams();
    const [orderDetail, setOrderDetail] = useState(null);
    const [status, setStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrderDetail = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-order-by-id/${_id}`);
            setOrderDetail(response.data.data);
            setStatus(response.data.data.orderStatus); // Initialize status state
        } catch (error) {
            console.error('Error fetching Order:', error);
            toast.error('Failed to fetch Order!');
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [_id]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const updateOrderStatus = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/update-order-status/${_id}`, {
                orderStatus: status
            });
            setOrderDetail(response.data.order);
            toast.success('Order status updated successfully!');
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update Order status!');
        } finally {
            setIsUpdating(false);
        }
    };

    if (!orderDetail) 
        return <Loading/>

    

    return (
        <>
            <ToastContainer />

            <div className="bread">
                <div className="head">
                    <h4>Update Order</h4>
                </div>
                <div className="links">
                    <Link to="/all-orders" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <section className="update-order-section mt-3">

                <div className="row">

                    {/* Order Summary Table */}
                    <div className="col-md-7 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Order Summary</h5>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td><strong>Address:</strong></td>
                                            <td>{orderDetail.address}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>City:</strong></td>
                                            <td>{orderDetail.city}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Postal Code:</strong></td>
                                            <td>{orderDetail.postalCode}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>State:</strong></td>
                                            <td>{orderDetail.state}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Payment Method:</strong></td>
                                            <td>{orderDetail.paymentMethod}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Payment Status:</strong></td>
                                            <td>{orderDetail.paymentStatus}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Order Status:</strong></td>
                                            <td>{orderDetail.orderStatus}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Coupon Code:</strong></td>
                                            <td>{orderDetail.couponCode || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Price:</strong></td>
                                            <td>₹{orderDetail.totalPrice.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Order Date:</strong></td>
                                            <td>{new Date(orderDetail.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* Update Status Form */}
                                <div className="mt-4">
                                    <h5>Update Order Status</h5>
                                    <form onSubmit={updateOrderStatus}>
                                        <div className="form-group">
                                            <label htmlFor="status">Order Status</label>
                                            <select
                                                id="status"
                                                className="form-control"
                                                value={status}
                                                onChange={handleStatusChange}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary mt-3"
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? 'Updating...' : 'Update Status'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Information Table */}
                    <div className="col-md-5 mb-4">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">User Information</h5>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td><strong>Name:</strong></td>
                                            <td>{orderDetail.user.name}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Email:</strong></td>
                                            <td>{orderDetail.user.email}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Phone:</strong></td>
                                            <td>{orderDetail.user.phoneNumber}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Cart Items</h5>
                                {orderDetail.cartItems.length > 0 ? (
                                    orderDetail.cartItems.map((item) => (
                                        <div key={item._id} className="cart-item mb-3">
                                            <div className="row align-items-center">
                                                <div className="col-md-4 mb-3 mb-md-0">
                                                    {/* Check if product and productImage are defined */}
                                                    {item.product && item.product.productImage && (
                                                        <img 
                                                            src={item.product.productImage.url} 
                                                            alt={item.product.name} 
                                                            className="img-fluid rounded" 
                                                        />
                                                    )}
                                                </div>
                                                <div className="col-md-8">
                                                    <h6>{item.product ? item.product.name : 'Unknown Product'}</h6>
                                                    <table className="table table-sm table-bordered">
                                                        <tbody>
                                                            <tr>
                                                                <td><strong>Color:</strong></td>
                                                                <td>{item.variant.color}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Size:</strong></td>
                                                                <td>{item.variant.size}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Quantity:</strong></td>
                                                                <td>{item.quantity}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Price:</strong></td>
                                                                <td>₹{item.variant.price.toFixed(2)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>MRP:</strong></td>
                                                                <td>₹{item.variant.mrp}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No items in the cart.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </>
    );
};

export default UpdateOrder;
