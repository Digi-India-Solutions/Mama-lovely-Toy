import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const AllOrders = () => {

    const [Orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-orders`);
            setOrders(response.data.data.reverse());
        } catch (error) {
            console.error('Error fetching Orders:', error);
            toast.error('Failed to fetch Orders!');
        }
    };
    useEffect(() => {

        fetchOrders();
    }, []);

    const handleDeleteOrder = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-order/${id}`);
                    setOrders(Orders.filter(cat => cat._id !== id));
                    toast.success("Order deleted successfully!");
                } catch (error) {
                    console.error('Error deleting Order:', error);
                    toast.error('Failed to delete Order!');
                }
            }
        });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Pagination calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Orders.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Orders</h4>
                </div>
                <div className="links">
                    <button onClick={fetchOrders} className="add-new">Refresh <i class="fa-solid fa-rotate"></i></button>
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Order ID</th>
                            <th scope="col">User Name</th>
                            <th scope="col">Products</th>
                            <th scope="col">Total Price</th>
                            <th scope="col">Order Status</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Payment Method</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((order, index) => (
                            <tr key={order._id}>
                                <th scope="row">{index + 1 + indexOfFirstItem}</th>
                                <td><Link to={`/edit-order/${order._id}`}>{order._id}</Link></td>
                                <td>{order.user.name}</td>
                                <td>
                                    {order.cartItems.map(item => (
                                        <div key={item._id}>
                                            {item.product.name} (x{item.quantity})
                                        </div>
                                    ))}
                                </td>
                                <td>₹{order.totalPrice.toFixed(2)}</td>
                                <td>{order.orderStatus}</td>
                                <td>{order.paymentStatus}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <button onClick={() => handleDeleteOrder(order._id)} className="bt delete">
                                        Delete <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(Orders.length / itemsPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>
        </>
    )
}

export default AllOrders